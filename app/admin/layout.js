import { auth } from "@/auth";

export default async function AdminLayout({ children }) {
  // อ่าน session ตามปกติ แต่ไม่สั่ง redirect บล็อกการเข้าใช้งาน
  let session = null;
  try {
    session = await auth();
  } catch (err) {
    console.error("AdminLayout Session Error:", err);
  }

  return <>{children}</>;
}