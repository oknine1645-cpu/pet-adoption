import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies.getAll();

  // ตรวจสอบว่ามีคุกกี้ Session ของการล็อกอินอยู่หรือไม่
  const hasSession = cookies.some(
    (c) =>
      c.name.includes("baanpakjai_session") ||
      c.name.includes("session-token") ||
      c.name === "authjs.session-token" ||
      c.name === "__Secure-authjs.session-token"
  );

  // ถ้าเข้าหน้าแรกสุด (/) แล้วยังไม่ได้ล็อกอิน ให้ส่งไปหน้า /login
  // แต่ถ้าล็อกอินแล้ว (hasSession) ให้ปล่อยผ่านเข้าดูหน้าหลักได้เลย
  if (pathname === "/" && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};