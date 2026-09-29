import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const petId = Number(id);

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { petType: true },
    });

    if (!pet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยง" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("GET Pet By ID Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const petId = Number(id);
    const body = await request.json();

    const {
      name,
      typeId,
      petTypeId,
      breed,
      ageMonths,
      gender,
      status,
      imageUrl,
      description,
      confirmReopen,
    } = body;

    const currentPet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!currentPet) {
      return NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยง" }, { status: 404 });
    }

    if (
      currentPet.status === "ADOPTED" &&
      status === "AVAILABLE" &&
      !confirmReopen
    ) {
      return NextResponse.json(
        { error: "หากต้องการเปลี่ยนสถานะจากรับเลี้ยงแล้วเป็นพร้อมรับเลี้ยง กรุณายืนยันการเปิดรับเลี้ยงอีกครั้ง" },
        { status: 400 }
      );
    }

    const targetTypeId = typeId || petTypeId ? Number(typeId || petTypeId) : undefined;

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        petTypeId: targetTypeId,
        breed: breed !== undefined ? (breed ? breed.trim() : null) : undefined,
        ageMonths: ageMonths !== undefined ? Number(ageMonths) : undefined,
        gender: gender || undefined,
        status: status || undefined,
        imageUrl: imageUrl !== undefined ? (imageUrl ? imageUrl.trim() : null) : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
      },
    });

    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("PUT Pet Error:", error);
    return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้: " + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const petId = Number(id);

    await prisma.pet.delete({
      where: { id: petId },
    });

    return NextResponse.json({ message: "ลบข้อมูลสัตว์เลี้ยงสำเร็จ" });
  } catch (error) {
    console.error("DELETE Pet Error:", error);
    return NextResponse.json({ error: "ไม่สามารถลบข้อมูลสัตว์เลี้ยงได้" }, { status: 500 });
  }
}