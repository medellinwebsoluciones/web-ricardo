/**
 * Helpers compartidos para capturas de portfolio (Playwright + sharp).
 */
import { mkdir, rm, copyFile, access, readdir, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const root = join(__dirname, "..", "..");
export const captureRoot = join(root, "public", "images", "captures");
export const mediaRoot = join(root, "public", "media");

export const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };
export const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2 };

export async function reachable(url, timeoutMs = 5000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) portfolio-capture" },
    });
    clearTimeout(t);
    return res.ok || [301, 302, 303, 307, 308, 401, 403].includes(res.status);
  } catch {
    // TLS/corporate proxies: still allow Playwright (ignoreHTTPSErrors) to try.
    try {
      const u = new URL(url);
      if (u.protocol === "https:") return true;
    } catch {
      /* ignore */
    }
    return false;
  }
}

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

export async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** Write PNG + WebP + optional 16:10 card from a temp full screenshot. */
export async function writeVariants(tmpPng, outDir, name, { card = false, folder = "" } = {}) {
  const pngKeep = join(outDir, `${name}.png`);
  await sharp(tmpPng)
    .resize(1600, null, { withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(pngKeep);

  const webpInfo = await sharp(tmpPng)
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(outDir, `${name}.webp`));

  let cardPath = null;
  if (card) {
    const meta = await sharp(tmpPng).metadata();
    const w = meta.width || 1600;
    const h = meta.height || 900;
    const targetRatio = 16 / 10;
    let cropW = w;
    let cropH = Math.round(w / targetRatio);
    if (cropH > h) {
      cropH = h;
      cropW = Math.round(h * targetRatio);
    }
    const left = Math.max(0, Math.floor((w - cropW) / 2));
    cardPath = join(outDir, `${folder || name}-card.webp`);
    await sharp(tmpPng)
      .extract({ left, top: 0, width: Math.min(cropW, w), height: Math.min(cropH, h) })
      .resize(1600, 1000, { fit: "cover", position: "top" })
      .webp({ quality: 84 })
      .toFile(cardPath);
  }

  await rm(tmpPng, { force: true });
  return { pngKeep, webpInfo, cardPath };
}

/**
 * @param {{
 *   folder: string,
 *   shots: Array<{ name: string, url: string, fullPage?: boolean, mobile?: boolean, card?: boolean, uiSlug?: string }>,
 *   waitMs?: number,
 *   storageState?: string,
 * }} opts
 */
export async function captureGroup(opts) {
  const { folder, shots, waitMs = 2500, storageState } = opts;
  const outDir = join(captureRoot, folder);
  await ensureDir(outDir);

  const browser = await chromium.launch();
  let n = 0;

  for (const shot of shots) {
    const ok = await reachable(shot.url);
    const isLocal = /^(http:\/\/)?(127\.0\.0\.1|localhost)/i.test(shot.url);
    if (!ok && !isLocal && !shot.force) {
      console.log("skip (down)", folder, shot.name, shot.url);
      continue;
    }
    if (!ok && (isLocal || shot.force)) {
      console.log("try anyway", folder, shot.name, shot.url);
    }

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      locale: "es-CO",
      viewport: { width: DESKTOP.width, height: DESKTOP.height },
      deviceScaleFactor: DESKTOP.deviceScaleFactor,
      ...(storageState ? { storageState } : {}),
    });
    const page = await context.newPage();

    try {
      await page.goto(shot.url, { waitUntil: "networkidle", timeout: 60000 }).catch(() =>
        page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 60000 })
      );
      await page.waitForTimeout(waitMs);
      const tmp = join(outDir, `${shot.name}.tmp.png`);
      await page.screenshot({
        path: tmp,
        type: "png",
        fullPage: Boolean(shot.fullPage),
      });
      const { pngKeep } = await writeVariants(tmp, outDir, shot.name, {
        card: Boolean(shot.card),
        folder,
      });
      if (shot.card && shot.uiSlug) {
        await copyFile(pngKeep, join(captureRoot, `${shot.uiSlug}-ui.png`));
      }
      console.log("ok", folder, shot.name);
      n++;
    } catch (e) {
      console.log("fail", folder, shot.name, e.message);
    } finally {
      await context.close();
    }

    if (shot.mobile) {
      const mctx = await browser.newContext({
        ignoreHTTPSErrors: true,
        locale: "es-CO",
        viewport: { width: MOBILE.width, height: MOBILE.height },
        deviceScaleFactor: MOBILE.deviceScaleFactor,
        isMobile: true,
        hasTouch: true,
        ...(storageState ? { storageState } : {}),
      });
      const mpage = await mctx.newPage();
      try {
        await mpage.goto(shot.url, { waitUntil: "networkidle", timeout: 60000 }).catch(() =>
          mpage.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 60000 })
        );
        await mpage.waitForTimeout(waitMs);
        await mpage.screenshot({
          path: join(outDir, `${shot.name}-mobile.png`),
          type: "png",
          fullPage: false,
        });
        console.log("ok", folder, `${shot.name}-mobile`);
        n++;
      } catch (e) {
        console.log("fail mobile", folder, shot.name, e.message);
      } finally {
        await mctx.close();
      }
    }
  }

  await browser.close();
  return n;
}

