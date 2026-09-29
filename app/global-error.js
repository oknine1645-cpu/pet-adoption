"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ fontFamily: "sans-serif", padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "#dc2626" }}>🚨 เกิดข้อผิดพลาดที่ Root Layout</h2>
        <div
          style={{
            maxWidth: "600px",
            margin: "20px auto",
            padding: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            textAlign: "left",
            fontSize: "14px",
            color: "#991b1b",
            wordBreak: "break-word",
          }}
        >
          <strong>สาเหตุ:</strong> {error?.message || "ไม่สามารถระบุข้อผิดพลาดได้"}
        </div>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ลองใหม่อีกครั้ง
        </button>
      </body>
    </html>
  );
}