import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies.getAll();

  // ตรวจหาคุกกี้ baanpakjai_session
  const hasSession = cookies.some(
    (c) =>
      c.name.includes("baanpakjai_session") ||
      c.name.includes("session-token") ||
      c.name === "authjs.session-token" ||
      c.name === "__Secure-authjs.session-token"
  );

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};