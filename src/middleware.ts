import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
  // Bỏ callbackUrl rườm rà, nếu chưa đăng nhập thì trỏ thẳng về /login trơn tru
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  // Bắt buộc xác thực cho tất cả các route, ngoại trừ login và file tĩnh
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|logo.png).*)"],
};
