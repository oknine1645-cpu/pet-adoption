import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

// 1. ดึงประเภทสัตว์ทั้งหมด (คนทั่วไปดูได้)
export async function GET() {
  try {
    let types = await prisma.petType.findMany({
      orderBy: { name: "asc" },
    });

    // หากฐานข้อมูลยังว่างเปล่า ให้สร้างข้อมูลเริ่มต้นให้อัตโนมัติทันที
    if (types.length === 0) {
      const defaultTypes = ["สุนัข", "แมว", "กระต่าย", "นก", "อื่นๆ"];
      for (const name of defaultTypes) {
        await prisma.petType.create({
          data: { name },
        });
      }
      types = await prisma.petType.findMany({
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json(types);
  } catch (error) {
    console.error("GET Pet Types Error:", error);
    return NextResponse.json(
      { error: "ดึงข้อมูลประเภทสัตว์ล้มเหลว: " + error.message },
      { status: 500 }
    );
  }
}

// 2. บันทึกประเภทสัตว์ใหม่ (เฉพาะแอดมินเท่านั้น)
export async function POST(request) {
  try {
    // --- 1. ตรวจสอบสิทธิ์แอดมินก่อนเป็นอันดับแรก ---
    const { error } = await requireAdmin();
    if (error) return error; // ถ้าไม่ใช่แอดมิน จะถูกบล็อกทันทีตั้งแต่ตรงนี้
    // ----------------------------------------

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อประเภทสัตว์เลี้ยง" },
        { status: 400 }
      );
    }

    // ตรวจสอบชื่อซ้ำ
    const existing = await prisma.petType.findFirst({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "มีประเภทสัตว์นี้ในระบบแล้ว" },
        { status: 400 }
      );
    }

    const newType = await prisma.petType.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error("POST Pet Type Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเพิ่มประเภทสัตว์: " + error.message },
      { status: 500 }
    );
  }
}