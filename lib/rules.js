// กฎธุรกิจและ validation ใช้ร่วมกันทั้งฝั่ง API และฟอร์ม
export const STATUSES = ["AVAILABLE", "PENDING", "ADOPTED", "UNAVAILABLE"];

export const STATUS_LABEL = {
  AVAILABLE: "พร้อมรับเลี้ยง",
  PENDING: "รอดำเนินการ",
  ADOPTED: "รับเลี้ยงแล้ว",
  UNAVAILABLE: "ไม่พร้อมชั่วคราว",
};

export const GENDER_LABEL = {
  MALE: "ผู้",
  FEMALE: "เมีย",
  UNKNOWN: "ไม่ระบุ", // เพิ่ม UNKNOWN เพื่อรองรับตัวเลือกในหน้าฟอร์ม
};

// อายุต่ำกว่า 2 เดือน → ยังไม่พร้อมแยกจากแม่
export const isYoung = (age) => age != null && age < 2;

export const ageText = (m) =>
  m == null
    ? "-"
    : m < 12
    ? `${m} เดือน`
    : `${Math.floor(m / 12)} ปี${m % 12 ? ` ${m % 12} เดือน` : ""}`;

const num = (v) => (v === "" || v == null ? null : Number(v));
const str = (v) => {
  const s = String(v ?? "").trim();
  return s || null;
};

export function parsePet(body = {}) {
  const errors = {};

  // 1. ตรวจสอบชื่อสัตว์เลี้ยง
  const name = String(body.name ?? "").trim();
  if (!name) errors.name = "กรุณากรอกชื่อสัตว์ (ห้ามเว้นว่าง)";

  // 2. รองรับทั้ง petTypeId และ typeId จากหน้าบ้าน
  const rawTypeId = body.petTypeId ?? body.typeId;
  const petTypeId = num(rawTypeId);
  if (!Number.isInteger(petTypeId)) errors.petTypeId = "กรุณาเลือกประเภทสัตว์";

  // 3. ตรวจสอบสถานะ
  const status = body.status || "AVAILABLE";
  if (!STATUSES.includes(status)) errors.status = "สถานะไม่ถูกต้อง";

  // 4. ตรวจสอบเพศ (รองรับ MALE, FEMALE, UNKNOWN)
  const gender = body.gender || "MALE";
  if (gender && !GENDER_LABEL[gender]) errors.gender = "เพศไม่ถูกต้อง";

  // 5. ตรวจสอบอายุ แปลงเข้าฟิลด์ ageMonths สำหรับ Prisma
  const rawAge = body.ageMonths !== undefined && body.ageMonths !== "" ? body.ageMonths : body.age;
  const ageMonths = num(rawAge);
  if (ageMonths == null) {
    errors.ageMonths = "กรุณากรอกอายุ (เดือน)";
  } else if (!Number.isInteger(ageMonths) || ageMonths < 0 || ageMonths > 600) {
    errors.ageMonths = "อายุ (เดือน) ต้องเป็นจำนวนเต็ม 0 ขึ้นไป";
  }

  // 6. น้ำหนักและวันที่
  const weightKg = num(body.weightKg);
  if (weightKg != null && (Number.isNaN(weightKg) || weightKg < 0)) {
    errors.weightKg = "น้ำหนักไม่ถูกต้อง";
  }

  const arrivedDate = body.arrivedDate ? new Date(body.arrivedDate) : null;
  if (arrivedDate && Number.isNaN(arrivedDate.getTime())) {
    errors.arrivedDate = "วันที่ไม่ถูกต้อง";
  }

  return {
    errors,
    data: {
      name,
      petTypeId,
      status,
      gender,
      ageMonths, // ส่งเฉพาะ ageMonths ไม่ส่ง age เพื่อป้องกัน Prisma Error
      weightKg,
      breed: str(body.breed),
      description: str(body.description),
      healthNote: str(body.healthNote),
      imageUrl: str(body.imageUrl),
      arrivedDate,
    },
  };
}

// ห้ามเปลี่ยน ADOPTED กลับเป็น AVAILABLE ตรง ๆ ต้องยืนยันพิเศษ (confirmReopen)
export function transitionError(from, to, confirmReopen) {
  if (from === "ADOPTED" && to === "AVAILABLE" && !confirmReopen) {
    return "สัตว์ที่ ADOPTED แล้วเปลี่ยนกลับเป็น AVAILABLE โดยตรงไม่ได้ ต้องยืนยันพิเศษ";
  }
  return null;
}