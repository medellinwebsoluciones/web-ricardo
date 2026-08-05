/**
 * Capturas reales de la app Auge Urbano para la galeria del caso de portafolio.
 * Requiere tunel SSH al contenedor: ssh -N -L 8123:127.0.0.1:8000 root@<vps>
 * Uso: node scripts/capture-auge.mjs [baseUrl]
 */
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images", "captures", "auge");
const base = process.argv[2] || "http://127.0.0.1:8123";

const shots = [
  { name: "auge-home", path: "/" },
  { name: "auge-catalogo", path: "/propiedades/" },
  {
    name: "auge-ficha",
    path: "/propiedades/apartamento/medellin/apartamento-en-castropol-el-poblado/",
  },
  { name: "auge-zonas", path: "/zonas/" },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // La app emite URLs absolutas contra PUBLIC_BASE_URL; redirigirlas al tunel
  // para que assets como el logo SVG resuelvan durante la captura.
  await page.route("https://augeurbano.com/**", (route) => {
    const url = new URL(route.request().url());
    return route.continue({ url: `${base}${url.pathname}${url.search}` });
  });

  for (const s of shots) {
    await page.goto(`${base}${s.path}`, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(4000);
    const tmp = join(outDir, `${s.name}.tmp.png`);
    await page.screenshot({ path: tmp, type: "png" });
    const info = await sharp(tmp)
      .resize(1600)
      .webp({ quality: 82 })
      .toFile(join(outDir, `${s.name}.webp`));
    await rm(tmp);
    console.log(s.name, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
