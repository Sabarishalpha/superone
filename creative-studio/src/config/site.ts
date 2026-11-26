function optionalPublicUrl(
  key: string,
  value: string | undefined,
  options: { allowLocalHttp?: boolean } = {},
) {
  const configuredValue = value?.trim();
  if (!configuredValue) return undefined;

  let url: URL;
  try {
    url = new URL(configuredValue);
  } catch {
    throw new Error(`${key} must be a valid absolute URL.`);
  }

  const isLocalHttp =
    options.allowLocalHttp &&
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");

  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error(`${key} must use HTTPS.`);
  }

  if (url.username || url.password) {
    throw new Error(`${key} must not include URL credentials.`);
  }

  return key === "NEXT_PUBLIC_SITE_URL" ? url.origin : url.toString();
}

function optionalPublicEmail(value: string | undefined) {
  const configuredValue = value?.trim();
  if (!configuredValue) return undefined;

  if (
    configuredValue.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredValue)
  ) {
    throw new Error("NEXT_PUBLIC_CONTACT_EMAIL must be a valid email address.");
  }

  return configuredValue;
}

function optionalWhatsAppNumber(value: string | undefined) {
  const configuredValue = value?.trim();
  if (!configuredValue) return undefined;

  const digits = configuredValue.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) {
    throw new Error(
      "NEXT_PUBLIC_WHATSAPP_NUMBER must include 8 to 15 international digits.",
    );
  }

  return digits;
}

function getBudgetCurrency(value: string | undefined) {
  const currency = value?.trim().toUpperCase() || "USD";

  try {
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });
  } catch {
    throw new Error(
      "NEXT_PUBLIC_BUDGET_CURRENCY must be a valid ISO 4217 currency code.",
    );
  }

  return currency;
}

const socialLinks = [
  {
    label: "Instagram",
    href: optionalPublicUrl(
      "NEXT_PUBLIC_INSTAGRAM_URL",
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    ),
  },
  {
    label: "LinkedIn",
    href: optionalPublicUrl(
      "NEXT_PUBLIC_LINKEDIN_URL",
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
    ),
  },
  {
    label: "Facebook",
    href: optionalPublicUrl(
      "NEXT_PUBLIC_FACEBOOK_URL",
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
    ),
  },
].filter((item): item is { label: string; href: string } => Boolean(item.href));

export const siteConfig = {
  brandName: "SuperOne",
  tagline: "Powering the Next Digital Era.",
  navigationTagline: "DESIGN × TECHNOLOGY × GROWTH",
  siteUrl: optionalPublicUrl(
    "NEXT_PUBLIC_SITE_URL",
    process.env.NEXT_PUBLIC_SITE_URL,
    { allowLocalHttp: true },
  ),
  contactEmail: optionalPublicEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  whatsappNumber: optionalWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  ),
  budgetCurrency: getBudgetCurrency(process.env.NEXT_PUBLIC_BUDGET_CURRENCY),
  socialLinks,
} as const;

export const navigationItems = [
  { id: "home", label: "Home", number: "01" },
  { id: "about", label: "About", number: "02" },
  { id: "work", label: "Work", number: "03" },
  { id: "services", label: "Services", number: "04" },
  { id: "contact", label: "Contact", number: "05" },
] as const;

export type NavigationSection = (typeof navigationItems)[number]["id"];

export const footerNavigationItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "manifesto", label: "Manifesto" },
  { id: "contact", label: "Contact" },
] as const;
