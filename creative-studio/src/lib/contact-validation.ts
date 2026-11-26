import { z } from "zod";
import { services } from "@/src/data/services";

const projectBudgetValues = [
  "under-5k",
  "5k-10k",
  "10k-25k",
  "25k-plus",
] as const;

export const projectBudgetRanges = [
  { value: projectBudgetValues[0], upperBound: 5_000 },
  {
    value: projectBudgetValues[1],
    lowerBound: 5_000,
    upperBound: 10_000,
  },
  {
    value: projectBudgetValues[2],
    lowerBound: 10_000,
    upperBound: 25_000,
  },
  { value: projectBudgetValues[3], lowerBound: 25_000 },
] as const;

const serviceIds = new Set(services.map((service) => service.id));

export const selectedServicesSchema = z
  .array(
    z.string().refine((serviceId) => serviceIds.has(serviceId), {
      message: "Choose a service from the list.",
    }),
  )
  .min(1, "Select at least one service.")
  .max(services.length, "Too many services were selected.");

export const projectBudgetSchema = z.enum(projectBudgetValues);

export const contactDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  company: z.string().trim().min(2, "Enter your company name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number.")
    .max(32, "Phone number is too long.")
    .regex(/^\+?[\d\s().-]+$/, "Use a valid phone number.")
    .refine((phone) => {
      const digitCount = phone.replace(/\D/g, "").length;
      return digitCount >= 7 && digitCount <= 15;
    }, "Use a phone number with 7 to 15 digits."),
});

export const projectRequirementsSchema = z
  .string()
  .trim()
  .min(20, "Add at least 20 characters about your project.")
  .max(3_000, "Project requirements must be 3,000 characters or fewer.");

export const contactEnquirySchema = z
  .object({
    services: selectedServicesSchema,
    budget: projectBudgetSchema,
    ...contactDetailsSchema.shape,
    requirements: projectRequirementsSchema,
    website: z.string().max(120).optional(),
    startedAt: z.number().int().positive(),
  })
  .strict();

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;

export function formatBudgetRange(
  value: (typeof projectBudgetRanges)[number]["value"],
  currency: string,
) {
  const range = projectBudgetRanges.find((item) => item.value === value);
  if (!range) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if ("lowerBound" in range && "upperBound" in range) {
    return `${formatter.format(range.lowerBound)} – ${formatter.format(range.upperBound)}`;
  }

  if ("upperBound" in range) {
    return `Under ${formatter.format(range.upperBound)}`;
  }

  return `${formatter.format(range.lowerBound)}+`;
}
