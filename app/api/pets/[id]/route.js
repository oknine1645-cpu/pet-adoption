import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { parsePet, transitionError } from "@/lib/rules";

export const dynamic = "force-dynamic";

// 1. ดึงข้อมูลสัตว์เลี้ยงรายตัว (GET)
export async function GET(request, context) {
  try {
    const params = await context.params;
    const id = parseInt(params?.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID สัตว์เลี้ยงไม่ถูกต้อง" }, { status: 400 });
    }

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { petType: true },
    });

    if (!pet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยง" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (e) {
    console.error("GET Pet by ID Error:", e);
    return NextResponse.json({ error: e.message || "ไม่สามารถดึงข้อมูลได้" }, { status: 500 });
  }
}

// 2. อัปเดตข้อมูลสัตว์เลี้ยง (PUT)
export async function PUT(request, context) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = parseInt(params?.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID สัตว์เลี้ยงไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
    }

    const existingPet = await prisma.pet.findUnique({ where: { id } });
    if (!existingPet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยงที่จะแก้ไข" }, { status: 404 });
    }

    // แปลง typeId และ age เป็นตัวเลขป้องกัน Type Mismatch
    const normalizedBody = {
      ...body,
      petTypeId: body.petTypeId ?? body.typeId,
      ageMonths: body.ageMonths ?? body.age,
    };

    const { errors = {}, data } = parsePet(normalizedBody);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors).flat()[0] || "ข้อมูลที่กรอกไม่ถูกต้อง";
      return NextResponse.json({ error: firstError, errors }, { status: 400 });
    }

    // ตรวจสอบเงื่อนไขการเปลี่ยนสถานะ
    const statusError = transitionError(existingPet.status, data.status, body.confirmReopen);
    if (statusError) {
      return NextResponse.json({ error: statusError }, { status: 400 });
    }

    // อัปเดตเฉพาะคอลัมน์ที่มีใน Schema จริง
    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name: data.name,
        petTypeId: parseInt(data.petTypeId, 10),
        status: data.status,
        gender: data.gender,
        ageMonths: parseInt(data.ageMonths, 10),
        breed: data.breed || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
      },
      include: { petType: true },
    });

    return NextResponse.json(updatedPet, { status: 200 });
  } catch (e) {
    console.error("PUT Pet Error:", e);

    if (e?.code === "P2025") {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยงตัวนี้ในฐานข้อมูล" }, { status: 404 });
    }
    if (e?.code === "P2003") {
      return NextResponse.json({ error: "ไม่พบประเภทสัตว์นี้ในระบบ" }, { status: 400 });
    }

    return NextResponse.json(
      { error: e.message || "ไม่สามารถอัปเดตข้อมูลได้" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
  return PUT(request, context);
}

// 3. ลบข้อมูลสัตว์เลี้ยง (DELETE)
export async function DELETE(request, context) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const params = await context.params;
    const id = parseInt(params?.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID สัตว์เลี้ยงไม่ถูกต้อง" }, { status: 400 });
    }

    await prisma.pet.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
  } catch (e) {
    console.error("DELETE Pet Error:", e);
    return NextResponse.json({ error: e.message || "ไม่สามารถลบข้อมูลสัตว์เลี้ยงได้" }, { status: 500 });
  }
}