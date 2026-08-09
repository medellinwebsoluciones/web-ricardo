import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { site } from "@/lib/site";
import { solutionSlugs } from "@/lib/internal-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/para-recruiters",
    "/perfil",
    "/soluciones",
    "/trayectoria",
    "/laboratorio",
    "/servicios",
  ];
  const solutionPaths = solutionSlugs.map((slug) => `/soluciones/${slug}`);
  const paths = [...staticPaths, ...solutionPaths];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority:
        path === ""
          ? locale === "es"
            ? 1
            : 0.9
          : path === "/para-recruiters"
            ? 0.9
            : 0.7,
      alternates: {
        languages: {
          es: `${site.url}/es${path}`,
          en: `${site.url}/en${path}`,
        },
      },
    })),
  );
}
