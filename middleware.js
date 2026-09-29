import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies.getAll();

  // ตรวจสอบว่ามีเซสชันการล็อกอินอยู่หรือไม่
  const hasSession = cookies.some(
    (c) =>
      c.name.includes("baanpakjai_session") ||
      c.name.includes("session-token") ||
      c.name === "authjs.session-token" ||
      c.name === "__Secure-authjs.session-token"
  );

  // ถ้าเปิดเข้าเว็บหน้าแรกสุด (/) แต่ยังไม่ได้ล็อกอิน ให้เด้งไปหน้า /login
  if (pathname === "/" && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};