import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Bắt buộc xác thực cho tất cả các route, ngoại trừ login và file tĩnh
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|logo.png).*)"],
};
