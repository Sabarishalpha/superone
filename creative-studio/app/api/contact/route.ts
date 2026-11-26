import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/src/config/site";
import { services } from "@/src/data/services";
import {
  contactEnquirySchema,
  formatBudgetRange,
  type ContactEnquiry,
} from "@/src/lib/contact-validation";

const MAX_BODY_BYTES = 16_384;
const MIN_FORM_TIME_MS = 2_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = "1 h";

type MemoryLimit = { count: number; resetAt: number };

const memoryLimits = new Map<string, MemoryLimit>();
let distributedLimiter: ReturnType<typeof createDistributedLimiter> | undefined;

async function readLimitedBody(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let bytesRead = 0;
  let body = "";

  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;

    bytesRead += chunk.value.byteLength;
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }

    body += decoder.decode(chunk.value, { stream: true });
  }

  return body + decoder.decode();
}

function createDistributedLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Distributed contact rate limiting is not configured.");
  }

  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(RATE_LIMIT, RATE_LIMIT_WINDOW),
    prefix: "creative-studio:contact",
    analytics: false,
    enableTelemetry: false,
  });
}

function jsonResponse(
  payload: { ok: boolean; error?: string },
  status: number,
  headers?: HeadersInit,
) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function getAlternativeContactMessage() {
  if (siteConfig.whatsappNumber) {
    return " Use the WhatsApp option to send your enquiry.";
  }
  if (siteConfig.contactEmail) {
    return " Use the email link on this page instead.";
  }
  return " Please try again later.";
}

function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const allowedOrigins = new Set<string>([new URL(request.url).origin]);
  if (siteConfig.siteUrl) {
    allowedOrigins.add(siteConfig.siteUrl);
  }

  const requestHost = request.headers.get("host");
  if (requestHost) {
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      new URL(request.url).protocol.slice(0, -1);
    allowedOrigins.add(`${protocol}://${requestHost}`);
  }

  return allowedOrigins.has(originUrl.origin);
}

function getClientAddress(request: NextRequest) {
  const directAddress = request.headers.get("x-real-ip")?.trim();
  if (directAddress) return directAddress;

  const forwardedAddress = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();

  return forwardedAddress || "unknown";
}

function checkMemoryLimit(identifier: string) {
  const now = Date.now();
  const current = memoryLimits.get(identifier);

  if (!current || current.resetAt <= now) {
    memoryLimits.set(identifier, {
      count: 1,
      resetAt: now + 60 * 60 * 1_000,
    });
    return { success: true, resetAt: now + 60 * 60 * 1_000 };
  }

  if (current.count >= RATE_LIMIT) {
    return { success: false, resetAt: current.resetAt };
  }

  current.count += 1;
  return { success: true, resetAt: current.resetAt };
}

async function checkRateLimit(address: string) {
  const identifier = createHash("sha256").update(address).digest("hex");
  const hasUpstashConfig =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (!hasUpstashConfig && process.env.NODE_ENV !== "production") {
    return checkMemoryLimit(identifier);
  }

  distributedLimiter ??= createDistributedLimiter();
  const result = await distributedLimiter.limit(identifier);
  return { success: result.success, resetAt: result.reset };
}

function formatEmail(enquiry: ContactEnquiry) {
  const selectedServices = enquiry.services
    .map((serviceId) => services.find((service) => service.id === serviceId))
    .filter((service) => service !== undefined)
    .map((service) => service.title)
    .join(", ");
  const budget = formatBudgetRange(enquiry.budget, siteConfig.budgetCurrency);

  return [
    `New project enquiry for ${siteConfig.brandName}`,
    "",
    `Services: ${selectedServices}`,
    `Budget: ${budget}`,
    `Name: ${enquiry.name}`,
    `Company: ${enquiry.company}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    "",
    "Project requirements:",
    enquiry.requirements,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) {
    return jsonResponse(
      { ok: false, error: "Request could not be verified." },
      403,
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ ok: false, error: "Send the enquiry as JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { ok: false, error: "The enquiry is too large to submit." },
      413,
    );
  }

  let rawBody: string | null;
  try {
    rawBody = await readLimitedBody(request);
  } catch (error) {
    console.error(
      "Contact request body could not be read.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return jsonResponse(
      { ok: false, error: "The enquiry could not be read." },
      400,
    );
  }

  if (rawBody === null) {
    return jsonResponse(
      { ok: false, error: "The enquiry is too large to submit." },
      413,
    );
  }

  let submittedValue: unknown;
  try {
    submittedValue = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      { ok: false, error: "The enquiry could not be read." },
      400,
    );
  }

  if (
    !submittedValue ||
    typeof submittedValue !== "object" ||
    Array.isArray(submittedValue)
  ) {
    return jsonResponse(
      { ok: false, error: "Complete the enquiry form and try again." },
      400,
    );
  }

  const rawFields = submittedValue as Record<string, unknown>;
  if (
    typeof rawFields.website === "string" &&
    rawFields.website.trim().length > 0
  ) {
    return jsonResponse(
      { ok: false, error: "The enquiry could not be verified." },
      400,
    );
  }

  const parsed = contactEnquirySchema.safeParse(submittedValue);
  if (!parsed.success) {
    return jsonResponse(
      {
        ok: false,
        error:
          parsed.error.issues[0]?.message ??
          "Check your details and try again.",
      },
      400,
    );
  }

  const enquiry = parsed.data;
  const elapsed = Date.now() - enquiry.startedAt;
  if (elapsed < MIN_FORM_TIME_MS || elapsed > MAX_FORM_AGE_MS) {
    return jsonResponse(
      {
        ok: false,
        error:
          "The enquiry could not be verified. Please review and submit again.",
      },
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  const isValidEmail = (value: string | undefined) =>
    Boolean(
      value && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    );
  if (!apiKey || !isValidEmail(from) || !isValidEmail(to)) {
    console.error(
      "Contact delivery is unavailable because email configuration is incomplete.",
    );
    return jsonResponse(
      {
        ok: false,
        error: `Enquiry delivery is not configured yet.${getAlternativeContactMessage()}`,
      },
      503,
    );
  }

  let rateLimit;
  try {
    rateLimit = await checkRateLimit(getClientAddress(request));
  } catch (error) {
    console.error(
      "Contact rate limiting failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return jsonResponse(
      {
        ok: false,
        error:
          "Enquiry protection is temporarily unavailable. Please try again later.",
      },
      503,
    );
  }

  if (!rateLimit.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((rateLimit.resetAt - Date.now()) / 1_000),
    );
    return jsonResponse(
      { ok: false, error: "Too many enquiries. Please try again later." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: enquiry.email,
        subject: `New enquiry — ${siteConfig.brandName}`,
        text: formatEmail(enquiry),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Contact email provider returned a non-success status.",
        response.status,
      );
      return jsonResponse(
        {
          ok: false,
          error: `We could not deliver your enquiry.${getAlternativeContactMessage()}`,
        },
        502,
      );
    }

    return jsonResponse({ ok: true }, 200);
  } catch (error) {
    console.error(
      "Contact email delivery request failed.",
      error instanceof Error ? error.name : "Unknown error",
    );
    return jsonResponse(
      {
        ok: false,
        error: `We could not deliver your enquiry.${getAlternativeContactMessage()}`,
      },
      502,
    );
  }
}
