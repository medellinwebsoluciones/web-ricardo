/**
 * Capturas de sistemas locales del PC (productos propios + cliente anonimizado).
 * Reusa el pipeline de scripts/lib/capture-utils.mjs (Playwright + sharp).
 *
 * Uso:
 *   node scripts/capture-local-systems.mjs                 # todos los grupos reachable
 *   node scripts/capture-local-systems.mjs prestamos places
 *
 * Cada grupo intenta capturar solo si el sistema está levantado localmente.
 * Los sistemas de cliente usan `anonymize` (blur/redact) para no exponer PII.
 */
import { join } from "node:path";
import {
  captureGroup,
  formLogin,
  captureRoot,
  root,
} from "./lib/capture-utils.mjs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const only = new Set(args);
const include = (id) => only.size === 0 || only.has(id);

// Bases por app (override con env PORTFOLIO_<APP>_BASE)
const PRESTAMOS = process.env.PORTFOLIO_PRESTAMOS_BASE || "http://127.0.0.1:8000";
const PLACES = process.env.PORTFOLIO_PLACES_BASE || "http://127.0.0.1:8501";
const SPLIT = process.env.PORTFOLIO_SPLIT_BASE || "http://127.0.0.1:8502";
const LANDING_NG = process.env.PORTFOLIO_LANDINGNG_BASE || "http://127.0.0.1:4200";
const GARAGE = process.env.PORTFOLIO_GARAGE_BASE || "http://127.0.0.1:8020";
const PMS = process.env.PORTFOLIO_PMS_BASE || "http://127.0.0.1:3002";
const FEELING = process.env.PORTFOLIO_FEELING_BASE || "http://127.0.0.1:8080";
const FOMAG_API = process.env.PORTFOLIO_FOMAG_API || "http://127.0.0.1:8000";
const FOMAG_WEB = process.env.PORTFOLIO_FOMAG_WEB || "http://127.0.0.1:5173";
const TIGO = process.env.PORTFOLIO_TIGO_BASE || "http://127.0.0.1:5000";
const IADATA = process.env.PORTFOLIO_IADATA_BASE || "http://127.0.0.1:5055";
const NOVAIA = process.env.PORTFOLIO_NOVAIA_BASE || "http://127.0.0.1:5060";
const TURNERO = process.env.PORTFOLIO_TURNERO_BASE || "http://127.0.0.1:8091";
const TECNOPETS = process.env.PORTFOLIO_TECNOPETS_BASE || "http://127.0.0.1:8093";

