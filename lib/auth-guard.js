import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireAdmin() {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("auth() failed:", e);
    return { error: NextResponse.json({ error: "ระบบยืนยันตัวตนขัดข้อง" }, { status: 500 }) };
  }
  if (!session?.user) {
    return { error: NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "ไม่มีสิทธิ์ใช้งาน" }, { status: 403 }) };
  }
  return { session };
}

export async function isAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === "ADMIN";
  } catch (e) {
    console.error("isAdmin() failed:", e);
    return false;
  }
}