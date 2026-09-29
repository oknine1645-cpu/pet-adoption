import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้มีผู้ใช้งานในระบบแล้ว" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // กำหนดสิทธิ์: ถ้าตรงกับ ADMIN_EMAIL ให้เป็น ADMIN นอกนั้นเป็น USER
    const adminEmail = process.env.ADMIN_EMAIL;
    const assignedRole = email === adminEmail ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name: name || "",
        email,
        password: hashedPassword,
        role: assignedRole,
      },
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดจากฐานข้อมูล: " + error.message },
      { status: 500 }
    );
  }
}