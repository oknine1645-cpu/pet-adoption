import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdmin } from "@/lib/auth-guard";
import { parsePet, STATUSES } from "@/lib/rules";

export const dynamic = "force-dynamic";

// ดึงรายการสัตว์เลี้ยง (รองรับกรองสถานะ, ประเภทสัตว์ และค้นหา)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let status = searchParams.get("status") || "AVAILABLE";

    // หากไม่ใช่ Admin จะดูได้เฉพาะสัตว์ที่มีสถานะ AVAILABLE
    if (!(await isAdmin())) {
      status = "AVAILABLE";
    }

    if (status !== "ALL" && !STATUSES.includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const where = {};
    if (status !== "ALL") {
      where.status = status;
    }

    // รองรับทั้ง typeId และ petTypeId
    const typeId = searchParams.get("typeId") || searchParams.get("petTypeId");
    if (typeId) {
      const n = Number(typeId);
      if (!Number.isInteger(n)) {
        return NextResponse.json({ error: "typeId ไม่ถูกต้อง" }, { status: 400 });
      }
      where.petTypeId = n;
    }

    const q = (searchParams.get("q") || "").trim().slice(0, 100);
    if (q) {
      where.name = { contains: q, mode: "insensitive" };
    }

    const pets = await prisma.pet.findMany({
      where,
      include: { petType: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(pets);
  } catch (e) {
    console.error("GET Pets Error:", e);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลสัตว์ได้" }, { status: 500 });
  }
}

// เพิ่มสัตว์เลี้ยงใหม่เข้าสู่ระบบ
export async function POST(request) {
  try {
    // 1. ตรวจสอบสิทธิ์ผู้ดูแลระบบ (Admin Guard)
    const { error } = await requireAdmin();
    if (error) return error;

    // 2. ตรวจสอบก้อน Body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
    }

    // 3. ตรวจสอบความถูกต้องของข้อมูลตามกฎธุรกิจ
    const { errors = {}, data } = parsePet(body);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors).flat()[0] || "ข้อมูลที่กรอกไม่ถูกต้อง";
      return NextResponse.json({ error: firstError, errors }, { status: 400 });
    }

    // 4. บันทึกลง Prisma เฉพาะคอลัมน์ที่มีอยู่จริงในฐานข้อมูล
    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        petTypeId: data.petTypeId,
        status: data.status,
        gender: data.gender,
        ageMonths: data.ageMonths,
        breed: data.breed || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
      },
      include: { petType: true },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e) {
    console.error("POST Pet Error:", e);

    // จัดการ Foreign Key Constraint ล้มเหลว (เช่น ไม่พบ ID ประเภทสัตว์)
    if (e?.code === "P2003") {
      return NextResponse.json(
        { error: "ไม่พบประเภทสัตว์นี้ในระบบ กรุณาเลือกใหม่", errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: e.message || "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}