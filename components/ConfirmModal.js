"use client";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose, loading }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: "28px 24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          animation: "scaleIn 0.15s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              marginBottom: 14,
            }}
          >
            🗑️
          </div>
          <h3 style={{ margin: "0 0 6px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
            {title || "ยืนยันการทำรายการ"}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 10,
              border: "1.5px solid #cbd5e1",
              backgroundColor: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 10,
              border: "none",
              backgroundColor: loading ? "#f87171" : "#dc2626",
              fontSize: 14,
              fontWeight: 700,
              color: "#ffffff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "กำลังลบ..." : "ยืนยันการลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}