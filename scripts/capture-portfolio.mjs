/**
 * Captura UIs locales (si el puerto responde) o regenera diagramas.
 * Uso: node scripts/capture-portfolio.mjs
 *      node scripts/capture-portfolio.mjs --diagrams-only
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const captureDir = join(root, "public", "images", "captures");

const targets = [
  { slug: "orquestacion-agentes", url: "http://127.0.0.1:8765/visual" },
  { slug: "lexia-legal-os", url: "http://127.0.0.1:8501" },
  { slug: "omnicanal-comercio", url: "http://127.0.0.1:8090/panel" },
  { slug: "auge-urbano", url: "http://127.0.0.1:5000" },
  { slug: "experiencia-recomendacion", url: "http://127.0.0.1:5001" },
  { slug: "sitio-mws", url: "http://127.0.0.1:8000" },
  { slug: "crm-mws", url: "http://127.0.0.1:8765/admin/crm/embudo/" },
  { slug: "pagos-bold", url: "http://127.0.0.1:8766" },
];

async function reachable(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok || res.status === 302 || res.status === 401;
  } catch {
    return false;
  }
}

async function captureLive() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  let n = 0;
  for (const t of targets) {
    if (!(await reachable(t.url))) {
      console.log("skip (down)", t.slug, t.url);
      continue;
    }
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
    await page.screenshot({
      path: join(captureDir, `${t.slug}-ui.png`),
      type: "png",
      fullPage: false,
    });
    console.log("captured", t.slug);
    n++;
  }
  await browser.close();
  return n;
}

function runDiagrams() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(__dirname, "generate-arch-diagrams.mjs")], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("diagrams failed"))));
  });
}

async function main() {
  const diagramsOnly = process.argv.includes("--diagrams-only");
  await runDiagrams();
  if (diagramsOnly) return;
  const n = await captureLive();
  console.log(`Live captures: ${n}/${targets.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
