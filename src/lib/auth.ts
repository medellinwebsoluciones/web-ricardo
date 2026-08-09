import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getClientIp, rateLimit } from "./ratelimit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function headersAsRequest(headers: Record<string, string | string[] | undefined> | undefined): Request {
  const h = new Headers();
  if (headers) {
    for (const [k, v] of Object.entries(headers)) {
      if (Array.isArray(v)) {
        for (const item of v) h.append(k, item);
      } else if (typeof v === "string") {
        h.set(k, v);
      }
    }
  }
  return new Request("http://localhost", { headers: h });
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const ip = getClientIp(headersAsRequest(req?.headers));
        const rl = rateLimit(`login:${ip}:${email}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
        if (!rl.ok) return null;

        // 1) AdminUser en BD
        try {
          const user = await prisma.adminUser.findUnique({ where: { email } });
          if (user && bcrypt.compareSync(password, user.passwordHash)) {
            return { id: user.id, email: user.email, name: "Ricardo" };
          }
        } catch {
          /* la BD puede no estar lista; caer al fallback env */
        }

        // 2) Fallback por variables de entorno
        const envEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const envHash = process.env.ADMIN_PASSWORD_HASH?.replace(/\\\$/g, "$");
        const envPlain = process.env.ADMIN_PASSWORD;
        const allowPlain =
          process.env.NODE_ENV !== "production" && Boolean(envPlain);

        if (envEmail && email === envEmail) {
          if (allowPlain && password === envPlain) {
            return { id: "env-admin", email: envEmail, name: "Ricardo" };
          }
          if (envHash?.startsWith("$2") && bcrypt.compareSync(password, envHash)) {
            return { id: "env-admin", email: envEmail, name: "Ricardo" };
          }
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
