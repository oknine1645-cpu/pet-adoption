import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const norm = (e) => String(e ?? "").trim().toLowerCase();
const ADMIN_EMAIL = norm(process.env.ADMIN_EMAIL);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  trustHost: true,
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = norm(credentials?.email);
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) return null;
        if (!(await bcrypt.compare(password, user.password))) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      const email = norm(user.email);
      if (!email || profile?.email_verified !== true) return false;
      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        const isAdminEmail = email === ADMIN_EMAIL;
        if (!existing) {
          await prisma.user.create({
            data: {
              email,
              name: user.name || "Google User",
              image: user.image || null,
              emailVerified: new Date(),
              role: isAdminEmail ? "ADMIN" : "USER",
            },
          });
        } else {
          const patch = {};
          // ถ้าบัญชีถูกสร้างด้วยรหัสผ่านที่ไม่เคยยืนยันอีเมล ให้ล้างรหัสผ่าน (กัน pre-hijacking)
          if (existing.password && !existing.emailVerified) patch.password = null;
          if (!existing.emailVerified) patch.emailVerified = new Date();
          if (isAdminEmail && existing.role !== "ADMIN") patch.role = "ADMIN";
          if (Object.keys(patch).length) {
            await prisma.user.update({ where: { email }, data: patch });
          }
        }
        return true;
      } catch (e) {
        console.error("Google signIn error:", e);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const email = norm(user.email);
        const db = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true },
        });
        token.id = db?.id ?? null;
        token.role = db?.role ?? "USER";
        token.email = email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
});