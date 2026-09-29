import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "AVAILABLE";
    const typeId = searchParams.get("typeId");
    const q = searchParams.get("q") || "";

    const where = {};

    if (status !== "ALL") {
      where.status = status;
    }

    if (typeId) {
      where.petTypeId = Number(typeId);
    }

    if (q) {
      where.name = { contains: q };
    }

    const pets = await prisma.pet.findMany({
      where,
      include: { petType: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET Pets Error:", error);
    return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลสัตว์ได้" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, typeId, petTypeId, breed, ageMonths, gender, status, imageUrl, description } = body;

    const targetTypeId = Number(typeId || petTypeId);

    if (!name || !targetTypeId) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่อและประเภทของสัตว์เลี้ยง" },
        { status: 400 }
      );
    }

    const newPet = await prisma.pet.create({
      data: {
        name: name.trim(),
        petTypeId: targetTypeId,
        breed: breed ? breed.trim() : null,
        ageMonths: Number(ageMonths) || 0,
        gender: gender || "MALE",
        status: status || "AVAILABLE",
        imageUrl: imageUrl || null,
        description: description ? description.trim() : null,
      },
    });

    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error("POST Pet Error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกข้อมูลสัตว์เลี้ยงได้: " + error.message },
      { status: 500 }
    );
  }
}