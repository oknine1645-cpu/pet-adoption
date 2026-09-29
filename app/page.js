import { redirect } from "next/navigation";

// บังคับให้เซิร์ฟเวอร์ประมวลผลคำสั่ง redirect ทุกครั้งที่มีคนเข้า
export const dynamic = "force-dynamic";

export default function Home() {
  redirect("/login");
}