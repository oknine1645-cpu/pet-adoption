import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "ไม่มีสิทธิ์ใช้งาน" }, { status: 403 }) };
  }
  return { session };
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}