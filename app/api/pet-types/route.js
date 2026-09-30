import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ป้องกัน Next.js แคชผลลัพธ์เดิม
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const types = await prisma.petType.findMany();

    // จัดลำดับ: สุนัข -> แมว -> สัตว์อื่นเรียง ก-ฮ -> อื่นๆ ล่างสุด
    const priority = {
      "สุนัข": 1,
      "แมว": 2,
      "Dog": 1,
      "Cat": 2,
    };

    const sortedTypes = [...types].sort((a, b) => {
      const nameA = a.name ? a.name.trim() : "";
      const nameB = b.name ? b.name.trim() : "";

      const isOtherA = nameA === "อื่นๆ" || nameA === "อื่น ๆ" || nameA.toLowerCase() === "other";
      const isOtherB = nameB === "อื่นๆ" || nameB === "อื่น ๆ" || nameB.toLowerCase() === "other";

      // ดัน "อื่นๆ" ไปไว้ท้ายสุดเสมอ
      if (isOtherA) return 1;
      if (isOtherB) return -1;

      // จัด สุนัข และ แมว ขึ้นก่อน
      const pA = priority[nameA] || 99;
      const pB = priority[nameB] || 99;
      if (pA !== pB) return pA - pB;

      // ที่เหลือเรียงตาม ก-ฮ
      return nameA.localeCompare(nameB, "th");
    });

    return NextResponse.json(sortedTypes);
  } catch (error) {
    console.error("Fetch pet types error:", error);
    return NextResponse.json({ error: "Failed to fetch pet types" }, { status: 500 });
  }
}