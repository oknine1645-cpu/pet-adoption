import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ถ้าเปิดเข้าหน้าแรกสุด (/) ให้ส่งไปหน้า /login ทันที
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const cookies = req.cookies.getAll();
  const hasSession = cookies.some(
    (c) =>
      c.name.includes("baanpakjai_session") ||
      c.name.includes("session-token") ||
      c.name === "authjs.session-token" ||
      c.name === "__Secure-authjs.session-token"
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};