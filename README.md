# Pet Adoption System (ระบบจัดการและรับเลี้ยงสัตว์เลี้ยง)

โครงงานพัฒนาเว็บแอปพลิเคชันแบบ Full-Stack เพื่อจัดการข้อมูลสัตว์เลี้ยงและสนับสนุนกระบวนการรับเลี้ยงสัตว์

---

## 👥 รายชื่อสมาชิกในกลุ่ม

| ลำดับ | รหัสนักศึกษา | ชื่อ - นามสกุล | บทบาทหน้าที่ |
| :---: | :---: | :--- | :--- |
| 1 | 67118729 | วรมันต์ ชูช่วย | **Frontend / UI:** ออกแบบและพัฒนา Angular Components, จัดการ Layout และ Responsive Design ด้วย HTML Inline Styles |
| 2 | 67108027 | สิทธิชัย ชูแก้ว | **Frontend / Integration:** พัฒนา Angular Service, กำหนด Angular Routing, เชื่อมต่อ REST API และจัดการ State |
| 3 | 67105601 | พรรษกร นวนดำ | **Backend:** พัฒนา NestJS Controller, Service, DTO, ValidationPipe และ Business Rules |
| 4 | 67120782 | วิทย์ธวัช คงเทพ | **Database / Integration:** ออกแบบ Database Schema, Prisma ORM, Migration, Seed Data และเชื่อมต่อ PostgreSQL |

---

## 🎯 วัตถุประสงค์ของโครงงาน
1. เพื่อประยุกต์ใช้ความรู้ด้านการพัฒนาเว็บแบบ Full-Stack เชื่อมโยงการทำงานตั้งแต่ Frontend -> Backend -> Database
2. เพื่อพัฒนาระบบศูนย์กลางในการจัดการข้อมูลสัตว์เลี้ยง (เพิ่ม, ค้นหา, ดูรายละเอียด, แก้ไข, ลบข้อมูล)
3. เพื่อสนับสนุนกระบวนการรับเลี้ยงสัตว์เลี้ยงอย่างเป็นระบบ โดยมี Business Rules ควบคุมสถานะความพร้อมในการรับเลี้ยง
4. เพื่อรองรับการใช้งานที่สะดวกและตอบสนองต่อขนาดหน้าจอทั้งบนคอมพิวเตอร์และโทรศัพท์มือถือ (Responsive Web Design)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)
* **Frontend:** Angular, TypeScript, Reactive Forms, HTML Inline Styles (CSS)
* **Backend:** NestJS (Node.js Framework), TypeScript, Class-Validator, Class-Transformer
* **Database & ORM:** PostgreSQL, Prisma ORM (v6.19.0)
* **Architecture:** RESTful API Architecture

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Structure)
ระบบใช้ฐานข้อมูล PostgreSQL และสร้างโมเดลความสัมพันธ์แบบ **One-to-Many (1:N)** ผ่าน Prisma ORM:

* **PetType (ประเภทสัตว์เลี้ยง):** เก็บหมวดหมู่ เช่น สุนัข, แมว, กระต่าย
  * `id` (Int, Primary Key, Auto Increment)
  * `name` (String, Unique)
  * `pets` (Relation: One-to-Many ไปยัง Pet)

* **Pet (สัตว์เลี้ยง):** เก็บข้อมูลรายละเอียดของสัตว์เลี้ยงแต่ละตัว
  * `id` (Int, Primary Key, Auto Increment)
  * `name` (String, Required)
  * `petTypeId` (Int, Foreign Key ชี้ไปที่ PetType)
  * `gender` (String: `MALE`, `FEMALE`, `UNKNOWN`)
  * `ageMonths` (Int, อายุเป็นจำนวนเต็มเดือน 0 - 600)
  * `weightKg` (Float, น้ำหนัก)
  * `breed` (String, สายพันธุ์)
  * `status` (String: `AVAILABLE`, `PENDING`, `ADOPTED`, `UNAVAILABLE`)
  * `healthNote` (String, ข้อมูลสุขภาพ/วัคซีน)
  * `description` (String, ข้อมูลนิสัย/ประวัติ)
  * `imageUrl` (String, URL รูปภาพ)
  * `arrivedDate` (DateTime, วันที่รับเข้ามา)

---

## 📋 กฎทางธุรกิจของระบบ (Business Rules)
1. **การกรองสถานะสัตว์เลี้ยง:** สัตว์เลี้ยงที่มีสถานะ **ADOPTED** (รับเลี้ยงแล้ว) จะต้องไม่ปรากฏในหน้ารายการพร้อมรับเลี้ยงสำหรับผู้ใช้ทั่วไป (`AVAILABLE`)
2. **การป้องกันการเปลี่ยนสถานะซ้ำซ้อน (Confirm Reopen):** หากสัตว์เลี้ยงมีสถานะเป็น `ADOPTED` อยู่ก่อนแล้ว และผู้ดูแลระบบต้องการเปลี่ยนสถานะกลับเป็น `AVAILABLE` จะต้องมีการยืนยัน (`confirmReopen = true`) มิฉะนั้น Backend จะไม่อนุญาตให้แก้ไข
3. **การตรวจสอบความถูกต้องของข้อมูล (Validation):**
   * ชื่อสัตว์เลี้ยงห้ามว่างและห้ามเป็นช่องว่างล้วน (Trim Whitespace ทั้งฝั่ง Frontend และ Backend)
   * อายุต้องเป็นจำนวนเต็มบวก (0 - 600 เดือน) ไม่รองรับค่าทศนิยม
   * ประเภทสัตว์เลี้ยง (`petTypeId`) ต้องมีอยู่จริงในฐานข้อมูล หากไม่พบจะตอบกลับ 400 Bad Request

---

## 🌐 รายการ REST API Endpoints (Backend)

| Method | Endpoint | คำอธิบาย | พารามิเตอร์ / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pets` | ดึงรายการสัตว์เลี้ยงทั้งหมด | Query: `search`, `typeId`, `status` (`AVAILABLE`, `ALL`, ฯลฯ) |
| `GET` | `/api/pets/:id` | ดึงรายละเอียดสัตว์เลี้ยงตาม ID | Path: `id` |
| `POST` | `/api/pets` | เพิ่มข้อมูลสัตว์เลี้ยงใหม่ | Body: `CreatePetDto` (JSON) |
| `PATCH` | `/api/pets/:id` | แก้ไขข้อมูลสัตว์เลี้ยง | Path: `id`, Body: `UpdatePetDto` (JSON) |
| `DELETE` | `/api/pets/:id` | ลบข้อมูลสัตว์เลี้ยงตาม ID | Path: `id` |
| `GET` | `/api/pet-types` | ดึงรายการประเภทสัตว์เลี้ยงทั้งหมด | สำหรับแสดงผลใน Dropdown |

---

## 🚀 ขั้นตอนการติดตั้งและการรันระบบ (Setup & Installation)

### 1. การติดตั้งและรันฝั่ง Backend

1.1 เข้าสู่โฟลเดอร์ Backend และติดตั้ง Dependencies:
```bash
cd backend
npm install