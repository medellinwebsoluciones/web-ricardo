import { site } from "@/lib/site";
import { getDictionary } from "@/i18n/dictionaries";
import { getInternalContent } from "@/lib/internal-content";
import type { Locale } from "@/i18n/config";

export function JsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = getInternalContent(locale);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Senior Software Architect / Solutions Architect",
    url: `${site.url}/${locale}`,
    image: `${site.url}/images/ricardo-zuluaga.png`,
    email: `mailto:${site.email}`,
    telephone: `+${site.phoneE164}`,
    sameAs: [site.linkedin],
    worksFor: {
      "@type": "Organization",
      name: site.firm,
      url: site.url,
    },
    knowsAbout: [
      "Solutions Architecture",
      "AI Agent Orchestration",
      "CrewAI",
      "Ollama",
      "Retrieval-Augmented Generation (RAG)",
      "Model Context Protocol (MCP)",
      "Python",
      "FastAPI",
      "Django",
      "Docker",
      "Microservices",
      "High Availability Systems",
      "WooCommerce",
      "Bold Payments",
      "LegalTech",
      "Omnichannel Commerce",
    ],
    description: dict.meta.description,
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.firm,
    founder: { "@type": "Person", name: site.name },
    url: site.url,
    areaServed: "Worldwide",
    serviceType: [
      "Solutions Architecture Consulting",
      "AI Automation",
      "Scalable Infrastructure",
      "Commerce Integrations",
      "Payment Integrations",
    ],
    description: dict.meta.description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "es" ? "Servicios de consultoría" : "Consulting services",
      itemListElement: c.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  const portfolio = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.ui.solutionsTitle,
    itemListElement: c.solutions.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: s.title,
        description: s.summary,
        applicationCategory: s.tag,
        url: `${site.url}/${locale}/soluciones/${s.slug}`,
        programmingLanguage: s.stack.slice(0, 5),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolio) }}
      />
    </>
  );
}
