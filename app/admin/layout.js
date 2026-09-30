import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

// ป้องกันไม่ให้ Search Engine (เช่น Google) ทำการเก็บดัชนี (Index) หน้าแอดมิน
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }) {
  let session = null;

  try {
    session = await auth();
  } catch (err) {
    console.error("AdminLayout Auth Error:", err);
    redirect("/login");
  }

  // 1. กรณีที่ยังไม่ได้ล็อกอินเลย ให้ส่งไปหน้าล็อกอิน
  if (!session?.user) {
    redirect("/login");
  }

  // 2. ตรวจสอบสิทธิ์ว่ามี role เป็น ADMIN หรือไม่
  if (session.user.role !== "ADMIN") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          padding: "24px 16px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            background: "#ffffff",
            borderRadius: 20,
            padding: "36px 28px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ fontSize: 44, marginBottom: 12 }}>🚫</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
            พื้นที่สำหรับเจ้าหน้าที่เท่านั้น
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            บัญชี <strong>{session.user.email}</strong> ไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาใช้อีเมลของเจ้าหน้าที่ในการเข้าสู่ระบบ
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link
              href="/"
              style={{
                padding: "10px 18px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              กลับหน้าหลัก
            </Link>
            <Link
              href="/login"
              style={{
                padding: "10px 18px",
                backgroundColor: "#f1f5f9",
                border: "1px solid #cbd5e1",
                color: "#334155",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              สลับบัญชี
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. หากเป็น ADMIN ปล่อยให้เข้าใช้งานระบบ Admin ตามปกติ
  return <>{children}</>;
}