/**
 * Capturas live multi-ruta (desktop + mobile + cards).
 * No regenera diagramas ni pisa heroes.
 *
 * Uso:
 *   node scripts/capture-portfolio-live.mjs
 *   node scripts/capture-portfolio-live.mjs auge sitio-mws lexia
 *   node scripts/capture-portfolio-live.mjs --video-lab
 *
 * Auth CRM (opcional):
 *   PORTFOLIO_CRM_USER / PORTFOLIO_CRM_PASS
 *   PORTFOLIO_MWS_BASE (default http://127.0.0.1:8010)
 */
import { join } from "node:path";
import {
  captureGroup,
  djangoLogin,
  recordShortVideo,
  reachable,
  captureRoot,
  mediaRoot,
  root,
} from "./lib/capture-utils.mjs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const wantVideo = process.argv.includes("--video-lab");
const only = new Set(args);

const MWS_BASE = process.env.PORTFOLIO_MWS_BASE || "http://127.0.0.1:8010";
const NOVA_BASE = process.env.PORTFOLIO_NOVA_BASE || "http://127.0.0.1:8765";
const OMNI_BASE = process.env.PORTFOLIO_OMNI_BASE || "http://127.0.0.1:8090";
const COURSE_BASE = process.env.PORTFOLIO_COURSE_BASE || "http://127.0.0.1:8000";
const BOLD_BASE = process.env.PORTFOLIO_BOLD_BASE || "http://127.0.0.1:8766";
const AUGE_BASE = process.env.PORTFOLIO_AUGE_BASE || "https://augeurbano.com";
const LEXIA_BASE = process.env.PORTFOLIO_LEXIA_BASE || "https://lexia.medellinweb.co";
const MWS_PROD = process.env.PORTFOLIO_MWS_PROD || "https://www.medellinweb.co";

function include(id) {
  return only.size === 0 || only.has(id);
}

const groups = {
  auge: () =>
    captureGroup({
      folder: "auge",
      waitMs: 4000,
      shots: [
        { name: "auge-home", url: `${AUGE_BASE}/`, card: true, mobile: true, uiSlug: "auge-urbano" },
        {
          name: "auge-catalogo",
          url: `${AUGE_BASE}/apartamentos/apartamento-en-castropol-el-poblado/`,
          mobile: true,
        },
        {
          name: "auge-ficha",
          url: `${AUGE_BASE}/apartamentos/apartamento-en-el-poblado-inversion-y-estilo-de-vida/`,
        },
      ],
    }),

  "sitio-mws": () =>
    captureGroup({
      folder: "sitio-mws",
      waitMs: 3000,
      shots: [
        { name: "mws-home", url: `${MWS_PROD}/`, card: true, mobile: true, uiSlug: "sitio-mws" },
        { name: "mws-agentes", url: `${MWS_PROD}/agentes-ia/` },
        { name: "mws-servicios", url: `${MWS_PROD}/servicios/` },
        { name: "mws-contacto", url: `${MWS_PROD}/contacto/`, mobile: true },
      ],
    }),

  "crm-mws": async () => {
    const statePath = join(root, ".cache", "crm-storage.json");
    const user = process.env.PORTFOLIO_CRM_USER;
    const pass = process.env.PORTFOLIO_CRM_PASS;
    let storage = null;
    if (user && pass) {
      storage = await djangoLogin(MWS_BASE, user, pass, statePath);
    }
    // Prefer local; fall back to prod admin if local down (may 302 login)
    const base = (await reachable(`${MWS_BASE}/admin/`)) ? MWS_BASE : MWS_PROD;
    return captureGroup({
      folder: "crm",
      waitMs: 2500,
      storageState: storage || undefined,
      shots: [
        {
          name: "crm-embudo",
          url: `${base}/admin/crm/embudo/`,
          card: true,
          mobile: true,
          uiSlug: "crm-mws",
        },
        { name: "crm-dashboard", url: `${base}/admin/crm/` },
        { name: "crm-scrapeo", url: `${base}/admin/crm/scrapeo/` },
        { name: "crm-cotizaciones", url: `${base}/admin/crm/cotizaciones/` },
        { name: "crm-finanzas", url: `${base}/admin/finance/` },
      ],
    });
  },

  lexia: () =>
    captureGroup({
      folder: "lexia",
      waitMs: 3500,
      shots: [
        { name: "lexia-os", url: `${LEXIA_BASE}/`, card: true, mobile: true, uiSlug: "lexia-legal-os" },
        { name: "lexia-os-alt", url: "http://127.0.0.1:8501/" },
        { name: "lexia-dash", url: "http://127.0.0.1:8050/" },
      ],
    }),

  nova: () =>
    captureGroup({
      folder: "nova",
      waitMs: 3500,
      shots: [
        {
          name: "nova-engine-agentes",
          url: `${NOVA_BASE}/visual`,
          card: true,
          mobile: true,
          uiSlug: "orquestacion-agentes",
        },
        { name: "nova-catalogo-perfiles", url: `${NOVA_BASE}/catalogo-agency` },
        { name: "nova-configuracion", url: `${NOVA_BASE}/configuracion` },
        { name: "nova-hud-sistemas", url: `${NOVA_BASE}/` },
        { name: "nova-arquitecturas", url: `${NOVA_BASE}/arquitecturas` },
        { name: "nova-rag-aprendizaje", url: `${NOVA_BASE}/aprendizaje` },
        { name: "nova-tokens", url: `${NOVA_BASE}/tokens` },
      ],
    }),

  omnicanal: () =>
    captureGroup({
      folder: "omnicanal",
      waitMs: 2500,
      shots: [
        {
          name: "omnicanal-panel",
          url: `${OMNI_BASE}/panel`,
          card: true,
          mobile: true,
          uiSlug: "omnicanal-comercio",
        },
        { name: "omnicanal-home", url: `${OMNI_BASE}/` },
      ],
    }),

  curso: () =>
    captureGroup({
      folder: "plataforma-aprendizaje",
      waitMs: 2500,
      shots: [
        {
          name: "curso-home",
          url: `${COURSE_BASE}/es/`,
          card: true,
          mobile: true,
          uiSlug: "plataforma-aprendizaje",
        },
        { name: "curso-home-en", url: `${COURSE_BASE}/en/` },
        { name: "curso-planes", url: `${COURSE_BASE}/es/` },
      ],
    }),

  bold: () =>
    captureGroup({
      folder: "bold",
      waitMs: 2000,
      shots: [
        { name: "bold-console", url: `${BOLD_BASE}/`, card: true, uiSlug: "pagos-bold" },
      ],
    }),
};

async function main() {
  let total = 0;
  const order = [
    "auge",
    "sitio-mws",
    "crm-mws",
    "lexia",
    "nova",
    "omnicanal",
    "curso",
    "bold",
  ];

  for (const id of order) {
    if (!include(id)) continue;
    console.log(`\n=== ${id} ===`);
    try {
      total += (await groups[id]()) || 0;
    } catch (e) {
      console.log("group fail", id, e.message);
    }
  }

  if (wantVideo || include("nova")) {
    await recordShortVideo(`${NOVA_BASE}/visual`, join(mediaRoot, "nova-lab-tour.webm"), {
      durationMs: 14000,
      scroll: false,
    });
    await recordShortVideo(`${NOVA_BASE}/catalogo-agency`, join(mediaRoot, "nova-catalogo-tour.webm"), {
      durationMs: 10000,
    });
  }

  console.log(`\nLive captures done. Shots: ${total}`);
  console.log("Assets under", captureRoot);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
