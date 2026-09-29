import { NextResponse } from "next/server";

export function middleware(req) {
  // ใครเปิดเข้าเว็บหน้าแรกสุด (/) ให้ส่งไปหน้า /login ทันทีเสมอ
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};