export async function djangoLogin(baseUrl, user, pass, statePath) {
  if (!user || !pass) return null;
  const root = baseUrl.replace(/\/$/, "");
  // MWS usa /entrar/ (login unificado); fallback a Django admin login.
  const candidates = [`${root}/entrar/`, `${root}/admin/login/`];

  await ensureDir(dirname(statePath));
  const browser = await chromium.launch();
  try {
    for (const loginUrl of candidates) {
      if (!(await reachable(loginUrl))) continue;
      const context = await browser.newContext({ ignoreHTTPSErrors: true });
      const page = await context.newPage();
      try {
        await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        const userSel =
          'input[name="username"], input[name="email"], input[type="email"], input[autocomplete="username"]';
        await page.fill(userSel, user);
        await page.fill('input[name="password"], input[type="password"]', pass);
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }).catch(() => {}),
          page.click('input[type="submit"], button[type="submit"]'),
        ]);
        const url = page.url();
        if (url.includes("/entrar") || /\/login\/?(\?|$)/.test(url)) {
          console.log("auth rejected", loginUrl, "->", url);
          await context.close();
          continue;
        }
        await context.storageState({ path: statePath });
        console.log("auth ok", loginUrl, "->", url);
        await browser.close();
        return statePath;
      } catch (e) {
        console.log("auth fail", loginUrl, e.message);
        await context.close();
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  return null;
}

/**
 * Generic email/password form login (Omnicanal panel, Bold console, etc.).
 * @param {{
 *   loginUrl: string,
 *   user: string,
 *   pass: string,
 *   statePath: string,
 *   userSelector?: string,
 *   successUnless?: RegExp,
 *   successWhen?: (page: import('playwright').Page) => Promise<boolean>,
 * }} opts
 */
export async function formLogin(opts) {
  const {
    loginUrl,
    user,
    pass,
    statePath,
    userSelector = 'input[name="email"], input[type="email"], input[name="username"]',
    successUnless = /\/login\/?(\?|$)/i,
    successWhen,
  } = opts;
  if (!user || !pass || !loginUrl) return null;

  await ensureDir(dirname(statePath));
  const browser = await chromium.launch();
  try {
    if (!(await reachable(loginUrl))) {
      console.log("auth skip (down)", loginUrl);
      return null;
    }
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    try {
      await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.fill(userSelector, user);
      await page.fill('input[name="password"], input[type="password"]', pass);
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle", timeout: 30000 }).catch(() => {}),
        page.click('button[type="submit"], input[type="submit"]'),
      ]);
      await page.waitForTimeout(800);
      const url = page.url();
      const title = await page.title();
      let ok = !successUnless.test(url) && !successUnless.test(title);
      if (typeof successWhen === "function") {
        ok = await successWhen(page);
      }
      if (!ok) {
        console.log("auth rejected", loginUrl, "->", url, title);
        return null;
      }
      await context.storageState({ path: statePath });
      console.log("auth ok", loginUrl, "->", url);
      return statePath;
    } catch (e) {
      console.log("auth fail", loginUrl, e.message);
      return null;
    } finally {
      await context.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

/**
 * Streamlit marketplace login (Lexia): ?v=login form.
 */
export async function streamlitFormLogin(baseUrl, email, pass, statePath) {
  if (!email || !pass) return null;
  const root = baseUrl.replace(/\/$/, "");
  const loginUrl = `${root}/?v=login`;

  await ensureDir(dirname(statePath));
  const browser = await chromium.launch();
  try {
    if (!(await reachable(root))) return null;
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: DESKTOP.width, height: DESKTOP.height },
    });
    const page = await context.newPage();
    try {
      await page.goto(loginUrl, { waitUntil: "networkidle", timeout: 60000 }).catch(() =>
        page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 60000 })
      );
      await page.waitForTimeout(3000);

      const emailInput = page.locator('input[type="text"], input[type="email"]').first();
      const passInput = page.locator('input[type="password"]').first();
      await emailInput.waitFor({ timeout: 20000 });
      await emailInput.click();
      await emailInput.fill(email);
      await passInput.click();
      await passInput.fill(pass);

      // Streamlit form submit: prefer button with visible "Ingresar" / "Entrar"
      const labeled = page.getByRole("button", { name: /ingresar|entrar|login|acceder/i });
      if ((await labeled.count()) > 0) {
        await labeled.first().click();
      } else {
        await page.locator('button[data-testid="baseButton-primary"], .stForm button').first().click({
          timeout: 10000,
        });
      }
      await page.waitForTimeout(5000);

      const body = (await page.locator("body").innerText().catch(() => "")).slice(0, 800);
      const passLeft = await page.locator('input[type="password"]').count();
      const rejected =
        /contrase[nñ]a incorrecta|credenciales inv[aá]lid|invalid credentials/i.test(body) ||
        (passLeft > 0 && /Ingresar|Correo electr|Contrase/i.test(body) && (await page.url()).includes("v=login"));
      if (rejected) {
        console.log("auth rejected", loginUrl);
        return null;
      }
      await context.storageState({ path: statePath });
      console.log("auth ok", loginUrl, "->", page.url());
      return statePath;
    } catch (e) {
      console.log("auth fail", loginUrl, e.message);
      return null;
    } finally {
      await context.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

export async function recordShortVideo(url, outPath, { durationMs = 12000, scroll = false } = {}) {
  if (!(await reachable(url))) {
    console.log("skip video (down)", url);
    return false;
  }
  const tmpDir = join(dirname(outPath), "_tmp_vid");
  await ensureDir(dirname(outPath));
  await ensureDir(tmpDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tmpDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() =>
      page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })
    );
    await page.waitForTimeout(2000);
    if (scroll) {
      for (let i = 0; i < 4; i++) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(800);
      }
    } else {
      await page.waitForTimeout(durationMs);
    }
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  const files = (await readdir(tmpDir)).filter((f) => f.endsWith(".webm"));
  if (!files.length) return false;
  const webmOut = outPath.replace(/\.mp4$/i, ".webm");
  await rename(join(tmpDir, files[0]), webmOut);
  await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  console.log("video", webmOut);
  return true;
}
