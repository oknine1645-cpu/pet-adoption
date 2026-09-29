import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ตั้งค่าการเชื่อมต่อ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    // แปลงไฟล์เป็น Buffer เพื่อเตรียมส่งขึ้น Cloud
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // อัปโหลดไฟล์ตรงเข้า Cloudinary ไปไว้ในโฟลเดอร์ pet-adoption
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pet-adoption",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // ส่ง URL รูปภาพบน Cloudinary กลับไปบันทึกลงฐานข้อมูล
    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "อัปโหลดรูปภาพไปยังคลาวด์ไม่สำเร็จ: " + error.message },
      { status: 500 }
    );
  }
}