import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { deleteUpload } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return Response.json({ error: "not_found" }, { status: 404 });

  await deleteUpload(doc.storedName);
  await prisma.document.delete({ where: { id } });
  return Response.json({ ok: true });
}
