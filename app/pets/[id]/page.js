"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { isYoung } from "@/lib/rules";
import { siteConfig } from "@/lib/siteConfig";

export default function PetDetailPage() {
  const params = useParams();
  const petId = Number(params?.id);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

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
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    // 10.6 ตรวจสอบก่อน fetch เพื่อแก้ปัญหา /pets/abc ค้างที่กำลังโหลด
    if (!Number.isInteger(petId) || petId <= 0) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    async function loadPet() {
      setLoading(true);
      setNotFound(false);
      setServerError(false);
      try {
        const res = await fetch(`/api/pets/${petId}`);
        if (res.status === 404) {
          setNotFound(true);
        } else if (!res.ok) {
          setServerError(true);
        } else {
          const data = await res.json();
          setPet(data);
        }
      } catch (err) {
        console.error("Load pet error:", err);
        setServerError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPet();
  }, [petId]);

  // 1. สถานะกำลังโหลด
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
        <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>⏳</span>
        {t("loading") || "กำลังโหลดข้อมูล..."}
      </div>
    );
  }

  // 2. สถานะ 404 ไม่พบข้อมูลสัตว์เลี้ยง
  if (notFound) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🐾</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
          ไม่พบข้อมูลสัตว์เลี้ยงตัวนี้
        </h2>
        <p style={{ color: "#64748b", marginBottom: 20 }}>
          รหัสสัตว์เลี้ยงไม่ถูกต้อง หรือสัตว์เลี้ยงตัวนี้อาจถูกนำออกจากระบบแล้ว
        </p>
        <Link href="/" style={{ color: "#15803d", fontWeight: 700, textDecoration: "none" }}>
          ← กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  // 3. สถานะข้อผิดพลาดของเซิร์ฟเวอร์ (Server Error 500 / Network Error)
  if (serverError || !pet) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>⚠️</span>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>
          เกิดข้อผิดพลาดของเซิร์ฟเวอร์
        </h2>
        <p style={{ color: "#64748b", marginBottom: 20 }}>
          ไม่สามารถเชื่อมต่อหรือดึงข้อมูลสัตว์เลี้ยงได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "none",
              backgroundColor: "#15803d",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ลองใหม่อีกครั้ง
          </button>
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            กลับหน้าหลัก
          </Link>
        </div>
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

  // 10.3 ตรวจสอบอายุลูกสัตว์
  const isBaby = isYoung(pet.ageMonths);

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

            {/* 10.3 แสดงป้ายเมื่ออายุน้อยกว่า 2 เดือน */}
            {isBaby && (
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

          {/* 10.8 ช่องทางติดต่อรับเลี้ยง (ดึงจาก siteConfig) */}
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
              <div>📞 <strong>โทร:</strong> {siteConfig?.contact?.tel || "02-123-4567"}</div>
              <div>💬 <strong>Line:</strong> {siteConfig?.contact?.line || "@baanpakjai"} &nbsp;|&nbsp; 🌐 <strong>Facebook:</strong> {siteConfig?.contact?.facebook || "บ้านพักใจ"}</div>
              <div>📍 <strong>ที่อยู่:</strong> {siteConfig?.contact?.address || "123 ถนนสุขใจ แขวงบางรัก กรุงเทพฯ 10500"}</div>
            </div>
          </div>

          {/* 10.7 แสดงปุ่มแก้ไขเฉพาะเมื่อเป็น ADMIN */}
          {isAdmin && (
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
          )}
        </div>
      </div>
    </div>
  );
}