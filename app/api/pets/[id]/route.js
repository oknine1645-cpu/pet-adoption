import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdmin } from "@/lib/auth-guard";
import { parsePet, transitionError } from "@/lib/rules";

async function getId(params) {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

const notFound = () => NextResponse.json({ error: "ไม่พบข้อมูลสัตว์เลี้ยง" }, { status: 404 });

export async function GET(request, { params }) {
  try {
    const id = await getId(params);
    if (!id) return notFound();

    const pet = await prisma.pet.findUnique({ where: { id }, include: { petType: true } });
    if (!pet) return notFound();
    if (pet.status !== "AVAILABLE" && !(await isAdmin())) return notFound();
    return NextResponse.json(pet);
  } catch (e) {
    console.error("GET Pet Error:", e);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const id = await getId(params);
    if (!id) return notFound();

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const { errors, data } = parsePet(body, { partial: true });
    if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

    const current = await prisma.pet.findUnique({ where: { id } });
    if (!current) return notFound();

    const tErr = transitionError(current.status, data.status, body.confirmReopen);
    if (tErr) return NextResponse.json({ errors: { status: tErr } }, { status: 400 });

    const pet = await prisma.pet.update({ where: { id }, data });
    return NextResponse.json(pet);
  } catch (e) {
    if (e?.code === "P2025") return notFound();
    if (e?.code === "P2003") {
      return NextResponse.json({ errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } }, { status: 400 });
    }
    console.error("PUT Pet Error:", e);
    return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const id = await getId(params);
    if (!id) return notFound();

    await prisma.pet.delete({ where: { id } });
    return NextResponse.json({ message: "ลบข้อมูลสำเร็จ" });
  } catch (e) {
    if (e?.code === "P2025") return notFound();
    console.error("DELETE Pet Error:", e);
    return NextResponse.json({ error: "ไม่สามารถลบข้อมูลได้" }, { status: 500 });
  }
}