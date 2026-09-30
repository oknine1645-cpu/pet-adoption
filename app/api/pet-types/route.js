import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  try {
    const types = await prisma.petType.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(types);
  } catch (e) {
    console.error("GET Pet Types Error:", e);
    return NextResponse.json({ error: "ดึงข้อมูลประเภทสัตว์ไม่สำเร็จ" }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name || name.length > 50) {
      return NextResponse.json({ error: "กรุณากรอกชื่อประเภท (ไม่เกิน 50 ตัวอักษร)" }, { status: 400 });
    }

    const dup = await prisma.petType.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (dup) return NextResponse.json({ error: "มีประเภทสัตว์นี้แล้ว" }, { status: 409 });

    const type = await prisma.petType.create({ data: { name } });
    return NextResponse.json(type, { status: 201 });
  } catch (e) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "มีประเภทสัตว์นี้แล้ว" }, { status: 409 });
    }
    console.error("POST Pet Type Error:", e);
    return NextResponse.json({ error: "เพิ่มประเภทสัตว์ไม่สำเร็จ" }, { status: 500 });
  }
}