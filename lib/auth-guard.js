import { NextResponse } from "next/server";
import { auth } from "@/auth";

// 1. ฟังก์ชันตรวจสอบสิทธิ์ Admin แบบคืนค่า boolean (true/false) สำหรับเช็กสิทธิ์ทั่วไป
export async function isAdmin() {
  try {
    const session = await auth();
    return session?.user?.role === "ADMIN";
  } catch (e) {
    console.error("isAdmin check failed:", e);
    return false;
  }
}

// 2. ฟังก์ชันล็อกสิทธิ์สำหรับ API ป้องกันไม่ให้คนทั่วไปเข้าถึง (คืนค่า error ตอบกลับหน้าเว็บทันที)
export async function requireAdmin() {
  let session;
  try {
    session = await auth();
  } catch (e) {
    console.error("auth() failed:", e);
    return {
      error: NextResponse.json(
        { error: "ระบบยืนยันตัวตนขัดข้อง" },
        { status: 500 }
      ),
    };
  }

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "คุณไม่มีสิทธิ์ผู้ดูแลระบบ (Admin Only)" },
        { status: 403 }
      ),
    };
  }

  return { session };
}