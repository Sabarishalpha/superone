import type { MetadataRoute } from "next";
<<<<<<< HEAD
import { PROJECTS } from "./data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/services", "/projects", "/contact", "/orchid-interiors"];
=======
import { getDesignLibrary, getProjects, getServices } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";
const lastModified = new Date("2026-09-10T00:00:00.000Z");

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, designLibrary] = await Promise.all([
    getProjects(),
    getServices(),
    getDesignLibrary(),
  ]);
  const pages = [
    "",
    "/about",
    "/services",
    "/projects",
    "/contact",
    "/design-library",
  ];
>>>>>>> origin/main

  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path}`,
<<<<<<< HEAD
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" || path === "/orchid-interiors" ? 1 : 0.8,
    })),
    ...PROJECTS.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(),
=======
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...designLibrary.map((category) => ({
      url: `${siteUrl}/design-library/${category.slug}`,
      lastModified,
>>>>>>> origin/main
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}