/**
 * Capturas de proyectos de marca (cliente) para la galería de trayectoria.
 * - Renault (CakePHP): login admin + pantallas internas del sistema de agendamiento.
 * - Dux: promo/landing estático.
 * Toda captura de sistema con datos se anonimiza (emails y números largos redactados).
 *
 * Requiere que los servidores locales estén arriba:
 *   Renault  -> http://127.0.0.1:8091  (php -S sobre app/webroot, MariaDB 3306)
 *   Dux      -> http://127.0.0.1:8092  (php -S sobre 'html promo dux/html')
 */
import { join } from "node:path";
import { chromium } from "playwright";
import {
  anonymizePage,
  writeVariants,
  ensureDir,
  captureRoot,
  DESKTOP,
  MOBILE,
} from "./lib/capture-utils.mjs";

const RENAULT = process.env.BRAND_RENAULT_BASE || "http://127.0.0.1:8091";
const DUX = process.env.BRAND_DUX_BASE || "http://127.0.0.1:8092";
const RENAULT_USER = process.env.BRAND_RENAULT_USER || "admin@gmail.com";
const RENAULT_PASS = process.env.BRAND_RENAULT_PASS || "Portafolio2026";

/** Captura una página ya cargada: PNG + WebP (+ card opcional). */
async function shoot(page, folder, name, { card = false, anonymize = null } = {}) {
  const outDir = join(captureRoot, folder);
  await ensureDir(outDir);
  if (anonymize) await anonymizePage(page, anonymize);
  const tmp = join(outDir, `${name}.tmp.png`);
  await page.screenshot({ path: tmp, type: "png", fullPage: false });
  await writeVariants(tmp, outDir, name, { card, folder: name });
  console.log("ok", folder, name);
}

async function captureRenault(browser) {
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    locale: "es-CO",
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    deviceScaleFactor: DESKTOP.deviceScaleFactor,
  });
  const page = await context.newPage();
  const anon = { redact: true };
  try {
    // 1) Login page (branded, sin datos sensibles)
    await page.goto(`${RENAULT}/index.php/users/login`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(1200);
    await shoot(page, "renault", "renault-login", { card: true });

    // 2) Autenticación
    await page.fill("#UserUsername", RENAULT_USER);
    await page.fill("#UserPassword", RENAULT_PASS);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }).catch(() => {}),
      page.press("#UserPassword", "Enter"),
    ]);
    await page.waitForTimeout(1500);
    console.log("renault post-login url:", page.url());

    // 3) Pantallas internas del sistema (anonimizadas)
    const routes = [
      ["renault-home", "/index.php", true],
      ["renault-agendamientos", "/index.php/vehiculo_agendamientos", true],
      ["renault-eventos", "/index.php/eventos", false],
      ["renault-empresas", "/index.php/empresas", false],
      ["renault-vehiculos", "/index.php/vehiculos", false],
    ];
    for (const [name, path, card] of routes) {
      try {
        await page.goto(`${RENAULT}${path}`, {
          waitUntil: "networkidle",
          timeout: 45000,
        });
        await page.waitForTimeout(1200);
        await shoot(page, "renault", name, { card, anonymize: anon });
      } catch (e) {
        console.log("fail", name, e.message);
      }
    }
  } finally {
    await context.close();
  }
}

async function captureDux(browser) {
  // Desktop
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    locale: "es-CO",
    viewport: { width: DESKTOP.width, height: DESKTOP.height },
    deviceScaleFactor: DESKTOP.deviceScaleFactor,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(`${DUX}/`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500);
    await shoot(page, "dux", "dux-promo", { card: true });
  } catch (e) {
    console.log("fail dux desktop", e.message);
  } finally {
    await ctx.close();
  }
  // Mobile
  const mctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    locale: "es-CO",
    viewport: { width: MOBILE.width, height: MOBILE.height },
    deviceScaleFactor: MOBILE.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mctx.newPage();
  try {
    await mpage.goto(`${DUX}/`, { waitUntil: "networkidle", timeout: 45000 });
    await mpage.waitForTimeout(1500);
    await shoot(mpage, "dux", "dux-promo-mobile");
  } catch (e) {
    console.log("fail dux mobile", e.message);
  } finally {
    await mctx.close();
  }
}

async function main() {
  const only = process.argv[2];
  const browser = await chromium.launch();
  try {
    if (!only || only === "renault") await captureRenault(browser);
    if (!only || only === "dux") await captureDux(browser);
  } finally {
    await browser.close();
  }
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
