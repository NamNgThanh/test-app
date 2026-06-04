import type { NextAuthConfig } from "next-auth";

// Tạo cơ chế tự động reset session mỗi khi có bản build mới trên production
const getNextAuthSecret = () => {
  if (process.env.NODE_ENV === "production") {
    // BUILD_TIME_SECRET được Next.js sinh ra cứng (hardcoded) lúc chạy lệnh `npm run build`
    if (process.env.BUILD_TIME_SECRET) {
      return `prod-secret-${process.env.BUILD_TIME_SECRET}`;
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
