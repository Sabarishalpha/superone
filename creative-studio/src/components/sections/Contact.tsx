"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@/src/config/site";
import { services } from "@/src/data/services";
import {
  contactDetailsSchema,
  formatBudgetRange,
  projectBudgetRanges,
  projectBudgetSchema,
  projectRequirementsSchema,
  selectedServicesSchema,
} from "@/src/lib/contact-validation";
import { gsap, useGSAP } from "@/src/lib/gsap";
import "./Contact.css";

type FormStep = 0 | 1 | 2 | 3;
type ContactDetails = {
  name: string;
  company: string;
  email: string;
  phone: string;
};
type FormNotice = { type: "success" | "error"; message: string } | null;
type ApiResult = { ok?: boolean; error?: string };

const stepNames = ["Services", "Budget", "Your details", "Project brief"];

function getStepError(
  step: FormStep,
  selectedServices: string[],
  budget: string,
  details: ContactDetails,
  requirements: string,
) {
  if (step === 0) {
    const result = selectedServicesSchema.safeParse(selectedServices);
    return result.success
      ? {}
      : { services: result.error.issues[0]?.message ?? "Select a service." };
  }

  if (step === 1) {
    const result = projectBudgetSchema.safeParse(budget);
    return result.success
      ? {}
      : { budget: result.error.issues[0]?.message ?? "Select a budget range." };
  }

  if (step === 2) {
    const result = contactDetailsSchema.safeParse(details);
    if (result.success) return {};

    return Object.fromEntries(
      result.error.issues.map((issue) => [
        String(issue.path[0] ?? "details"),
        issue.message,
      ]),
    );
  }

  const result = projectRequirementsSchema.safeParse(requirements);
  return result.success
    ? {}
    : {
        requirements:
          result.error.issues[0]?.message ??
          "Add a few details about your project.",
      };
}

