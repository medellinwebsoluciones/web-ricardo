"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/config";

type Props = { locale: Locale };

type FlowStep = {
  id: string;
  title: string;
  body: string;
  surface: string;
};

type Feature = {
  title: string;
  body: string;
  tag: string;
};

const copy = {
  es: {
    eyebrow: "Flujo de aprendizaje",
    title: "Arquitectura del journey: de visitante a alumno certificado",
    intro:
      "El LMS no es solo un catalogo de lecciones. Es un embudo de producto digital con pagos idempotentes, provision automatica de acceso, tutor IA con economia unitaria controlada y un examen de 100 preguntas. Cada etapa tiene una superficie clara y un criterio de exito.",
    flowEyebrow: "Pipeline operativo",
    flowTitle: "Como se mueve el alumno por el sistema",
    featuresEyebrow: "Funcionalidades del sistema",
    featuresTitle: "Capas que sostienen el producto",
    featuresIntro:
      "Cada capacidad existe para un trade-off concreto: conversion sin friccion, cobro LatAm + global, retencion de 12 meses y margen protegido frente al costo de tokens del tutor.",
    flow: [
      {
        id: "01",
        title: "Descubrimiento",
        body: "Landing bilingue ES/EN con promesa del curso Claude Architect, planes visibles y SEO/GEO/AEO. El visitante entiende el outcome antes de pagar.",
        surface: "Catalogo / marketing",
      },
      {
        id: "02",
        title: "Lead magnet",
        body: "Mini-quiz o captura de interes que calienta el embudo sin exigir tarjeta. Genera lead y mide intencion antes del checkout.",
        surface: "Growth loop",
      },
      {
        id: "03",
        title: "Eleccion de plan",
        body: "Fast-Track, Mentoring 1:1 o track B2B. El precio y el alcance se comunican en UI; el sistema no inventa SKUs en runtime.",
        surface: "Oferta comercial",
      },
      {
        id: "04",
        title: "Checkout invitado",
        body: "Pago sin crear cuenta previa. Bold (HMAC, LatAm) o PayPal Smart Buttons (global) con webhooks idempotentes para no duplicar acceso.",
        surface: "Payments",
      },
      {
        id: "05",
        title: "Provision de acceso",
        body: "Tras pago confirmado se crea la cuenta y se abre ventana de 12 meses. El alumno entra al LMS sin ticket manual de soporte.",
        surface: "Accounts + entitlements",
      },
      {
        id: "06",
        title: "Lecciones y progreso",
        body: "Contenido del curso en Django + HTMX: navegacion ligera, progreso persistido en PostgreSQL, experiencia bilingue nativa.",
        surface: "Courses runtime",
      },
      {
        id: "07",
        title: "Tutor IA (RAG)",
        body: "Asistente sobre material del curso con cache y rate-limit. Responde con contexto del dominio; el margen del producto no se va en tokens.",
        surface: "Assistant + guardrails",
      },
      {
        id: "08",
        title: "Examen y cierre",
        body: "Banco de 100 preguntas para validar preparacion a certificacion. Mentoring/B2B quedan como upsell natural post-progreso.",
        surface: "Assessment + retencion",
      },
    ] satisfies FlowStep[],
    features: [
      {
        tag: "Commerce",
        title: "Doble PSP idempotente",
        body: "Bold cubre Colombia/LatAm con firma HMAC; PayPal cubre compradores globales. Webhooks confirman el pago una sola vez y disparan la misma ruta de provision — sin dobles accesos ni estados fantasma.",
      },
      {
        tag: "Accounts",
        title: "Entitlement de 12 meses",
        body: "El derecho de acceso es un recurso de dominio: se crea al pagar, expira con fecha clara y gobierna lecciones, examen y tutor. No depende de un flag suelto en sesion.",
      },
      {
        tag: "LMS",
        title: "Runtime de curso en Django + HTMX",
        body: "Catalogo, lecciones y navegacion sin SPA pesada. i18n nativo ES/EN, Tailwind estatico y WhiteNoise listo para Render/Railway. El foco es producto operable, no framework fashion.",
      },
      {
        tag: "IA",
        title: "Tutor RAG con control de costo",
        body: "Recuperacion por keywords/corpus del curso, respuestas ancladas al material, cache de turnos frecuentes y rate-limit por alumno. El tutor es feature de retencion, no un pozo de inferencia.",
      },
      {
        tag: "Assessment",
        title: "Examen de 100 preguntas",
        body: "Evaluacion alineada a la promesa de certificacion Claude Architect. Sirve como prueba de dominio y como senal de progreso para upsell de mentoring.",
      },
      {
        tag: "Growth",
        title: "Loops Mentoring / B2B",
        body: "Ademas del curso self-serve: mentoring 1:1 y track empresa. El mismo stack de pagos y cuentas alimenta ofertas de mayor ticket sin un segundo monolito.",
      },
    ] satisfies Feature[],
  },
  en: {
    eyebrow: "Learning flow",
    title: "Journey architecture: from visitor to certified learner",
    intro:
      "This LMS is not just a lesson catalogue. It is a digital-product funnel with idempotent payments, automatic access provisioning, a unit-economics-aware AI tutor and a 100-question exam. Every stage has a clear surface and a success criterion.",
    flowEyebrow: "Operating pipeline",
    flowTitle: "How the learner moves through the system",
    featuresEyebrow: "System capabilities",
    featuresTitle: "Layers that carry the product",
    featuresIntro:
      "Each capability exists for a concrete trade-off: frictionless conversion, LatAm + global collection, 12-month retention and margin protected from tutor token cost.",
    flow: [
      {
        id: "01",
        title: "Discovery",
        body: "Bilingual ES/EN landing with the Claude Architect promise, visible plans and SEO/GEO/AEO. The visitor sees the outcome before paying.",
        surface: "Catalogue / marketing",
      },
      {
        id: "02",
        title: "Lead magnet",
        body: "Mini-quiz or interest capture that warms the funnel without a card. Creates a lead and measures intent before checkout.",
        surface: "Growth loop",
      },
      {
        id: "03",
        title: "Plan choice",
        body: "Fast-Track, 1:1 Mentoring or B2B track. Price and scope live in the UI; the system does not invent SKUs at runtime.",
        surface: "Commercial offer",
      },
      {
        id: "04",
        title: "Guest checkout",
        body: "Pay without creating an account first. Bold (HMAC, LatAm) or PayPal Smart Buttons (global) with idempotent webhooks so access is never duplicated.",
        surface: "Payments",
      },
      {
        id: "05",
        title: "Access provisioning",
        body: "After confirmed payment the account is created and a 12-month window opens. The learner enters the LMS without a support ticket.",
        surface: "Accounts + entitlements",
      },
      {
        id: "06",
        title: "Lessons and progress",
        body: "Course content on Django + HTMX: light navigation, progress in PostgreSQL, native bilingual experience.",
        surface: "Courses runtime",
      },
      {
        id: "07",
        title: "AI tutor (RAG)",
        body: "Assistant over course material with cache and rate limits. Answers from domain context; product margin is not burned on tokens.",
        surface: "Assistant + guardrails",
      },
      {
        id: "08",
        title: "Exam and close",
        body: "100-question bank to validate Claude Architect prep. Mentoring/B2B remain a natural upsell after progress.",
        surface: "Assessment + retention",
      },
    ] satisfies FlowStep[],
    features: [
      {
        tag: "Commerce",
        title: "Dual idempotent PSP",
        body: "Bold covers Colombia/LatAm with HMAC signing; PayPal covers global buyers. Webhooks confirm payment once and trigger the same provisioning path — no double access or ghost states.",
      },
      {
        tag: "Accounts",
        title: "12-month entitlement",
        body: "Access rights are a domain resource: created on pay, expire on a clear date and gate lessons, exam and tutor. Not a loose session flag.",
      },
      {
        tag: "LMS",
        title: "Course runtime on Django + HTMX",
        body: "Catalogue, lessons and navigation without a heavy SPA. Native ES/EN i18n, static Tailwind and WhiteNoise ready for Render/Railway. Operable product over framework fashion.",
      },
      {
        tag: "AI",
        title: "RAG tutor with cost control",
        body: "Retrieval over course corpus, answers grounded in material, cache for frequent turns and per-learner rate limits. The tutor is a retention feature, not an inference sink.",
      },
      {
        tag: "Assessment",
        title: "100-question exam",
        body: "Assessment aligned to the Claude Architect certification promise. Proves mastery and signals progress for mentoring upsell.",
      },
      {
        tag: "Growth",
        title: "Mentoring / B2B loops",
        body: "Beyond self-serve: 1:1 mentoring and a company track. The same payments and accounts stack feeds higher-ticket offers without a second monolith.",
      },
    ] satisfies Feature[],
  },
} as const;

