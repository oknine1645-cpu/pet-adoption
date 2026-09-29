// กฎธุรกิจและ validation ใช้ร่วมกันทั้งฝั่ง API และฟอร์ม
export const STATUSES = ['AVAILABLE', 'PENDING', 'ADOPTED', 'UNAVAILABLE'];
export const STATUS_LABEL = {
  AVAILABLE: 'พร้อมรับเลี้ยง',
  PENDING: 'รอดำเนินการ',
  ADOPTED: 'รับเลี้ยงแล้ว',
  UNAVAILABLE: 'ไม่พร้อมชั่วคราว',
};
export const GENDER_LABEL = { MALE: 'ผู้', FEMALE: 'เมีย' };

// อายุต่ำกว่า 2 เดือน → ยังไม่พร้อมแยกจากแม่
export const isYoung = (age) => age != null && age < 2;

export const ageText = (m) =>
  m == null ? '-' : m < 12 ? `${m} เดือน` : `${Math.floor(m / 12)} ปี${m % 12 ? ` ${m % 12} เดือน` : ''}`;

const num = (v) => (v === '' || v == null ? null : Number(v));
const str = (v) => {
  const s = String(v ?? '').trim();
  return s || null;
};

export function parsePet(body) {
  const errors = {};
  const name = String(body.name ?? '').trim();
  if (!name) errors.name = 'กรุณากรอกชื่อสัตว์ (ห้ามเว้นว่าง)';

  const petTypeId = num(body.petTypeId);
  if (!Number.isInteger(petTypeId)) errors.petTypeId = 'กรุณาเลือกประเภทสัตว์';

  const status = body.status || 'AVAILABLE';
  if (!STATUSES.includes(status)) errors.status = 'สถานะไม่ถูกต้อง';

  const gender = body.gender || null;
  if (gender && !GENDER_LABEL[gender]) errors.gender = 'เพศไม่ถูกต้อง';

  const age = num(body.age);
  if (age != null && (!Number.isInteger(age) || age < 0)) errors.age = 'อายุ (เดือน) ต้องเป็นจำนวนเต็ม 0 ขึ้นไป';

  const weightKg = num(body.weightKg);
  if (weightKg != null && (Number.isNaN(weightKg) || weightKg < 0)) errors.weightKg = 'น้ำหนักไม่ถูกต้อง';

  const arrivedDate = body.arrivedDate ? new Date(body.arrivedDate) : null;
  if (arrivedDate && Number.isNaN(arrivedDate.getTime())) errors.arrivedDate = 'วันที่ไม่ถูกต้อง';

  return {
    errors,
    data: {
      name, petTypeId, status, gender, age, weightKg,
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
  if (from === 'ADOPTED' && to === 'AVAILABLE' && !confirmReopen) {
    return 'สัตว์ที่ ADOPTED แล้วเปลี่ยนกลับเป็น AVAILABLE โดยตรงไม่ได้ ต้องยืนยันพิเศษ';
  }
  return null;
}