const groups = {
  // ---- Tier 1 (sin BD externa) ----
  prestamos: async () => {
    const statePath = join(root, ".cache", "prestamos-storage.json");
    const storage = await formLogin({
      loginUrl: `${PRESTAMOS}/login/`,
      user: process.env.PORTFOLIO_PRESTAMOS_USER || "admin@accoop.com",
      pass: process.env.PORTFOLIO_PRESTAMOS_PASS || "admin123",
      statePath,
      userSelector: 'input[name="email"], input[type="email"], input[name="username"]',
    });
    return captureGroup({
      folder: "prestamos",
      waitMs: 2200,
      storageState: storage || undefined,
      shots: [
        { name: "prestamos-login", url: `${PRESTAMOS}/login/`, card: false, mobile: true },
        { name: "prestamos-landing", url: `${PRESTAMOS}/`, mobile: true },
        { name: "prestamos-dashboard", url: `${PRESTAMOS}/admin-panel/dashboard/`, card: true, mobile: true, uiSlug: "prestamos-fintech" },
        { name: "prestamos-solicitudes", url: `${PRESTAMOS}/admin-panel/solicitudes/` },
        { name: "prestamos-clientes", url: `${PRESTAMOS}/admin-panel/clientes/` },
        { name: "prestamos-prestamos", url: `${PRESTAMOS}/admin-panel/prestamos/` },
        { name: "prestamos-pagos", url: `${PRESTAMOS}/admin-panel/pagos/` },
        { name: "prestamos-swagger", url: `${PRESTAMOS}/swagger/`, card: false },
        { name: "prestamos-django-admin", url: `${PRESTAMOS}/admin/` },
      ],
    });
  },

  places: () =>
    captureGroup({
      folder: "google-places",
      waitMs: 3500,
      shots: [
        { name: "places-app", url: `${PLACES}/`, card: true, mobile: true, uiSlug: "google-places-scraper" },
      ],
    }),

  split: () =>
    captureGroup({
      folder: "split-bancolombia",
      waitMs: 3500,
      shots: [
        { name: "split-app", url: `${SPLIT}/`, card: true, mobile: true, uiSlug: "split-soportes" },
      ],
    }),

  landingng: () =>
    captureGroup({
      folder: "landing-mws-ng",
      waitMs: 3000,
      shots: [
        { name: "landingng-home", url: `${LANDING_NG}/`, card: true, mobile: true, uiSlug: "landing-mws-ng" },
      ],
    }),

  garage: () =>
    captureGroup({
      folder: "garage-online",
      waitMs: 2500,
      shots: [
        { name: "garage-swagger", url: `${GARAGE}/docs`, card: true, mobile: true, uiSlug: "garage-online" },
        { name: "garage-redoc", url: `${GARAGE}/redoc` },
      ],
    }),

  pms: () =>
    captureGroup({
      folder: "pms-crm",
      waitMs: 2500,
      shots: [
        { name: "pms-swagger", url: `${PMS}/api/docs`, card: true, uiSlug: "pms-crm" },
        { name: "pms-root", url: `${PMS}/` },
      ],
    }),

  // ---- Tier 2 (MySQL) ----
  feeling: async () => {
    const statePath = join(root, ".cache", "feeling-storage.json");
    const storage = await formLogin({
      loginUrl: `${FEELING}/auth/login`,
      user: process.env.PORTFOLIO_FEELING_USER || "",
      pass: process.env.PORTFOLIO_FEELING_PASS || "",
      statePath,
      userSelector: 'input[name="identificador"], input#identificador',
      successUnless: /\/auth\/login/i,
    });
    return captureGroup({
      folder: "feeling-core",
      waitMs: 2500,
      storageState: storage || undefined,
      shots: [
        { name: "feeling-login", url: `${FEELING}/auth/login`, mobile: true },
        { name: "feeling-dashboard", url: `${FEELING}/`, card: true, mobile: true, uiSlug: "feeling-core-erp" },
        { name: "feeling-bodega", url: `${FEELING}/bodega-dashboard/` },
        { name: "feeling-inventario", url: `${FEELING}/inventario/` },
        { name: "feeling-eventos", url: `${FEELING}/eventos/` },
        { name: "feeling-clientes", url: `${FEELING}/clientes/` },
        { name: "feeling-proyectos", url: `${FEELING}/proyectos/` },
      ],
    });
  },

  fomag: async () => {
    const statePath = join(root, ".cache", "fomag-storage.json");
    const storage = await formLogin({
      loginUrl: `${FOMAG_WEB}/login`,
      user: process.env.PORTFOLIO_FOMAG_USER || "",
      pass: process.env.PORTFOLIO_FOMAG_PASS || "",
      statePath,
    });
    return captureGroup({
      folder: "fomag",
      waitMs: 2800,
      storageState: storage || undefined,
      shots: [
        { name: "fomag-login", url: `${FOMAG_WEB}/login`, mobile: true },
        { name: "fomag-dashboard", url: `${FOMAG_WEB}/`, card: true, mobile: true, uiSlug: "fomag-erp", anonymize: { redact: true } },
        { name: "fomag-api", url: `${FOMAG_API}/docs` },
      ],
    });
  },

  tigo: async () => {
    const statePath = join(root, ".cache", "tigo-storage.json");
    const storage = await formLogin({
      loginUrl: `${TIGO}/inicio_sesion`,
      user: process.env.PORTFOLIO_TIGO_USER || "",
      pass: process.env.PORTFOLIO_TIGO_PASS || "",
      statePath,
      userSelector: 'input[name="usuario"], input[name="username"], input[name="email"], input[type="text"]',
    });
    return captureGroup({
      folder: "tigo-dashboard",
      waitMs: 2500,
      storageState: storage || undefined,
      shots: [
        { name: "tigo-login", url: `${TIGO}/inicio_sesion`, mobile: true },
        { name: "tigo-dashboard", url: `${TIGO}/`, card: true, mobile: true, uiSlug: "tigo-dashboard", anonymize: { redact: true } },
      ],
    });
  },

  iadata: () =>
    captureGroup({
      folder: "ia-data",
      waitMs: 2500,
      shots: [
        { name: "iadata-home", url: `${IADATA}/`, card: true, mobile: true, uiSlug: "ia-data-analytics" },
      ],
    }),

  novaia: () =>
    captureGroup({
      folder: "nova-ia-mws",
      waitMs: 2500,
      shots: [
        { name: "novaia-home", url: `${NOVAIA}/`, card: true, mobile: true, uiSlug: "nova-ia-mws" },
        { name: "novaia-admin", url: `${NOVAIA}/admin` },
      ],
    }),

  turnero: async () => {
    const statePath = join(root, ".cache", "turnero-storage.json");
    const storage = await formLogin({
      loginUrl: `${TURNERO}/login`,
      user: process.env.PORTFOLIO_TURNERO_USER || "",
      pass: process.env.PORTFOLIO_TURNERO_PASS || "",
      statePath,
    });
    return captureGroup({
      folder: "turnero",
      waitMs: 2500,
      storageState: storage || undefined,
      shots: [
        { name: "turnero-login", url: `${TURNERO}/login`, mobile: true },
        { name: "turnero-home", url: `${TURNERO}/`, card: true, mobile: true, uiSlug: "turnero-citas" },
      ],
    });
  },

  // ---- Tier 3 ----
  tecnopets: () =>
    captureGroup({
      folder: "tecnopets",
      waitMs: 3000,
      shots: [
        { name: "tecnopets-home", url: `${TECNOPETS}/`, card: true, mobile: true, uiSlug: "tecnopets-app" },
      ],
    }),
};

async function main() {
  let total = 0;
  const order = [
    "prestamos",
    "places",
    "split",
    "landingng",
    "garage",
    "pms",
    "feeling",
    "fomag",
    "tigo",
    "iadata",
    "novaia",
    "turnero",
    "tecnopets",
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
  console.log(`\nLocal captures done. Shots: ${total}`);
  console.log("Assets under", captureRoot);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
