/**
 * Captura UIs locales/prod o regenera diagramas.
 * Uso:
 *   node scripts/capture-portfolio.mjs
 *   node scripts/capture-portfolio.mjs --diagrams-only
 *   node scripts/capture-portfolio.mjs --no-diagrams
 *   node scripts/capture-portfolio.mjs --live auge sitio-mws
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: "inherit", shell: false });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} failed: ${code}`))));
  });
}

async function main() {
  const diagramsOnly = process.argv.includes("--diagrams-only");
  const noDiagrams = process.argv.includes("--no-diagrams");
  const liveIdx = process.argv.indexOf("--live");
  const liveArgs =
    liveIdx >= 0
      ? process.argv.slice(liveIdx + 1).filter((a) => !a.startsWith("--"))
      : process.argv.slice(2).filter((a) => !a.startsWith("--") && a !== "--live");

  if (!noDiagrams) {
    await run(process.execPath, [join(__dirname, "generate-arch-diagrams.mjs")]);
  }
  if (diagramsOnly) return;

  const liveScript = join(__dirname, "capture-portfolio-live.mjs");
  const args = [liveScript, ...liveArgs];
  if (process.argv.includes("--video-lab")) args.push("--video-lab");
  await run(process.execPath, args);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
