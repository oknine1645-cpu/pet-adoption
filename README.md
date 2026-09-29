# บ้านพักใจ — Pet Adoption System

เว็บแอป Full-Stack สำหรับจัดการและแสดงข้อมูลสัตว์เลี้ยงที่รอรับเลี้ยง
**Next.js 15 (App Router) + Prisma + SQLite**

## เริ่มใช้งาน

ต้องมี Node.js 18.18 ขึ้นไป

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run setup             # สร้างฐานข้อมูล SQLite + ใส่ข้อมูลตัวอย่าง
npm run dev               # เปิด http://localhost:3000
```

## หน้าเว็บ

| URL | หน้า |
|---|---|
| `/` | List — ค้นหาชื่อ + กรองประเภท (แสดงเฉพาะ AVAILABLE) |
| `/pets/[id]` | Detail — รายละเอียดสัตว์ + ช่องทางติดต่อศูนย์ |
| `/admin` | จัดการ — ตารางสัตว์ทุกสถานะ, ดู/แก้ไข/ลบ |
| `/admin/new` | Add — ฟอร์มเพิ่มสัตว์ (validation: ห้ามเว้นว่างชื่อ) |
| `/admin/[id]/edit` | Edit — ฟอร์มแก้ไขสัตว์ |
| `/about` | ขั้นตอนการรับเลี้ยง + ที่อยู่/เวลา/ช่องทางติดต่อ |

## REST API

| Method | Path | หมายเหตุ |
|---|---|---|
| GET | `/api/pets?q=&typeId=&status=` | ค่าเริ่มต้น `status=AVAILABLE`, ใช้ `ALL` เพื่อดูทุกสถานะ |
| POST | `/api/pets` | เพิ่มสัตว์ (validate ฝั่งเซิร์ฟเวอร์) |
| GET / PUT / DELETE | `/api/pets/[id]` | ดู / แก้ไข / ลบ |
| GET | `/api/pet-types` | รายการประเภทสัตว์ |

## กฎธุรกิจ (`lib/rules.js`)

- มี 4 สถานะ: `AVAILABLE`, `PENDING`, `ADOPTED`, `UNAVAILABLE`
- รายการสาธารณะแสดงเฉพาะ `AVAILABLE` (ADOPTED/PENDING/UNAVAILABLE ไม่แสดง)
- อายุต่ำกว่า 2 เดือน → ป้าย "ยังไม่พร้อมแยกจากแม่"
- เปลี่ยน `ADOPTED` → `AVAILABLE` ตรง ๆ ไม่ได้ ต้องส่ง `confirmReopen: true`
  (ในฟอร์มคือติ๊กช่อง "ยืนยันเปิดรับเลี้ยงอีกครั้ง") — API ตรวจซ้ำฝั่งเซิร์ฟเวอร์

## ขึ้นออนไลน์ (Vercel + PostgreSQL)

SQLite เป็นไฟล์ในเครื่อง ใช้บน Vercel ไม่ได้ ให้ย้ายเป็น PostgreSQL (เช่น Neon / Supabase):

1. ใน `prisma/schema.prisma` เปลี่ยน `provider = "postgresql"`
2. (ถ้าต้องการ) เปลี่ยน `status`/`gender` เป็น `enum` ตามโจทย์ แล้วปรับ `lib/rules.js` ให้ตรงกัน
3. ตั้ง `DATABASE_URL` เป็น connection string ของ Postgres ใน Vercel
4. รัน `npx prisma db push` และ `npm run db:seed` หนึ่งครั้ง แล้ว deploy

## ที่ยังไม่ได้ทำ

- ระบบล็อกอิน/สิทธิ์เจ้าหน้าที่ (เป็นฟีเจอร์เสริมของโจทย์) — ตอนนี้ `/admin` เปิดให้ทุกคนเข้าได้
- อัปโหลดรูปจริง (ตอนนี้ใช้ลิงก์รูป `imageUrl`, ถ้าไม่มีจะแสดง emoji)
