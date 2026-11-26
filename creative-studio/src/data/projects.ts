export type Project = {
  number: string;
  name: string;
  category: string;
  image: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "AFTER / HOURS",
    category: "Digital experience · Concept",
    image: "/images/projects/after-hours.svg",
    imageAlt:
      "Independent digital experience concept with oversized white typography and electric-blue orbital lines.",
  },
  {
    number: "02",
    name: "FORM / FUTURE",
    category: "Brand direction · Concept",
    image: "/images/projects/form-future.svg",
    imageAlt:
      "Independent brand direction concept with a stark black-and-white layout and a vivid blue geometric form.",
  },
  {
    number: "03",
    name: "SIGNAL / SHIFT",
    category: "Campaign art direction · Concept",
    image: "/images/projects/signal-shift.svg",
    imageAlt:
      "Independent campaign concept with a deep-blue field, bold white typography and restrained signal-line graphics.",
  },
];
