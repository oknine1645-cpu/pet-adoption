import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req) {
  // 1. ตรวจสิทธิ์แอดมินด้วย auth-guard (ถ้าไม่ผ่าน จะส่ง 401/403 ให้ทันที)
  const { error } = await requireAdmin();
  if (error) return error;

  // 2. โค้ดบันทึกข้อมูลสัตว์เลี้ยงของเดิม...
}