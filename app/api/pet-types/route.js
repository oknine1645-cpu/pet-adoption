import { NextResponse } from "next/server";
import * as PrismaModule from "@/lib/prisma";

// ดึง prisma ได้ทั้งแบบ export default และ export const prisma
const prisma = PrismaModule.default || PrismaModule.prisma;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!prisma || !prisma.petType) {
      console.error("Prisma client or petType model not found");
      return NextResponse.json([]);
    }

    const types = await prisma.petType.findMany();

    const priority = {
      "สุนัข": 1,
      "แมว": 2,
      "Dog": 1,
      "Cat": 2,
    };

    const sortedTypes = [...(types || [])].sort((a, b) => {
      const nameA = String(a?.name || "").trim();
      const nameB = String(b?.name || "").trim();

      const isOtherA = nameA === "อื่นๆ" || nameA === "อื่น ๆ" || nameA.toLowerCase() === "other";
      const isOtherB = nameB === "อื่นๆ" || nameB === "อื่น ๆ" || nameB.toLowerCase() === "other";

      if (isOtherA) return 1;
      if (isOtherB) return -1;

      const pA = priority[nameA] || 99;
      const pB = priority[nameB] || 99;
      if (pA !== pB) return pA - pB;

      return nameA.localeCompare(nameB, "th");
    });

    return NextResponse.json(sortedTypes);
  } catch (error) {
    console.error("Fetch pet types error:", error);
    // ส่ง array เปล่าแทนการส่ง status 500 เพื่อไม่ให้หน้าเว็บล่มทั้งหน้า
    return NextResponse.json([]);
  }
}