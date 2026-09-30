const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มต้นเพิ่มข้อมูลประเภทสัตว์และสัตว์เลี้ยง...");

  // 1. ล้างข้อมูลเดิมและสร้างประเภทสัตว์ใหม่
  const typesData = ["สุนัข", "แมว", "กระต่าย", "นก", "หนูแฮมสเตอร์"];
  const typeMap = {};

  for (const name of typesData) {
    const type = await prisma.petType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    typeMap[name] = type.id;
  }

  // 2. รายการสัตว์เลี้ยงตัวอย่างครบทุกประเภทและสถานะ (เปลี่ยนเป็น petTypeId เรียบร้อย)
  const samplePets = [
    {
      name: "น้องไข่ตุ๋น",
      petTypeId: typeMap["แมว"],
      breed: "ไทยวิเชียรมาศ",
      ageMonths: 5,
      gender: "FEMALE",
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
      description: "ขี้อ้อนมาก ติดคน ชอบนอนตัก ได้รับวัคซีนเข็มแรกแล้ว ขับถ่ายในกระบะทรายเป็น",
    },
    {
      name: "เจ้าเฉาก๊วย",
      petTypeId: typeMap["สุนัข"],
      breed: "ไทยหลังอานผสม",
      ageMonths: 8,
      gender: "MALE",
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
      description: "ร่าเริง พลังงานเยอะ ชอบวิ่งเล่นและเข้ากับสุนัขตัวอื่นได้ดี ฉีดวัคซีนรวมครบแล้ว",
    },
    {
      name: "น้องส้มหยุด",
      petTypeId: typeMap["แมว"],
      breed: "แมวส้ม",
      ageMonths: 1, // อายุต่ำกว่า 2 เดือน (สำหรับทดสอบป้ายเตือนกฎธุรกิจ)
      gender: "MALE",
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80",
      description: "ลูกแมวตัวน้อย ขี้เล่นมาก ยังต้องดื่มนมเสริมสำหรับลูกสัตว์",
    },
    {
      name: "น้องปุยฝ้าย",
      petTypeId: typeMap["กระต่าย"],
      breed: "ฮอลแลนด์ลอป (Holland Lop)",
      ageMonths: 4,
      gender: "FEMALE",
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80",
      description: "หูตก ขนฟู นิสัยเรียบร้อย ไม่กัดสายไฟ ชอบกินหญ้าทิโมธีสด",
    },
    {
      name: "น้องบลูสกาย",
      petTypeId: typeMap["นก"],
      breed: "นกหงส์หยก",
      ageMonths: 6,
      gender: "MALE",
      status: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80",
      description: "สีฟ้าสดใส ร้องเพลงเก่ง ไม่ตื่นคน คุ้นเคยกับการเกาะนิ้วมือ",
    },
    {
      name: "น้องโมจิ",
      petTypeId: typeMap["หนูแฮมสเตอร์"],
      breed: "วินเทอร์ไวท์",
      ageMonths: 3,
      gender: "FEMALE",
      status: "PENDING",
      imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
      description: "ตัวกลม อุ้มเล่นได้ไม่กัด ชอบวิ่งวงล้อตอนกลางคืน (มีผู้ติดต่อขอดูตัวแล้ว)",
    },
    {
      name: "พี่นำโชค",
      petTypeId: typeMap["สุนัข"],
      breed: "โกลเด้นผสม",
      ageMonths: 14,
      gender: "MALE",
      status: "ADOPTED",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
      description: "นิสัยเรียบร้อยมาก ผ่านการฝึกพื้นฐานแล้ว ปัจจุบันได้บ้านใหม่ที่อบอุ่นเรียบร้อย",
    },
  ];

  // ป้องกันไม่ให้ใส่สัตว์ตัวอย่างบน production และไม่ให้สร้างซ้ำหากมีข้อมูลอยู่แล้ว
  const isProd = process.env.NODE_ENV === "production";
  if ((isProd && process.env.SEED_SAMPLE !== "true") || (await prisma.pet.count()) > 0) {
    console.log("ข้ามการเพิ่มสัตว์ตัวอย่าง");
    return;
  }

  for (const pet of samplePets) {
    await prisma.pet.create({
      data: pet,
    });
  }

  console.log("✅ เพิ่มประเภทสัตว์ 5 ชนิด และสัตว์เลี้ยง 7 ตัว สำเร็จเรียบร้อย!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });