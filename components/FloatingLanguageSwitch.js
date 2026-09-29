"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function FloatingLanguageSwitch() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label="สลับภาษา / Switch Language"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 50,
        backgroundColor: "#0f172a", // โทนเข้มตัดกับพื้นหลังทุกหน้า
        color: "#ffffff",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08) translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 30px -4px rgba(0, 0, 0, 0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.2)";
      }}
    >
      <span style={{ fontSize: 16 }}>🌐</span>
      <span
        style={{
          color: lang === "th" ? "#4ade80" : "#94a3b8",
          fontWeight: lang === "th" ? 800 : 500,
        }}
      >
        TH
      </span>
      <span style={{ color: "#475569" }}>|</span>
      <span
        style={{
          color: lang === "en" ? "#4ade80" : "#94a3b8",
          fontWeight: lang === "en" ? 800 : 500,
        }}
      >
        EN
      </span>
    </button>
  );
}