import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies.getAll();

  // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
  const hasSession = cookies.some(
    (c) =>
      c.name.includes("baanpakjai_session") ||
      c.name.includes("session-token") ||
      c.name === "authjs.session-token" ||
      c.name === "__Secure-authjs.session-token"
  );

  // 1. ถ้ายังไม่ล็อกอิน แล้วพยายามเข้าหน้าแรก (/) ให้ดีดไปหน้า /login ทันที
  if (pathname === "/" && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. ถ้าล็อกอินแล้ว ปล่อยให้เข้าหน้าแรกได้ตามปกติ (ปุ่ม "กลับหน้าหลัก" จะไม่วนลูป)
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};