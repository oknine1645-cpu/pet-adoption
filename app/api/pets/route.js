import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdmin } from "@/lib/auth-guard";
import { parsePet, STATUSES } from "@/lib/rules";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let status = searchParams.get("status") || "AVAILABLE";
    if (!(await isAdmin())) status = "AVAILABLE"; // คนทั่วไปเห็นเฉพาะ AVAILABLE
    if (status !== "ALL" && !STATUSES.includes(status)) {
      return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const where = {};
    if (status !== "ALL") where.status = status;

    const typeId = searchParams.get("typeId") || searchParams.get("petTypeId");
    if (typeId) {
      const n = Number(typeId);
      if (!Number.isInteger(n)) return NextResponse.json({ error: "typeId ไม่ถูกต้อง" }, { status: 400 });
      where.petTypeId = n;
    }

    const q = (searchParams.get("q") || "").trim().slice(0, 100);
    if (q) where.name = { contains: q, mode: "insensitive" };

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

export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    // 1. แปลงค่าอายุและประเภทสัตว์ให้เป็นตัวเลข Int
    const resolvedAgeMonths = parseInt(body.ageMonths ?? body.age ?? 0, 10);
    const resolvedTypeId = parseInt(body.petTypeId || body.typeId, 10);

    const { errors = {}, data } = parsePet(body);
    if (Object.keys(errors).length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // 2. จัดรูปแบบข้อมูล และตัดฟิลด์ age ที่ไม่มีในฐานข้อมูลทิ้ง
    const petData = {
      ...data,
      petTypeId: isNaN(resolvedTypeId) ? data.petTypeId : resolvedTypeId,
      ageMonths: isNaN(resolvedAgeMonths) ? 0 : resolvedAgeMonths,
    };

    // ลบ age ทิ้งเพื่อป้องกัน Prisma ฟ้อง Unknown argument
    delete petData.age;

    const pet = await prisma.pet.create({
      data: petData,
      include: { petType: true },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e) {
    if (e?.code === "P2003") {
      return NextResponse.json({ errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } }, { status: 400 });
    }
    console.error("POST Pet Error:", e);
    return NextResponse.json({ error: e.message || "ไม่สามารถบันทึกข้อมูลได้" }, { status: 500 });
  }
}