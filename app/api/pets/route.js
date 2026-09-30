export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const { errors = {}, data } = parsePet(body);
    if (Object.keys(errors).length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // whitelist เฉพาะ field ที่มีใน schema
    const petData = {
      name: data.name,
      petTypeId: data.petTypeId,
      status: data.status,
      gender: data.gender,
      ageMonths: data.ageMonths,
      weightKg: data.weightKg,
      breed: data.breed,
      description: data.description,
      healthNote: data.healthNote,
      imageUrl: data.imageUrl,
      arrivedDate: data.arrivedDate,
    };

    const pet = await prisma.pet.create({
      data: petData,
      include: { petType: true },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (e) {
    if (e?.code === "P2003") {
      return NextResponse.json({ errors: { petTypeId: "ไม่พบประเภทสัตว์นี้" } }, { status: 400 });
    }
    console.error("POST Pet Error:", e);
    return NextResponse.json({ error: "ไม่สามารถบันทึกข้อมูลได้" }, { status: 500 });
  }
}