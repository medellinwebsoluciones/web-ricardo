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
 *   PORTFOLIO_CRM_USER / PORTFOLIO_CRM_PASS  (staff local MWS; README admin/admin123 puede no existir)
 *   PORTFOLIO_CRM_LEAD_PK (detalle lead para crm-lead)
 *   PORTFOLIO_MWS_BASE (default http://127.0.0.1:8010)
 * Auth Omnicanal / Bold / Lexia (opcional):
 *   PORTFOLIO_OMNI_EMAIL / PORTFOLIO_OMNI_PASS  (ADMIN_* del .env omnicanal)
 *   PORTFOLIO_BOLD_EMAIL / PORTFOLIO_BOLD_PASS  (BOLD_CONSOLE_ADMIN_* del .env)
 *   PORTFOLIO_LEXIA_EMAIL / PORTFOLIO_LEXIA_PASS (demo README; requiere API Lexia up)
 */
import { join } from "node:path";
import {
  captureGroup,
  djangoLogin,
  formLogin,
  streamlitFormLogin,
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
    const leadPk = process.env.PORTFOLIO_CRM_LEAD_PK || "310";
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
        { name: "crm-lead", url: `${base}/admin/crm/embudo/${leadPk}/` },
        { name: "crm-scrapeo", url: `${base}/admin/crm/scrapeo/` },
        { name: "crm-cotizaciones", url: `${base}/admin/crm/cotizaciones/` },
        { name: "crm-finanzas", url: `${base}/admin/finance/` },
      ],
    });
  },

  lexia: async () => {
    const statePath = join(root, ".cache", "lexia-storage.json");
    const email = process.env.PORTFOLIO_LEXIA_EMAIL;
    const pass = process.env.PORTFOLIO_LEXIA_PASS;
    let storage = null;
    if (email && pass) {
      storage = await streamlitFormLogin("http://127.0.0.1:8501", email, pass, statePath);
    }
    return captureGroup({
      folder: "lexia",
      waitMs: 4000,
      storageState: storage || undefined,
      shots: [
        {
          name: "lexia-os",
          url: storage ? "http://127.0.0.1:8501/" : `${LEXIA_BASE}/`,
          card: true,
          mobile: true,
          uiSlug: "lexia-legal-os",
        },
        { name: "lexia-os-alt", url: "http://127.0.0.1:8501/?v=login" },
        { name: "lexia-dash", url: "http://127.0.0.1:8050/" },
        { name: "lexia-workspace", url: "http://127.0.0.1:8501/" },
      ],
    });
  },

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

  omnicanal: async () => {
    const statePath = join(root, ".cache", "omni-storage.json");
    const email = process.env.PORTFOLIO_OMNI_EMAIL;
    const pass = process.env.PORTFOLIO_OMNI_PASS;
    let storage = null;
    if (email && pass) {
      storage = await formLogin({
        loginUrl: `${OMNI_BASE}/panel/login`,
        user: email,
        pass,
        statePath,
      });
    }
    return captureGroup({
      folder: "omnicanal",
      waitMs: 2800,
      storageState: storage || undefined,
      shots: [
        {
          name: "omnicanal-panel",
          url: `${OMNI_BASE}/panel/`,
          card: true,
          mobile: true,
          uiSlug: "omnicanal-comercio",
        },
        { name: "omnicanal-productos", url: `${OMNI_BASE}/panel/products` },
        { name: "omnicanal-oportunidades", url: `${OMNI_BASE}/panel/opportunities` },
        { name: "omnicanal-trends", url: `${OMNI_BASE}/panel/trends` },
        { name: "omnicanal-stock", url: `${OMNI_BASE}/panel/stock` },
        { name: "omnicanal-settings", url: `${OMNI_BASE}/panel/settings` },
      ],
    });
  },

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

  bold: async () => {
    const statePath = join(root, ".cache", "bold-storage.json");
    const email = process.env.PORTFOLIO_BOLD_EMAIL;
    const pass = process.env.PORTFOLIO_BOLD_PASS;
    let storage = null;
    if (email && pass) {
      storage = await formLogin({
        loginUrl: `${BOLD_BASE}/`,
        user: email,
        pass,
        statePath,
        successWhen: async (page) => {
          const title = await page.title();
          const pwd = await page.locator('input[type="password"]').count();
          return pwd === 0 && !/iniciar sesion/i.test(title);
        },
      });
    }
    const admin = `${BOLD_BASE}/bold/admin`;
    return captureGroup({
      folder: "bold",
      waitMs: 2500,
      storageState: storage || undefined,
      shots: [
        { name: "bold-console", url: `${admin}/`, card: true, uiSlug: "pagos-bold" },
        { name: "bold-screen-01", url: `${admin}/transactions` },
        { name: "bold-screen-02", url: `${admin}/tenants` },
        { name: "bold-screen-03", url: `${admin}/integration` },
        { name: "bold-screen-04", url: `${admin}/wizard` },
        { name: "bold-screen-05", url: `${admin}/pay` },
      ],
    });
  },
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