function makeWhatsAppMessage(
  selectedServices: string[],
  budget: string,
  details: ContactDetails,
  requirements: string,
) {
  const serviceNames = selectedServices
    .map((id) => services.find((service) => service.id === id)?.title)
    .filter((name) => name !== undefined)
    .join(", ");
  const budgetValue = projectBudgetRanges.find(
    (range) => range.value === budget,
  )?.value;
  const budgetLabel = budgetValue
    ? formatBudgetRange(budgetValue, siteConfig.budgetCurrency)
    : "";

  return [
    `New project enquiry — ${siteConfig.brandName}`,
    "",
    `Services: ${serviceNames}`,
    `Budget: ${budgetLabel}`,
    `Name: ${details.name}`,
    `Company: ${details.company}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    "",
    "Project requirements:",
    requirements.trim(),
  ].join("\n");
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const startedAtRef = useRef<number | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [step, setStep] = useState<FormStep>(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState<ContactDetails>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [requirements, setRequirements] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<FormNotice>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const revealItems = section.querySelectorAll<HTMLElement>(
          "[data-contact-reveal]",
        );

        gsap.fromTo(
          revealItems,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      return () => motion.revert();
    },
    { scope: sectionRef },
  );

  useEffect(() => {
    const section = sectionRef.current;
    startedAtRef.current = Date.now();
    if (!section) return;

    const selectService = (event: Event) => {
      const detail = (
        event as CustomEvent<{ serviceId?: unknown; serviceName?: unknown }>
      ).detail;
      const matchedService = services.find(
        (service) =>
          service.id === detail?.serviceId ||
          service.title === detail?.serviceName,
      );
      if (!matchedService) return;

      setSelectedServices([matchedService.id]);
      setStep(0);
      setErrors({});
      setNotice(null);
    };

    section.addEventListener("studio:service-select", selectService);
    return () =>
      section.removeEventListener("studio:service-select", selectService);
  }, []);

  const updateDetails = (field: keyof ContactDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateCurrentStep = () => {
    const nextErrors = getStepError(
      step,
      selectedServices,
      budget,
      details,
      requirements,
    );
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    setNotice(null);
    setStep((current) => Math.min(current + 1, 3) as FormStep);
  };

  const handleBack = () => {
    setNotice(null);
    setErrors({});
    setStep((current) => Math.max(current - 1, 0) as FormStep);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCurrentStep() || isSubmitting) return;

    setIsSubmitting(true);
    setNotice(null);

    const payload = {
      services: selectedServices,
      budget,
      ...details,
      requirements,
      website: honeypotRef.current?.value ?? "",
      startedAt: startedAtRef.current ?? Date.now(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result: ApiResult;
      try {
        result = (await response.json()) as ApiResult;
      } catch {
        setNotice({
          type: "error",
          message: "We couldn't read the response. Please try again.",
        });
        return;
      }

      if (!response.ok || result.ok !== true) {
        setNotice({
          type: "error",
          message:
            result.error ??
            "We couldn't deliver your enquiry. Please try again.",
        });
        return;
      }

      setNotice({
        type: "success",
        message:
          "Enquiry received. We’ll be in touch using the details provided.",
      });
    } catch {
      setNotice({
        type: "error",
        message:
          "Connection failed. Check your internet connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        makeWhatsAppMessage(selectedServices, budget, details, requirements),
      )}`
    : null;
  const progressValue = ((step + 1) / stepNames.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      id="contact"
      aria-labelledby="contact-heading"
    >
      <div className="contact-section__inner">
        <div className="contact-section__intro" data-contact-reveal>
          <p className="contact-section__eyebrow">06 / START A PROJECT</p>
          <h2 className="contact-section__heading" id="contact-heading">
            LET&apos;S BUILD
            <br />
            SOMETHING
            <br />
            <span>EXTRAORDINARY.</span>
          </h2>
          <p className="contact-section__description">
            Tell us what you&apos;re working toward. We&apos;ll take it from
            there.
          </p>
          {siteConfig.contactEmail ? (
            <a
              className="contact-section__email"
              href={`mailto:${siteConfig.contactEmail}`}
            >
              {siteConfig.contactEmail}
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ) : null}
        </div>

        <div className="contact-form-shell" data-contact-reveal>
          <div className="contact-form-shell__top">
            <span>PROJECT ENQUIRY</span>
            <span>
              STEP {String(step + 1).padStart(2, "0")} /{" "}
              {String(stepNames.length).padStart(2, "0")}
            </span>
          </div>
          <div
            className="contact-form-progress"
            role="progressbar"
            aria-label="Enquiry form progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
          >
            <span style={{ transform: `scaleX(${progressValue / 100})` }} />
          </div>

          {notice?.type === "success" ? (
            <div className="contact-success" role="status">
              <span className="contact-success__icon">
                <Check aria-hidden="true" size={22} />
              </span>
              <p className="contact-form__step-label">ENQUIRY SENT</p>
              <h3>Thank you, {details.name}.</h3>
              <p>{notice.message}</p>
              <button
                type="button"
                className="contact-form__text-button"
                onClick={() => {
                  setStep(0);
                  setSelectedServices([]);
                  setBudget("");
                  setDetails({ name: "", company: "", email: "", phone: "" });
                  setRequirements("");
                  setNotice(null);
                  startedAtRef.current = Date.now();
                }}
              >
                SEND ANOTHER ENQUIRY
              </button>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={
                notice?.type === "error" ? "contact-form-error" : undefined
              }
            >
              <p className="contact-form__step-label" aria-live="polite">
                {String(step + 1).padStart(2, "0")} / {stepNames[step]}
              </p>

              {step === 0 ? (
                <fieldset className="contact-form__fieldset">
                  <legend className="contact-form__legend">
                    What can we help you with?
                  </legend>
                  <p className="contact-form__hint">
                    Select all that feel right.
                  </p>
                  <div className="contact-service-options">
                    {services.map((service) => {
                      const selected = selectedServices.includes(service.id);
                      return (
                        <button
                          className={`contact-option${selected ? " contact-option--selected" : ""}`}
                          type="button"
                          aria-pressed={selected}
                          key={service.id}
                          onClick={() => {
                            setSelectedServices((current) =>
                              selected
                                ? current.filter((id) => id !== service.id)
                                : [...current, service.id],
                            );
                            setErrors((current) => ({
                              ...current,
                              services: "",
                            }));
                          }}
                        >
                          <span className="contact-option__number">
                            {service.number}
                          </span>
                          <span className="contact-option__title">
                            {service.title}
                          </span>
                          <span
                            className="contact-option__check"
                            aria-hidden="true"
                          >
                            {selected ? <Check size={15} /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.services ? (
                    <p className="contact-form__field-error" role="alert">
                      {errors.services}
                    </p>
                  ) : null}
                </fieldset>
              ) : null}

              {step === 1 ? (
                <fieldset className="contact-form__fieldset">
                  <legend className="contact-form__legend">
                    What&apos;s your approximate project budget?
                  </legend>
                  <p className="contact-form__hint">
                    A starting point helps us shape the right approach.
                  </p>
                  <div className="contact-budget-options">
                    {projectBudgetRanges.map((range) => (
                      <button
                        className={`contact-option contact-option--budget${budget === range.value ? " contact-option--selected" : ""}`}
                        type="button"
                        aria-pressed={budget === range.value}
                        key={range.value}
                        onClick={() => {
                          setBudget(range.value);
                          setErrors((current) => ({ ...current, budget: "" }));
                        }}
                      >
                        <span className="contact-option__title">
                          {formatBudgetRange(
                            range.value,
                            siteConfig.budgetCurrency,
                          )}
                        </span>
                        <span
                          className="contact-option__check"
                          aria-hidden="true"
                        >
                          {budget === range.value ? <Check size={15} /> : null}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="contact-form__hint">
                    Ranges are shown in {siteConfig.budgetCurrency}.
                  </p>
                  {errors.budget ? (
                    <p className="contact-form__field-error" role="alert">
                      {errors.budget}
                    </p>
                  ) : null}
                </fieldset>
              ) : null}

              {step === 2 ? (
                <fieldset className="contact-form__fieldset">
                  <legend className="contact-form__legend">
                    How can we reach you?
                  </legend>
                  <div className="contact-form__fields">
                    <div className="contact-form__field">
                      <label htmlFor={`contact-name-${id}`}>Name</label>
                      <input
                        autoComplete="name"
                        id={`contact-name-${id}`}
                        name="name"
                        required
                        value={details.name}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? `contact-name-error-${id}` : undefined
                        }
                        onChange={(event) =>
                          updateDetails("name", event.target.value)
                        }
                      />
                      {errors.name ? (
                        <span
                          className="contact-form__field-error"
                          id={`contact-name-error-${id}`}
                        >
                          {errors.name}
                        </span>
                      ) : null}
                    </div>
                    <div className="contact-form__field">
                      <label htmlFor={`contact-company-${id}`}>Company</label>
                      <input
                        autoComplete="organization"
                        id={`contact-company-${id}`}
                        name="company"
                        required
                        value={details.company}
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={
                          errors.company
                            ? `contact-company-error-${id}`
                            : undefined
                        }
                        onChange={(event) =>
                          updateDetails("company", event.target.value)
                        }
                      />
                      {errors.company ? (
                        <span
                          className="contact-form__field-error"
                          id={`contact-company-error-${id}`}
                        >
                          {errors.company}
                        </span>
                      ) : null}
                    </div>
                    <div className="contact-form__field">
                      <label htmlFor={`contact-email-${id}`}>Email</label>
                      <input
                        autoComplete="email"
                        id={`contact-email-${id}`}
                        inputMode="email"
                        name="email"
                        required
                        type="email"
                        value={details.email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? `contact-email-error-${id}` : undefined
                        }
                        onChange={(event) =>
                          updateDetails("email", event.target.value)
                        }
                      />
                      {errors.email ? (
                        <span
                          className="contact-form__field-error"
                          id={`contact-email-error-${id}`}
                        >
                          {errors.email}
                        </span>
                      ) : null}
                    </div>
                    <div className="contact-form__field">
                      <label htmlFor={`contact-phone-${id}`}>Phone</label>
                      <input
                        autoComplete="tel"
                        id={`contact-phone-${id}`}
                        inputMode="tel"
                        name="phone"
                        required
                        type="tel"
                        value={details.phone}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={
                          errors.phone ? `contact-phone-error-${id}` : undefined
                        }
                        onChange={(event) =>
                          updateDetails("phone", event.target.value)
                        }
                      />
                      {errors.phone ? (
                        <span
                          className="contact-form__field-error"
                          id={`contact-phone-error-${id}`}
                        >
                          {errors.phone}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </fieldset>
              ) : null}

              {step === 3 ? (
                <fieldset className="contact-form__fieldset">
                  <legend className="contact-form__legend">
                    Tell us what you&apos;re building.
                  </legend>
                  <label
                    className="contact-form__hint"
                    htmlFor={`contact-requirements-${id}`}
                  >
                    Goals, timing, ideas — give us the useful details.
                  </label>
                  <textarea
                    id={`contact-requirements-${id}`}
                    name="requirements"
                    rows={6}
                    maxLength={3_000}
                    required
                    value={requirements}
                    aria-invalid={Boolean(errors.requirements)}
                    aria-describedby={
                      errors.requirements
                        ? `contact-requirements-error-${id}`
                        : `contact-requirements-count-${id}`
                    }
                    onChange={(event) => {
                      setRequirements(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        requirements: "",
                      }));
                    }}
                  />
                  <div className="contact-form__textarea-meta">
                    {errors.requirements ? (
                      <span
                        className="contact-form__field-error"
                        id={`contact-requirements-error-${id}`}
                        role="alert"
                      >
                        {errors.requirements}
                      </span>
                    ) : (
                      <span id={`contact-requirements-count-${id}`}>
                        {requirements.length} / 3,000
                      </span>
                    )}
                  </div>
                  <label className="contact-form__honeypot" aria-hidden="true">
                    Leave this field empty
                    <input
                      ref={honeypotRef}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </label>
                </fieldset>
              ) : null}

              {notice?.type === "error" ? (
                <p
                  className="contact-form__notice contact-form__notice--error"
                  id="contact-form-error"
                  role="alert"
                >
                  {notice.message}
                </p>
              ) : null}

              <div className="contact-form__actions">
                <button
                  className="contact-form__back"
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0 || isSubmitting}
                >
                  <ArrowLeft aria-hidden="true" size={16} />
                  BACK
                </button>

                {step < 3 ? (
                  <button
                    className="contact-form__next"
                    type="button"
                    onClick={handleNext}
                  >
                    NEXT
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                ) : (
                  <div className="contact-form__submit-actions">
                    {whatsappUrl ? (
                      <a
                        className="contact-form__whatsapp"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => {
                          if (!validateCurrentStep()) event.preventDefault();
                        }}
                      >
                        WHATSAPP
                        <ArrowUpRight aria-hidden="true" size={15} />
                      </a>
                    ) : null}
                    <button
                      className="contact-form__next"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "SENDING..." : "SEND ENQUIRY"}
                      <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
