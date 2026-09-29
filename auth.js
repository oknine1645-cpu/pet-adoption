import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET || "baanpakjai-secret-key-production-32chars",
  
  // จุดสำคัญ: เปลี่ยนชื่อคุกกี้ใหม่ เพื่อตัดขาดจากคุกกี้เก่าที่ถอดรหัสไม่ผ่าน
  cookies: {
    sessionToken: {
      name: "baanpakjai_session",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || "USER",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const adminEmail = process.env.ADMIN_EMAIL;
          const assignedRole = user.email === adminEmail ? "ADMIN" : "USER";

          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name || "Google User",
                email: user.email,
                image: user.image || null,
                role: assignedRole,
              },
            });
          } else if (user.email === adminEmail && existingUser.role !== "ADMIN") {
            await prisma.user.update({
              where: { email: user.email },
              data: { role: "ADMIN" },
            });
          }
          return true;
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
      }
      if (token.email) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (token.email === adminEmail) {
          token.role = "ADMIN";
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { role: true },
          });
          token.role = dbUser?.role || "USER";
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "USER";
      }
      return session;
    },
  },
});