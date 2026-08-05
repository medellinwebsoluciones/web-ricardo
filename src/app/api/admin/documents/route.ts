import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import {
  saveUpload,
  extractText,
  ALLOWED_MIME,
  MAX_UPLOAD_BYTES,
} from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return Response.json({
    documents: docs.map((d) => ({
      id: d.id,
      title: d.title,
      kind: d.kind,
      lang: d.lang,
      filename: d.filename,
      mimeType: d.mimeType,
      sizeBytes: d.sizeBytes,
      version: d.version,
      tags: d.tags,
      hasText: Boolean(d.extractedText),
      textChars: d.extractedText?.length ?? 0,
      knowledgeEntryId: d.knowledgeEntryId,
      createdAt: d.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) {
    return Response.json({ error: "file_required" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "file_too_large" }, { status: 413 });
  }

  const mimeType = file.type || "application/octet-stream";
  if (!ALLOWED_MIME[mimeType]) {
    return Response.json(
      { error: "mime_not_allowed", mimeType },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const storedName = await saveUpload(buffer, file.name, mimeType);
  const extracted = await extractText(buffer, mimeType, file.name);

  const title = String(form.get("title") || file.name).slice(0, 300);
  const kind = String(form.get("kind") || "otro").slice(0, 40);
  const lang = form.get("lang") === "en" ? "en" : "es";
  const tags = String(form.get("tags") || "")
    .split(",")
    .map((t) => t.trim().slice(0, 40))
    .filter(Boolean)
    .slice(0, 12);

  // Versionado por título: si ya existe uno con el mismo título, incrementa.
  const previous = await prisma.document.findFirst({
    where: { title },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const doc = await prisma.document.create({
    data: {
      title,
      kind,
      lang,
      tags,
      filename: file.name.slice(0, 300),
      storedName,
      mimeType,
      sizeBytes: buffer.length,
      version: (previous?.version ?? 0) + 1,
      extractedText: extracted,
    },
  });

  return Response.json({
    document: {
      id: doc.id,
      title: doc.title,
      kind: doc.kind,
      lang: doc.lang,
      filename: doc.filename,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      version: doc.version,
      tags: doc.tags,
      hasText: Boolean(doc.extractedText),
      textChars: doc.extractedText?.length ?? 0,
      knowledgeEntryId: doc.knowledgeEntryId,
      createdAt: doc.createdAt.toISOString(),
    },
  });
}
