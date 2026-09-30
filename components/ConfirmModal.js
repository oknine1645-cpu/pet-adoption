"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  loading = false,
}) {
  const { t } = useLanguage();

  // 11.4 ดักจับการกดปุ่ม Escape (Esc) เพื่อสั่งปิด Modal
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={(e) => {
        // คลิกพื้นหลังสีดำเพื่อปิด (ถ้าไม่ได้กำลังโหลด)
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      {/* 11.4 เพิ่ม role="dialog" และ aria-modal="true" */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: "28px 24px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }}>⚠️</div>

        <h3
          id="confirm-modal-title"
          style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}
        >
          {title}
        </h3>

        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px 0", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {/* ปุ่มยกเลิก ใช้ t() */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 10,
              border: "1.5px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {t("cancel") || "ยกเลิก"}
          </button>

          {/* ปุ่มยืนยัน ใช้ t() */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 10,
              border: "none",
              backgroundColor: loading ? "#fca5a5" : "#dc2626",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? t("deleting") || "กำลังลบ..." : t("confirm") || "ยืนยันการลบ"}
          </button>
        </div>
      </div>
    </div>
  );
}