"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#0f172a" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
        เกิดข้อผิดพลาดบางอย่าง
      </h2>
      <p style={{ color: "#64748b", marginBottom: 20 }}>
        {error?.message || "ไม่สามารถโหลดข้อมูลหน้านี้ได้"}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#15803d",
          color: "#ffffff",
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>
  );
}