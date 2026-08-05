import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { readUpload } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Descarga autenticada: los archivos nunca se sirven desde /public. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return new Response("Not found", { status: 404 });

  try {
    const buffer = await readUpload(doc.storedName);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": doc.mimeType,
        "content-length": String(buffer.length),
        "content-disposition": `attachment; filename="${encodeURIComponent(doc.filename)}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new Response("File missing on disk", { status: 410 });
  }
}
