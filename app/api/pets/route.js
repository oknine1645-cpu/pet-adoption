import { NextResponse } from "next/server";
import { auth } from "@/auth"; // หรือพาธที่โปรเจกต์คุณใช้เรียก session

export async function POST(req) {
  // --- 1. แทรกท่อนตรวจสิทธิ์ไว้บนสุดตรงนี้ ---
  const session = await auth();
  const isAdmin =
    session?.user?.role === "ADMIN" ||
    session?.user?.email === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง (Unauthorized)" }, { status: 401 });
  }
  // ----------------------------------------

  // โค้ดเดิมของคุณที่ใช้บันทึกข้อมูลสัตว์เลี้ยง (Prisma create ฯลฯ) ปล่อยทำงานต่อตามปกติ
  const body = await req.json();
  // ...
}