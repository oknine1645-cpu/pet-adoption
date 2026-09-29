"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function PetDetailPage() {
  const params = useParams();
  const petId = Number(params?.id);

  // ดึงระบบภาษา พร้อมใส่ค่าสำรองป้องกันหน้าแครช
  const langCtx = useLanguage() || {};
  const lang = langCtx.lang || "th";
  const t = langCtx.t || ((key) => key);
  const formatGender =
    langCtx.formatGender ||
    ((g) => (g === "MALE" ? "เพศผู้" : g === "FEMALE" ? "เพศเมีย" : "-"));
  const formatStatus =
    langCtx.formatStatus ||
    ((s) => ({ label: s, bg: "#f1f5f9", color: "#475569" }));
  const formatAge =
    langCtx.formatAge || ((m) => (m ? `${m} เดือน` : "-"));

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!petId) return;

    async function loadPet() {
      try {
        const res = await fetch(`/api/pets/${petId}`);
        if (res.ok) {
          setPet(await res.json());
        }
      } catch (err) {
        console.error("Load pet error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPet();
  }, [petId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
        {t("loading") || "กำลังโหลดข้อมูล..."}
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2>ไม่พบข้อมูลสัตว์เลี้ยงตัวนี้</h2>
        <Link href="/" style={{ color: "#15803d", fontWeight: 700, textDecoration: "none" }}>
          ← กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  const statusBadge = formatStatus(pet.status);
  const formattedDate = pet.createdAt
    ? new Date(pet.createdAt).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "32px 16px 80px" }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#64748b",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {t("backToPets") || "← กลับหน้ารายการสัตว์เลี้ยง"}
        </Link>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        {/* รูปภาพสัตว์เลี้ยง */}
        <div
          style={{
            width: "100%",
            height: 380,
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 96 }}>🐾</span>
          )}

          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "6px 14px",
              borderRadius: 20,
              background: statusBadge.bg,
              color: statusBadge.color,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {statusBadge.label}
          </div>
        </div>

        {/* ข้อมูลรายละเอียด */}
        <div style={{ padding: "36px 32px" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 8px 0" }}>
            {t("arrivedAt") || "เข้ามาที่ศูนย์เมื่อ:"}{" "}
            <strong style={{ color: "#475569" }}>{formattedDate}</strong>
          </p>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 12px 0" }}>
            {pet.name}
          </h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <span
              style={{
                padding: "6px 12px",
                background: "#f1f5f9",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              🏷️ {pet.petType?.name || (lang === "th" ? "สัตว์เลี้ยง" : "Pet")}
            </span>

            {pet.breed && (
              <span
                style={{
                  padding: "6px 12px",
                  background: "#f1f5f9",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                🧬 {pet.breed}
              </span>
            )}

            <span
              style={{
                padding: "6px 12px",
                background: "#f1f5f9",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              ⚧ {formatGender(pet.gender)}
            </span>
          </div>

          <div
            style={{
              padding: "16px 20px",
              background: "#f8fafc",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 24 }}>🎂</span>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{t("ageLabel") || "อายุ"}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                {formatAge(pet.ageMonths)}
              </div>
            </div>

            {pet.ageMonths < 2 && (
              <span
                style={{
                  marginLeft: "auto",
                  padding: "4px 10px",
                  background: "#fef3c7",
                  border: "1px solid #fde68a",
                  color: "#92400e",
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 8,
                }}
              >
                {t("babyWarning") || "⚠️ ยังไม่พร้อมแยกจากแม่"}
              </span>
            )}
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
              {t("petStory") || "เรื่องของ"} {pet.name}
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#334155",
                background: "#fafafa",
                padding: "18px 20px",
                borderRadius: 12,
                whiteSpace: "pre-line",
              }}
            >
              {pet.description || t("noPetStory") || "ยังไม่มีข้อมูลประวัติของสัตว์เลี้ยงตัวนี้"}
            </p>
          </div>

          {/* ช่องทางติดต่อรับเลี้ยง */}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 16,
              padding: "24px 24px",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#166534", margin: "0 0 8px 0" }}>
              {t("contactTitle") || "สนใจรับเลี้ยง? ติดต่อศูนย์ได้เลย"}
            </h3>
            <p style={{ fontSize: 14, color: "#15803d", margin: "0 0 14px 0" }}>
              {t("contactSubtitle") || "เว็บนี้แสดงข้อมูลสัตว์เลี้ยงเท่านั้น ขั้นตอนรับเลี้ยงดำเนินการที่ศูนย์โดยตรง"}
            </p>
            <div style={{ fontSize: 14, color: "#166534", lineHeight: 1.8 }}>
              <div>📞 <strong>{t("contactTel") || "โทร:"}</strong> 02-123-4567</div>
              <div>💬 <strong>{t("contactLine") || "Line:"}</strong> @baanpakjai &nbsp;|&nbsp; 🌐 <strong>{t("contactFb") || "Facebook: บ้านพักใจ"}</strong></div>
              <div>📍 <strong>{t("contactAddr") || "ที่อยู่: 123 ถนนสุขใจ แขวงบางรัก กรุงเทพฯ 10500"}</strong></div>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Link
              href={`/admin/${pet.id}/edit`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#0284c7",
                textDecoration: "none",
              }}
            >
              {t("editStaffLink") || "✏️ แก้ไขข้อมูลสัตว์เลี้ยงตัวนี้ (สำหรับเจ้าหน้าที่)"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}