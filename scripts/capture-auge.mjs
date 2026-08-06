/**
 * Capturas reales Auge Urbano (prod por defecto, o túnel/local).
 * Uso:
 *   node scripts/capture-auge.mjs
 *   node scripts/capture-auge.mjs https://augeurbano.com
 *   node scripts/capture-auge.mjs http://127.0.0.1:8123
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const base = process.argv[2] || process.env.PORTFOLIO_AUGE_BASE || "https://augeurbano.com";

const child = spawn(
  process.execPath,
  [join(__dirname, "capture-portfolio-live.mjs"), "auge"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, PORTFOLIO_AUGE_BASE: base },
  }
);
child.on("exit", (code) => process.exit(code ?? 1));
