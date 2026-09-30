import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { parsePet } from "@/lib/rules";

// 1. ดึงรายการสัตว์เลี้ยงทั้งหมด (คนทั่วไปดูได้ ไม่ต้องล็อกอิน)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get("typeId");
    const status = searchParams.get("status");

    // สร้างเงื่อนไขตัวกรอง
    const where = {};
    if (typeId) where.petTypeId = Number(typeId);
    if (status) where.status = status;

    const pets = await prisma.pet.findMany({
      where,
      include: {
        petType: true, // ดึงข้อมูลประเภทสัตว์มาด้วย
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET Pets Error:", error);
    return NextResponse.json(
      { error: "ดึงข้อมูลสัตว์เลี้ยงล้มเหลว: " + error.message },
      { status: 500 }
    );
  }
}

// 2. เพิ่มสัตว์เลี้ยงตัวใหม่ (เฉพาะแอดมินเท่านั้น)
export async function POST(request) {
  try {
    // 1. ตรวจสอบสิทธิ์แอดมินก่อน
    const { error } = await requireAdmin();
    if (error) return error;

    // 2. ตรวจสอบความถูกต้องของข้อมูลผ่าน lib/rules.js
    const body = await request.json();
    const { errors, data } = parsePet(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "ข้อมูลสัตว์เลี้ยงไม่ถูกต้อง", details: errors },
        { status: 400 }
      );
    }

    // 3. ตรวจสอบว่าประเภทสัตว์ (petTypeId) มีอยู่ในฐานข้อมูลจริงไหม
    const typeExists = await prisma.petType.findUnique({
      where: { id: data.petTypeId },
    });

    if (!typeExists) {
      return NextResponse.json(
        { error: "ไม่พบประเภทสัตว์ที่ระบุในระบบ" },
        { status: 400 }
      );
    }

    // 4. บันทึกลงฐานข้อมูล
    const newPet = await prisma.pet.create({
      data,
      include: {
        petType: true,
      },
    });

    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error("POST Pet Error:", error);
    return NextResponse.json(
      { error: "บันทึกข้อมูลสัตว์เลี้ยงล้มเหลว: " + error.message },
      { status: 500 }
    );
  }
}