import { randomBytes } from "crypto";

/** Cuid-like id for Practice* rows created outside Prisma defaults. */
export function createId(): string {
  return `p${randomBytes(12).toString("hex")}`;
}
