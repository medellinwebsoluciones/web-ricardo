import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

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
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

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
        if (envEmail && email === envEmail) {
          if (envPlain && password === envPlain) {
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
