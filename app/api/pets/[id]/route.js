import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { parsePet, transitionError } from "@/lib/rules";

// ฟังก์ชันแปลง id ให้รองรับทั้งแบบตัวเลขและ CUID
function parseId(rawId) {
  return isNaN(Number(rawId)) ? rawId : Number(rawId);
}

// 1. ดูข้อมูลสัตว์เลี้ยงรายตัว (คนทั่วไปดูได้)
export async function GET(request, { params }) {
  try {
    const { id } = await Promise.resolve(params);
    const petId = parseId(id);

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { petType: true },
    });

    if (!pet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยง" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}

// 2. แก้ไขข้อมูลสัตว์เลี้ยง / เปลี่ยนสถานะ (เฉพาะแอดมิน)
export async function PUT(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์แอดมิน
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await Promise.resolve(params);
    const petId = parseId(id);

    const existingPet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!existingPet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยงในระบบ" }, { status: 404 });
    }

    const body = await request.json();

    // ตรวจสอบกฎการเปลี่ยนสถานะ (เช่น ออกจากสถานะ ADOPTED ต้องยืนยัน)
    if (body.status && body.status !== existingPet.status) {
      const err = transitionError(existingPet.status, body.status, body.confirmReopen);
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }

    // ตรวจข้อมูลที่ส่งมาแก้ไข (partial: true ยอมให้อัปเดตเฉพาะบางฟิลด์ได้)
    const { errors, data } = parsePet(body, { partial: true });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง", details: errors }, { status: 400 });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data,
      include: { petType: true },
    });

    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("PUT Pet Error:", error);
    return NextResponse.json({ error: "อัปเดตข้อมูลล้มเหลว: " + error.message }, { status: 500 });
  }
}

// 3. ลบสัตว์เลี้ยง (เฉพาะแอดมิน)
export async function DELETE(request, { params }) {
  try {
    // ตรวจสอบสิทธิ์แอดมิน
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await Promise.resolve(params);
    const petId = parseId(id);

    await prisma.pet.delete({
      where: { id: petId },
    });

    return NextResponse.json({ success: true, message: "ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("DELETE Pet Error:", error);
    return NextResponse.json({ error: "ลบข้อมูลล้มเหลว: " + error.message }, { status: 500 });
  }
}