/**
 * Genera la tarjeta Open Graph (1200x630) con la foto de perfil.
 * Salida: public/images/og-ricardo.png
 */
import { readFile, writeFile, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const imagesDir = join(root, "public", "images");

const photo = await readFile(join(imagesDir, "ricardo-zuluaga.png"));
const photoData = `data:image/png;base64,${photo.toString("base64")}`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; display: flex; align-items: center; gap: 64px;
    padding: 64px 72px;
    background: radial-gradient(900px 500px at 15% 0%, #0f2918 0%, #09090b 50%, #050506 100%);
    color: #fafafa; font-family: "Segoe UI", system-ui, sans-serif;
  }
  .copy { flex: 1; }
  .eyebrow { color: #34d399; letter-spacing: 0.22em; font-size: 15px; text-transform: uppercase; font-weight: 600; }
  h1 { margin-top: 18px; font-size: 60px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.02; }
  h2 { margin-top: 18px; font-size: 26px; font-weight: 400; color: #a1a1aa; line-height: 1.3; }
  .tags { margin-top: 34px; display: flex; flex-wrap: wrap; gap: 10px; }
  .tag { border: 1px solid #27272a; background: rgba(24,24,27,0.8); border-radius: 999px; padding: 9px 18px; font-size: 17px; color: #d4d4d8; }
  .portrait { width: 380px; height: 502px; border-radius: 28px; overflow: hidden; border: 1px solid #27272a; box-shadow: 0 0 90px rgba(52,211,153,0.16); }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
</style></head>
<body>
  <div class="copy">
    <div class="eyebrow">Medellín Web Soluciones</div>
    <h1>Ricardo Zuluaga</h1>
    <h2>Senior Solutions Architect<br/>&amp; AI Automation Expert</h2>
    <div class="tags">
      <span class="tag">Agentic AI</span>
      <span class="tag">Arquitectura HA</span>
      <span class="tag">Commerce &amp; Payments</span>
    </div>
  </div>
  <div class="portrait"><img src="${photoData}"/></div>
</body></html>`;

const tmp = join(imagesDir, "_og.html");
await writeFile(tmp, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${tmp.replace(/\\/g, "/")}`);
await page.screenshot({ path: join(imagesDir, "og-ricardo.png"), type: "png" });
await browser.close();
await unlink(tmp);

console.log("OG card -> public/images/og-ricardo.png");
