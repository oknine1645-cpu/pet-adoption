import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies.getAll();

  // ตรวจสอบ Cookie ของระบบล็อกอินทุกตระกูล (NextAuth / Auth.js / Custom Session)
  const hasSession = cookies.some((c) => {
    const name = c.name.toLowerCase();
    return (
      name.includes("session") ||
      name.includes("token") ||
      name.includes("auth") ||
      name.includes("csrf") === false // ไม่เอา csrf token ตัวเดียว
    ) && (
      name.includes("session-token") ||
      name.includes("authjs") ||
      name.includes("next-auth") ||
      name.includes("baanpakjai")
    );
  });

  // ถ้าเข้าหน้าแรกสุด (/) แต่ยังไม่มี Session เลย ให้ส่งไปหน้า /login
  if (pathname === "/" && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};