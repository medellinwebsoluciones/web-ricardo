import { randomBytes } from "node:crypto";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";

/**
 * Directorio de subidas. En Docker `UPLOAD_DIR` apunta al volumen `app_uploads`;
 * el fallback relativo (resuelto contra el cwd del proceso en tiempo de
 * ejecución) solo aplica en dev local.
 */
const DEFAULT_UPLOAD_DIR = "storage/uploads";

export function uploadDir(): string {
  return process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
}

export const MAX_UPLOAD_BYTES = process.env.MAX_UPLOAD_MB
  ? Number(process.env.MAX_UPLOAD_MB) * 1024 * 1024
  : 15 * 1024 * 1024;

export const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "text/plain": ".txt",
  "text/markdown": ".md",
  "application/json": ".json",
  "image/png": ".png",
  "image/jpeg": ".jpg",
};

function safeExt(filename: string, mimeType: string): string {
  const known = ALLOWED_MIME[mimeType];
  if (known) return known;
  const ext = path.extname(filename).toLowerCase();
  return /^\.[a-z0-9]{1,6}$/.test(ext) ? ext : "";
}

export async function saveUpload(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  const storedName = `${Date.now()}-${randomBytes(8).toString("hex")}${safeExt(filename, mimeType)}`;
  await writeFile(path.join(dir, storedName), buffer);
  return storedName;
}

/** Lee un archivo guardado. Bloquea cualquier intento de path traversal. */
export async function readUpload(storedName: string): Promise<Buffer> {
  const base = path.resolve(uploadDir());
  const target = path.resolve(base, storedName);
  if (!target.startsWith(base + path.sep)) throw new Error("invalid_path");
  return readFile(target);
}

export async function deleteUpload(storedName: string): Promise<void> {
  const base = path.resolve(uploadDir());
  const target = path.resolve(base, storedName);
  if (!target.startsWith(base + path.sep)) throw new Error("invalid_path");
  await unlink(target).catch(() => {});
}

/**
 * Extrae texto para poder enviar el documento al RAG.
 * PDF via pdf-parse, DOCX via mammoth, texto plano directo.
 * Devuelve null si el formato no es extraíble (ej. imágenes).
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string,
  filename: string,
): Promise<string | null> {
  const ext = path.extname(filename).toLowerCase();

  try {
    if (mimeType === "application/pdf" || ext === ".pdf") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      try {
        const result = await parser.getText();
        return result.text?.trim() || null;
      } finally {
        await parser.destroy();
      }
    }

    if (
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      ext === ".docx"
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value?.trim() || null;
    }

    if (
      mimeType.startsWith("text/") ||
      mimeType === "application/json" ||
      [".txt", ".md", ".json"].includes(ext)
    ) {
      return buffer.toString("utf8").trim() || null;
    }
  } catch (err) {
    console.error("extractText error:", err);
    return null;
  }

  return null;
}
