import type { NextAuthConfig } from "next-auth";

// Tạo cơ chế tự động reset session mỗi khi có bản build mới trên production
const getNextAuthSecret = () => {
  if (process.env.NODE_ENV === "production") {
    if (process.env.BUILD_TIME_SECRET) {
      return `prod-secret-${process.env.BUILD_TIME_SECRET}`;
    }
  }
  return process.env.NEXTAUTH_SECRET || "development-secret-key";
};

// Lấy version hiện tại của hệ thống để đánh dấu các session
const getAppVersion = () => {
  return process.env.BUILD_TIME_SECRET || process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || "v1";
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
        token.appVersion = getAppVersion();
      }

      // Vô hiệu hóa session cũ nếu version hệ thống đã thay đổi (sau khi build lại)
      if (process.env.NODE_ENV === "production" && token.appVersion !== getAppVersion()) {
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      if (!token || !token.id) {
        return { ...session, user: null as any };
      }

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
