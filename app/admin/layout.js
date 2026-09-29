import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  let session = null;

  try {
    session = await auth();
  } catch (err) {
    // หากมีปัญหาเรื่องการอ่านคุกกี้ ให้ส่งไปหน้าล็อกอินทันที ไม่แสดงหน้าจอ Error
    redirect("/login");
  }

  // หากไม่ได้ล็อกอิน หรือสิทธิ์ไม่ใช่ ADMIN ให้ส่งไปหน้าแรก
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <>{children}</>;
}