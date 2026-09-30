export async function PUT(req, { params }) {
  // แทรกตรวจสิทธิ์
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขข้อมูล" }, { status: 401 });
  }

  // โค้ดเดิมของคุณสำหรับอัปเดตข้อมูล...
}

export async function DELETE(req, { params }) {
  // แทรกตรวจสิทธิ์
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.email === process.env.ADMIN_EMAIL;
  if (!isAdmin) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์ลบข้อมูล" }, { status: 401 });
  }

  // โค้ดเดิมของคุณสำหรับลบข้อมูล...
}