export function LearningFlowArchitecture({ locale }: Props) {
  const t = copy[locale] ?? copy.es;
  const reduce = useReducedMotion();

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {t.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
          {t.intro}
        </p>
      </div>

      {/* Flow pipeline */}
      <div>
        <span className="eyebrow">{t.flowEyebrow}</span>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {t.flowTitle}
        </h3>

        <ol className="relative mt-8 space-y-0 border-l border-emerald-500/25 pl-0 sm:ml-3">
          {t.flow.map((step, i) => (
            <motion.li
              key={step.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="relative grid gap-3 border-b border-zinc-900/80 py-6 pl-8 last:border-b-0 sm:grid-cols-[7rem_1fr] sm:gap-6 sm:pl-10"
            >
              <span
                className="absolute left-0 top-8 h-2.5 w-2.5 -translate-x-[5px] rounded-full bg-emerald-400 ring-4 ring-zinc-950"
                aria-hidden
              />
              <div>
                <span className="font-mono text-xs text-emerald-400/90">
                  {step.id}
                </span>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {step.surface}
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-white">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Features */}
      <div>
        <span className="eyebrow">{t.featuresEyebrow}</span>
        <h3 className="mt-3 max-w-2xl text-xl font-semibold tracking-tight text-white">
          {t.featuresTitle}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {t.featuresIntro}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {t.features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="border-l border-emerald-500/30 pl-4"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/80">
                {f.tag}
              </span>
              <h4 className="mt-2 text-base font-medium text-white">{f.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {f.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
