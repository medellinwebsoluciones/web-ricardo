/**
 * Genera el CV en PDF (A4, texto seleccionable = compatible con ATS) desde docs/cv/cv-data.json.
 *
 * Uso:
 *   node scripts/generate-cv.mjs                          # variante arquitecto, ES
 *   node scripts/generate-cv.mjs --variant=fullstack      # variante full stack, ES
 *   node scripts/generate-cv.mjs --variant=fullstack --lang=en
 *
 * Salida: docs/cv/CV-Ricardo-Zuluaga-<variante>-<lang>.pdf
 */
import { readFile, writeFile, unlink, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const cvDir = join(root, "docs", "cv");

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const variantKey = args.get("variant") ?? "arquitecto";
const lang = args.get("lang") === "en" ? "en" : "es";

const data = JSON.parse(await readFile(join(cvDir, "cv-data.json"), "utf8"));
const variant = data.variantes[variantKey];
if (!variant) {
  console.error(`Variante desconocida: ${variantKey}. Opciones: ${Object.keys(data.variantes).join(", ")}`);
  process.exit(1);
}

const t = (value) => (typeof value === "string" ? value : (value?.[lang] ?? ""));
const L = {
  es: {
    experiencia: "Experiencia",
    proyectos: "Proyectos destacados",
    laboratorio: "Laboratorio Nova OS",
    stack: "Stack técnico",
    certificaciones: "Certificaciones",
    formacion: "Formación",
    idiomas: "Idiomas",
  },
  en: {
    experiencia: "Experience",
    proyectos: "Selected projects",
    laboratorio: "Nova OS lab",
    stack: "Tech stack",
    certificaciones: "Certifications",
    formacion: "Education",
    idiomas: "Languages",
  },
}[lang];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pending = [];
const check = (value, where) => {
  if (typeof value === "string" && value.startsWith("TODO:")) pending.push(`${where}: ${value.slice(5)}`);
  return value;
};

const contact = data.contacto;
const contactLine = [
  t(contact.ubicacion),
  contact.email,
  contact.telefono,
  contact.web,
  contact.linkedin,
  contact.github,
]
  .map((v) => check(v, "contacto"))
  .filter(Boolean)
  .map((v) => esc(String(v).replace(/^TODO:/, "")))
  .join(" · ");

const sections = {
  experiencia: () => `
  <section>
    <h2>${L.experiencia}</h2>
    ${data.experiencia
      .map(
        (job) => `
    <article class="job">
      <div class="job-head">
        <h3>${esc(check(t(job.cargo), job.empresa).replace(/^TODO:/, ""))} — <span class="org">${esc(job.empresa)}</span></h3>
        <span class="meta">${esc(check(t(job.periodo), job.empresa).replace(/^TODO:/, ""))}</span>
      </div>
      <div class="place">${esc(check(t(job.ubicacion), job.empresa).replace(/^TODO:/, ""))}</div>
      <ul>${job.bullets[lang].map((b) => `<li>${esc(check(b, job.empresa).replace(/^TODO:/, ""))}</li>`).join("")}</ul>
    </article>`
      )
      .join("")}
  </section>`,

  proyectos: () => {
    const list = data.proyectos.filter((p) => p.en_cv !== false);
    return `
  <section>
    <h2>${L.proyectos}</h2>
    ${list
      .map(
        (p) => `
    <article class="project">
      <h3>${esc(p.nombre)}${p.url ? ` <span class="meta">${esc(p.url.replace(/^https?:\/\//, ""))}</span>` : ""}</h3>
      <p>${esc(t(p.resumen))}</p>
      <div class="chips">${(p.stack || []).map((s) => `<span>${esc(s)}</span>`).join("")}</div>
    </article>`
      )
      .join("")}
  </section>`;
  },

  laboratorio: () => {
    const lab = data.laboratorio;
    if (!lab) return "";
    return `
  <section>
    <h2>${L.laboratorio}</h2>
    <ul>${(lab.bullets?.[lang] || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  </section>`;
  },

  certificaciones: () => {
    const certs = data.certificaciones || [];
    if (!certs.length) return "";
    return `
  <section>
    <h2>${L.certificaciones}</h2>
    ${certs
      .map(
        (c) => `
    <article class="edu">
      <div class="job-head">
        <h3>${esc(t(c.nombre))} — <span class="org">${esc(c.emisor)}</span></h3>
        <span class="meta">${esc(t(c.fecha))}</span>
      </div>
    </article>`
      )
      .join("")}
  </section>`;
  },

  stack: () => `
  <section>
    <h2>${L.stack}</h2>
    <table class="stack">
      ${data.stack.map((g) => `<tr><th>${esc(t(g.grupo))}</th><td>${esc(g.items.join(" · "))}</td></tr>`).join("")}
    </table>
  </section>`,

  formacion: () => `
  <section>
    <h2>${L.formacion}</h2>
    ${data.formacion
      .map(
        (f) => `
    <article class="edu">
      <div class="job-head">
        <h3>${esc(check(t(f.titulo), "formacion").replace(/^TODO:/, ""))}</h3>
        <span class="meta">${esc(check(t(f.periodo), "formacion").replace(/^TODO:/, ""))}</span>
      </div>
      ${t(f.detalle) ? `<p>${esc(t(f.detalle))}</p>` : ""}
    </article>`
      )
      .join("")}
  </section>`,

  idiomas: () => `
  <section>
    <h2>${L.idiomas}</h2>
    <p>${data.idiomas.map((i) => esc(check(t(i), "idiomas").replace(/^TODO:/, ""))).join(" · ")}</p>
  </section>`,
};

const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 14mm 15mm; }
  body { font-family: "Segoe UI", system-ui, sans-serif; color: #18181b; font-size: 10pt; line-height: 1.45; }
  header { border-bottom: 2px solid #18181b; padding-bottom: 10px; margin-bottom: 14px; }
  h1 { font-size: 21pt; font-weight: 700; letter-spacing: -0.02em; }
  .title { font-size: 11.5pt; color: #047857; font-weight: 600; margin-top: 3px; }
  .contact { font-size: 8.5pt; color: #52525b; margin-top: 7px; }
  .summary { margin-bottom: 14px; text-align: justify; }
  section { margin-bottom: 13px; break-inside: avoid; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.1em; color: #047857;
       border-bottom: 1px solid #d4d4d8; padding-bottom: 3px; margin-bottom: 8px; }
  .job, .project, .edu { margin-bottom: 9px; break-inside: avoid; }
  .job-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  h3 { font-size: 10.5pt; font-weight: 600; }
  .org { font-weight: 600; }
  .meta { font-size: 8.5pt; color: #52525b; white-space: nowrap; }
  .place { font-size: 8.5pt; color: #71717a; margin-bottom: 3px; }
  ul { margin: 0 0 0 15px; }
  li { margin-bottom: 2px; }
  .project p { margin-bottom: 3px; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chips span { font-size: 7.8pt; color: #3f3f46; border: 1px solid #d4d4d8; border-radius: 3px; padding: 1px 5px; }
  table.stack { width: 100%; border-collapse: collapse; }
  table.stack th { text-align: left; width: 105px; font-weight: 600; vertical-align: top; padding: 2px 8px 2px 0; }
  table.stack td { padding: 2px 0; color: #3f3f46; }
</style></head>
<body>
  <header>
    <h1>${esc(contact.nombre)}</h1>
    <div class="title">${esc(t(variant.titulo))}</div>
    <div class="contact">${contactLine}</div>
  </header>
  <p class="summary">${esc(check(t(variant.resumen), "resumen").replace(/^TODO:/, ""))}</p>
  ${variant.orden.map((key) => (sections[key] ? sections[key]() : "")).join("")}
</body></html>`;

await mkdir(cvDir, { recursive: true });
const tmp = join(cvDir, "_cv.html");
await writeFile(tmp, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${tmp.replace(/\\/g, "/")}`);
const out = join(cvDir, `CV-Ricardo-Zuluaga-${variantKey}-${lang}.pdf`);
await page.pdf({ path: out, format: "A4", printBackground: true });
if (args.has("preview")) {
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.screenshot({ path: out.replace(/\.pdf$/, "-preview.png"), fullPage: true });
}
await browser.close();
await unlink(tmp);

console.log(`CV -> ${out}`);
if (pending.length) {
  console.log(`\n[!] ${pending.length} dato(s) por confirmar antes de enviar el CV:`);
  for (const p of new Set(pending)) console.log(`    - ${p}`);
}
