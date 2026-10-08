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
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    // parsePet ตรวจและแปลงข้อมูลทั้งหมด (รวม ageMonths) ให้แล้ว
    const { errors = {}, data } = parsePet(body);
    if (Object.keys(errors).length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ส่งเฉพาะ field ที่มีใน schema (whitelist)
    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        petTypeId: data.petTypeId,
        status: data.status,
        gender: data.gender,
        ageMonths: data.ageMonths,
        weightKg: data.weightKg,
        breed: data.breed,
        description: data.description,
        healthNote: data.healthNote,
        imageUrl: data.imageUrl,
        arrivedDate: data.arrivedDate,
      },
      include: { petType: true },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e) {
    if (e?.code === "P2003") {
      return NextResponse.json({ errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } }, { status: 400 });
    }
    console.error("POST Pet Error:", e);
    return NextResponse.json({ error: "ไม่สามารถบันทึกข้อมูลได้" }, { status: 500 });
  }
}
