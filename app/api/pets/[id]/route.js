import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { parsePet, transitionError } from "@/lib/rules";

export const dynamic = "force-dynamic";

// ดึงข้อมูลสัตว์เลี้ยงรายตัว
export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams?.id);

    if (!Number.isInteger(id)) {
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
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลได้" }, { status: 500 });
  }
}

// อัปเดตข้อมูลสัตว์เลี้ยง (PUT)
export async function PUT(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์ Admin
    const { error } = await requireAdmin();
    if (error) return error;

    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams?.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "ID สัตว์เลี้ยงไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
    }

    // ตรวจสอบว่ามีสัตว์เลี้ยงตัวนี้อยู่จริงหรือไม่
    const existingPet = await prisma.pet.findUnique({ where: { id } });
    if (!existingPet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยงที่จะแก้ไข" }, { status: 404 });
    }

    // ตรวจสอบความถูกต้องของข้อมูลผ่าน parsePet
    const { errors = {}, data } = parsePet(body);
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors).flat()[0] || "ข้อมูลที่กรอกไม่ถูกต้อง";
      return NextResponse.json({ error: firstError, errors }, { status: 400 });
    }

    // ป้องกันการเปลี่ยนสถานะจาก ADOPTED กลับไปเป็น AVAILABLE โดยไม่ยืนยัน
    const statusError = transitionError(existingPet.status, data.status, body.confirmReopen);
    if (statusError) {
      return NextResponse.json({ error: statusError }, { status: 400 });
    }

    // บันทึกลงฐานข้อมูลเฉพาะฟิลด์ที่มีใน Schema จริงเท่านั้น
    const updatedPet = await prisma.pet.update({
      where: { id },
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

    return NextResponse.json(updatedPet);
  } catch (e) {
    console.error("PUT Pet Error:", e);

    if (e?.code === "P2003") {
      return NextResponse.json({ error: "ไม่พบประเภทสัตว์นี้ในระบบ" }, { status: 400 });
    }

    return NextResponse.json(
      { error: e.message || "ไม่สามารถอัปเดตข้อมูลได้" },
      { status: 500 }
    );
  }
}

// รองรับ PATCH
export async function PATCH(request, context) {
  return PUT(request, context);
}

// ลบข้อมูลสัตว์เลี้ยง (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const resolvedParams = await Promise.resolve(params);
    const id = Number(resolvedParams?.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "ID สัตว์เลี้ยงไม่ถูกต้อง" }, { status: 400 });
    }

    await prisma.pet.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "ลบข้อมูลสำเร็จ" });
  } catch (e) {
    console.error("DELETE Pet Error:", e);
    return NextResponse.json({ error: "ไม่สามารถลบข้อมูลสัตว์เลี้ยงได้" }, { status: 500 });
  }
}