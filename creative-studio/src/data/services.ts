export type ServiceGraphic =
  | "website"
  | "meta-ads"
  | "google-ads"
  | "social"
  | "branding"
  | "growth";

export type ServiceLayout =
  | "feature"
  | "compact"
  | "standard";

export type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  graphic: ServiceGraphic;
  layout: ServiceLayout;
};

export const services: Service[] = [
  {
    id: "website-design-development",
    number: "01",
    title: "Website Design & Development",
    description: "Beautiful design. Powerful technology.",
    graphic: "website",
    layout: "feature",
  },
  {
    id: "meta-ads",
    number: "02",
    title: "Meta Ads",
    description: "Reach. Engage. Convert.",
    graphic: "meta-ads",
    layout: "compact",
  },
  {
    id: "google-ads",
    number: "03",
    title: "Google Ads",
    description: "Visibility that drives action.",
    graphic: "google-ads",
    layout: "compact",
  },
  {
    id: "social-media-marketing",
    number: "04",
    title: "Social Media Marketing",
    description: "Content that connects.",
    graphic: "social",
    layout: "standard",
  },
  {
    id: "brand-identity-creative-design",
    number: "05",
    title: "Brand Identity & Creative Design",
    description: "Built to stand out.",
    graphic: "branding",
    layout: "standard",
  },
  {
    id: "digital-growth",
    number: "06",
    title: "Digital Growth",
    description: "Strategy. Creativity. Performance.",
    graphic: "growth",
    layout: "standard",
  },
];
