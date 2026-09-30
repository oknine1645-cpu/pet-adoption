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
  // ตรวจสอบสิทธิ์ Admin
  const { error } = await requireAdmin();
  if (error) {
    return NextResponse.json(
      { error: "คุณไม่มีสิทธิ์ผู้ดูแลระบบ (กรุณาเข้าสู่ระบบด้วยบัญชี Admin)" },
      { status: 403 }
    );
  }

  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
    }

    // แปลง typeId และอายุ ageMonths ให้เป็นตัวเลข Int ชัวร์ๆ
    const normalizedTypeId = Number(rawBody.petTypeId || rawBody.typeId);
    const parsedAge = Number(rawBody.ageMonths ?? rawBody.age ?? 0);
    const resolvedAge = isNaN(parsedAge) ? 0 : parsedAge;

    const body = {
      ...rawBody,
      petTypeId: isNaN(normalizedTypeId) ? undefined : normalizedTypeId,
      typeId: isNaN(normalizedTypeId) ? undefined : normalizedTypeId,
      ageMonths: resolvedAge,
      age: resolvedAge,
    };

    // ตรวจสอบข้อมูลด้วย parsePet
    const { errors = {}, data } = parsePet(body);

    if (Object.keys(errors).length > 0) {
      const firstErrorMessage = Object.values(errors).flat()[0] || "ข้อมูลที่กรอกไม่ถูกต้อง";
      return NextResponse.json(
        { error: firstErrorMessage, errors },
        { status: 400 }
      );
    }

    // รวมข้อมูลและบังคับใส่ ageMonths ให้ Prisma
    const petData = {
      ...data,
      petTypeId: data?.petTypeId || normalizedTypeId,
      ageMonths: resolvedAge, // ส่ง ageMonths ให้ตรงกับ Schema บังคับ
    };

    const pet = await prisma.pet.create({
      data: petData,
      include: { petType: true },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e) {
    console.error("POST Pet Error:", e);

    if (e?.code === "P2003") {
      return NextResponse.json(
        { error: "ไม่พบประเภทสัตว์นี้ในฐานข้อมูล กรุณาเลือกใหม่", errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: e.message || "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}