import type { NextAuthConfig } from "next-auth";
import fs from 'fs';
import path from 'path';

// Tạo cơ chế tự động reset session mỗi khi có bản build mới trên production
const getNextAuthSecret = () => {
  if (process.env.NODE_ENV === "production") {
    try {
      // Đọc BUILD_ID do Next.js sinh ra mỗi khi chạy `npm run build`
      const buildId = fs.readFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'utf8');
      return `prod-secret-${buildId.trim()}`;
    } catch (e) {
      // Fallback nếu không đọc được file
      return process.env.NEXTAUTH_SECRET || "production-fallback-secret";
    }
  }
  return process.env.NEXTAUTH_SECRET || "development-secret-key";
};

export const authConfig = {
  secret: getNextAuthSecret(),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }

      if (user) {
        token.id = user.id as string;
        token.username = user.username as string;
        token.role = user.role as "ADMIN" | "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
