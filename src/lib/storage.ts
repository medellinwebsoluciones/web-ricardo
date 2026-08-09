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
 * PNG/JPEG via visión LLM (OCR / descripción de diagrama).
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
        const text = result.text?.trim() || null;
        // Muchos certificados/cédulas vienen como PDF escaneado sin capa de
        // texto. Si no hay texto, intentamos OCR vía LLM cuando esté disponible.
        if (text) return text;
        return await extractTextFromPdfWithLlm(buffer, filename);
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

    if (
      mimeType === "image/png" ||
      mimeType === "image/jpeg" ||
      [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
    ) {
      return extractTextFromImage(buffer, mimeType || "image/png");
    }
  } catch (err) {
    console.error("extractText error:", err);
    return null;
  }

  return null;
}

async function extractTextFromImage(
  buffer: Buffer,
  mimeType: string,
): Promise<string | null> {
  try {
    const { clientFor, isLlmConfigured } = await import("./llm/client");
    if (!isLlmConfigured("chat")) {
      console.warn("extractText image: LLM chat no configurado");
      return null;
    }
    const { client, model, provider, tier } = clientFor("chat");
    const b64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${b64}`;
    const res = await client.chat.completions.create({
      model,
      temperature: 0,
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extrae TODO el texto visible de esta imagen (OCR). Si es un diagrama o captura de UI, describe la estructura y labels legibles. No inventes datos que no se vean. Responde en el idioma del texto de la imagen; si solo hay diagrama, en español técnico. Solo el contenido útil para una base de conocimiento RAG.`,
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    });

    try {
      const { logUsage } = await import("./usage");
      await logUsage({
        channel: "chat",
        model,
        provider,
        tier,
        promptTokens: res.usage?.prompt_tokens,
        completionTokens: res.usage?.completion_tokens,
      });
    } catch {
      // ignore usage log failures
    }

    const text = res.choices[0]?.message?.content?.trim();
    return text || null;
  } catch (err) {
    console.error("extractTextFromImage:", err);
    return null;
  }
}

async function extractTextFromPdfWithLlm(
  buffer: Buffer,
  filename: string,
): Promise<string | null> {
  try {
    const { clientFor, isLlmConfigured } = await import("./llm/client");
    if (!isLlmConfigured("chat")) {
      return null;
    }

    const { client, model, provider, tier } = clientFor("chat");
    const b64 = buffer.toString("base64");
    const dataUrl = `data:application/pdf;base64,${b64}`;

    const res = await (client.responses as any).create({
      model,
      temperature: 0,
      max_output_tokens: 3000,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Extrae TODO el texto legible de este PDF sin inventar datos. Respeta saltos de línea cuando aporten contexto (nombres, cargos, fechas, entidades, certificados). Si está vacío o ilegible, responde exactamente: SIN_TEXTO.`,
            },
            {
              type: "input_file",
              filename: filename || "documento.pdf",
              file_data: dataUrl,
            },
          ],
        },
      ],
    });

    try {
      const { logUsage } = await import("./usage");
      await logUsage({
        channel: "chat",
        model,
        provider,
        tier,
        promptTokens: res.usage?.input_tokens,
        completionTokens: res.usage?.output_tokens,
      });
    } catch {
      // ignore usage log failures
    }

    const text = String(res.output_text || "").trim();
    if (!text || text === "SIN_TEXTO") return null;
    return text;
  } catch (err) {
    console.error("extractTextFromPdfWithLlm:", err);
    return null;
  }
}
