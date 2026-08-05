/**
 * Genera diagramas de arquitectura PNG (SVG rasterizado vía Playwright)
 * a public/images/arch/{slug}.png y copies a captures/{slug}-hero.png
 *
 * Uso: node scripts/generate-arch-diagrams.mjs [slug ...]
 * Sin argumentos regenera todos; con slugs solo esos (evita sobrescribir
 * capturas reales de UI de otros casos).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const archDir = join(root, "public", "images", "arch");
const captureDir = join(root, "public", "images", "captures");

const diagrams = [
  {
    slug: "orquestacion-agentes",
    title: "Nova — Orquestación multi-agente",
    layers: [
      ["Operador", "FastAPI Nova", "Panel /visual · /vivo"],
      ["CEO Agent", "5 Division Hubs", "29 Especialistas"],
      ["Ollama LLM local", "Tools MCP · Composio · MWS", "SQLite / Postgres"],
    ],
  },
  {
    slug: "sistemas-criticos",
    title: "HA — Microservicios críticos",
    layers: [
      ["Clientes", "Load Balancer", "Edge"],
      ["Service A", "Service B", "Service C"],
      ["Primary DB", "Replica DB", "Observabilidad"],
    ],
  },
  {
    slug: "auge-urbano",
    title: "Auge Urbano — Plataforma PropTech",
    layers: [
      ["Compradores", "Colegas · Captadores", "Admin / operacion"],
      ["Nginx TLS + apex canonico", "Gunicorn 3w x 2t", "Flask · 159 rutas"],
      ["Agentes IA + guards", "SEO/GEO/AEO · IndexNow", "MySQL 8 · 45 tablas"],
    ],
  },
  {
    slug: "lexia-legal-os",
    title: "LEXIA — Legal Intelligence OS",
    layers: [
      ["Usuario jurídico", "Streamlit OS", "Dash Analytics"],
      ["FastAPI", "Dominio Legal IA", "Auth / Roles"],
      ["Data store", "Seed demo", "Docker"],
    ],
  },
  {
    slug: "omnicanal-comercio",
    title: "Omnicanal MWS — Commerce brain",
    layers: [
      ["Dropi feeds", "Worker radar", "Scoring"],
      ["Panel HITL", "FastAPI catálogo", "Enrich IA"],
      ["WooCommerce CO", "Postgres", "Redis"],
    ],
  },
  {
    slug: "plataforma-aprendizaje",
    title: "LMS — Curso + pagos",
    layers: [
      ["Visitante", "Django LMS", "i18n ES/EN"],
      ["Bold", "PayPal", "Checkout invitado"],
      ["Lecciones · Examen", "Tutor RAG", "Postgres"],
    ],
  },
  {
    slug: "pagos-bold",
    title: "pagos_bold — Integrador Bold",
    layers: [
      ["Producto host", "SDK pagos_bold", "bold-console"],
      ["CheckoutService", "IntegrationHealth", "Webhooks"],
      ["Bold API", "HMAC / firma", "Deploy Docker"],
    ],
  },
  {
    slug: "experiencia-recomendacion",
    title: "Embudo de recomendación",
    layers: [
      ["Bienvenida", "Interés", "Tiempo"],
      ["Modalidad", "Motor reglas", "Menú ≤3 cursos"],
      ["CTA tienda", "Sesión Flask", "Templates"],
    ],
  },
  {
    slug: "sitio-mws",
    title: "Medellín Web Soluciones — Site",
    layers: [
      ["Home · Servicios", "Django 6", "Angular legacy"],
      ["Blog · Portal", "Billing", "Contact"],
      ["agent_knowledge", "RAG sync", "WhiteNoise"],
    ],
  },
  {
    slug: "crm-mws",
    title: "CRM operativo MWS — Embudo",
    layers: [
      ["SECOP II", "Scraper / SERP", "Perfilado IA"],
      ["Embudo KPIs", "Leads · Detalle", "Temperatura / territorio"],
      ["Clientes · Cotizaciones", "Proyectos · Tareas", "Finanzas COP"],
    ],
  },
  {
    slug: "landings-cliente",
    title: "Landing boutique cliente",
    layers: [
      ["Marca personal", "HTML/CSS/JS", "Assets"],
      ["Build dist", "Deploy estático", "Performance"],
      ["CTA contacto", "Responsive", "Hosting"],
    ],
  },
  {
    slug: "wp-ai-agent",
    title: "WordPress AI Agent",
    layers: [
      ["Visitante WP", "Theme / Plugin", "wp-admin"],
      ["AI Agent bridge", "LLM API", "Guardrails"],
      ["wp-content", "Hooks WP", "Automatización"],
    ],
  },
];

function htmlFor(d) {
  const rows = d.layers
    .map(
      (row, ri) => `
      <div class="row">
        ${row
          .map(
            (cell) =>
              `<div class="node" style="animation-delay:${ri * 80}ms">${cell}</div>`,
          )
          .join("")}
      </div>
      ${ri < d.layers.length - 1 ? '<div class="arrow">↓</div>' : ""}`,
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1280px; height: 720px;
    background: radial-gradient(1200px 600px at 20% 0%, #0f2918 0%, #09090b 45%, #050506 100%);
    color: #e4e4e7; font-family: "Segoe UI", system-ui, sans-serif;
    display: flex; flex-direction: column; padding: 48px 56px;
  }
  .eyebrow { color: #34d399; letter-spacing: 0.2em; font-size: 12px; text-transform: uppercase; font-weight: 600; }
  h1 { margin-top: 12px; font-size: 32px; font-weight: 600; letter-spacing: -0.02em; }
  .grid { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; flex: 1; justify-content: center; }
  .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .node {
    border: 1px solid #27272a; background: rgba(24,24,27,0.85);
    border-radius: 12px; padding: 22px 18px; text-align: center;
    font-size: 17px; font-weight: 500; color: #fafafa;
    box-shadow: 0 0 0 1px rgba(52,211,153,0.08);
  }
  .arrow { text-align: center; color: #34d399; font-size: 22px; opacity: 0.7; }
  .footer { margin-top: auto; font-size: 13px; color: #71717a; }
</style></head>
<body>
  <div class="eyebrow">Architecture</div>
  <h1>${d.title}</h1>
  <div class="grid">${rows}</div>
  <div class="footer">Ricardo Zuluaga · Medellín Web Soluciones · Production systems</div>
</body></html>`;
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const selected = only.size
    ? diagrams.filter((d) => only.has(d.slug))
    : diagrams;
  if (!selected.length) {
    throw new Error(`Sin diagramas para: ${[...only].join(", ")}`);
  }

  await mkdir(archDir, { recursive: true });
  await mkdir(captureDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });

  for (const d of selected) {
    const html = htmlFor(d);
    const tmp = join(archDir, `${d.slug}.html`);
    await writeFile(tmp, html, "utf8");
    await page.goto(`file://${tmp.replace(/\\/g, "/")}`);
    const archPath = join(archDir, `${d.slug}.png`);
    await page.screenshot({ path: archPath, type: "png" });
    const heroPath = join(captureDir, `${d.slug}-hero.png`);
    await page.screenshot({ path: heroPath, type: "png" });
    // UI variant: slightly different crop label
    await page.evaluate(() => {
      const f = document.querySelector(".footer");
      if (f) f.textContent = "UI / system surface · portfolio capture";
    });
    await page.screenshot({
      path: join(captureDir, `${d.slug}-ui.png`),
      type: "png",
    });
    console.log("ok", d.slug);
  }

  await browser.close();
  console.log("Done", selected.length, "diagrams");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
