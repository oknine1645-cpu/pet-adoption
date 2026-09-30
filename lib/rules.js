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
};

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

  // 1. ตรวจสอบชื่อ
  const name = String(body.name ?? "").trim();
  if (!name) errors.name = "กรุณากรอกชื่อสัตว์ (ห้ามเว้นว่าง)";

  // 2. ตรวจสอบประเภทสัตว์ (แก้ปัญหา petTypeId เป็น NaN หรือ null)
  const rawTypeId = body.petTypeId ?? body.typeId;
  const petTypeId = num(rawTypeId);
  if (!Number.isInteger(petTypeId) || petTypeId <= 0) {
    errors.petTypeId = "กรุณาเลือกประเภทสัตว์";
  }

  // 3. ตรวจสอบสถานะ
  const status = body.status || "AVAILABLE";
  if (!STATUSES.includes(status)) errors.status = "สถานะไม่ถูกต้อง";

  // 4. ตรวจสอบเพศ (แก้ปัญหา gender เป็น null โดยบังคับ MALE/FEMALE)
  const gender = body.gender === "FEMALE" ? "FEMALE" : "MALE";

  // 5. ตรวจสอบอายุ (เดือน)
  const rawAge = body.ageMonths !== undefined && body.ageMonths !== "" ? body.ageMonths : body.age;
  const ageMonths = num(rawAge);
  if (ageMonths == null) {
    errors.ageMonths = "กรุณากรอกอายุ (เดือน)";
  } else if (!Number.isInteger(ageMonths) || ageMonths < 0 || ageMonths > 600) {
    errors.ageMonths = "อายุ (เดือน) ต้องเป็นจำนวนเต็ม 0 ขึ้นไป";
  }

  return {
    errors,
    data: {
      name,
      petTypeId,
      status,
      gender,
      ageMonths,
      breed: str(body.breed),
      description: str(body.description),
      imageUrl: str(body.imageUrl),
    },
  };
}

// ตรวจสอบเงื่อนไขการเปลี่ยนจาก ADOPTED กลับมา AVAILABLE
export function transitionError(from, to, confirmReopen) {
  if (from === "ADOPTED" && to === "AVAILABLE" && !confirmReopen) {
    return "สัตว์ที่รับเลี้ยงแล้ว (ADOPTED) หากต้องการเปลี่ยนกลับเป็นพร้อมรับเลี้ยง (AVAILABLE) ต้องยืนยันพิเศษ";
  }
  return null;
}