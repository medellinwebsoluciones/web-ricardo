import { prisma } from "@/lib/prisma";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { MIN_EXAMPLES, buildJsonl, trainingStats } from "@/lib/finetune";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Exporta el dataset en el formato de chat de OpenAI.
 *
 * El gate no es burocracia: por debajo de ~80 ejemplos de calidad el
 * fine-tuning rinde peor que meter buenos ejemplos en el prompt, así que
 * lanzar el job antes es tirar tiempo y dinero.
 */
export async function POST() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const { jsonl, count } = await buildJsonl();

  if (count < MIN_EXAMPLES) {
    return Response.json(
      {
        error: "not_enough_examples",
        count,
        required: MIN_EXAMPLES,
        stats: await trainingStats(),
      },
      { status: 400 },
    );
  }

  await prisma.trainingExample.updateMany({
    where: { approved: true },
    data: { exportedAt: new Date() },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(jsonl, {
    headers: {
      "content-type": "application/jsonl; charset=utf-8",
      "content-disposition": `attachment; filename="ricardo-finetune-${stamp}.jsonl"`,
      "x-example-count": String(count),
    },
  });
}
