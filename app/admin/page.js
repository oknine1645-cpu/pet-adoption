"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

// ฟังก์ชันช่วยอ่าน JSON อย่างปลอดภัย ป้องกัน Unexpected end of JSON input
async function readJsonSafe(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return null;
  }
}

export default function AdminPage() {
  const { lang, t, formatGender, formatStatus, formatAge } = useLanguage();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function showToast(message, type = "success") {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  }

  // ดึงข้อมูลสัตว์เลี้ยงทั้งหมด
  async function fetchPets() {
    try {
      const res = await fetch("/api/pets?status=ALL");
      if (res.ok) {
        const data = await readJsonSafe(res);
        setPets(Array.isArray(data) ? data : []);
      } else {
        const errData = await readJsonSafe(res);
        console.error("fetchPets error response:", errData);
      }
    } catch (err) {
      console.error("fetchPets connection error:", err);
      showToast(lang === "th" ? "โหลดข้อมูลไม่สำเร็จ" : "Load error", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPets();
  }, []);

  // ยืนยันการลบข้อมูลสัตว์เลี้ยง
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/pets/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPets((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast(
          lang === "th"
            ? `ลบข้อมูล "${deleteTarget.name}" สำเร็จ`
            : `Deleted "${deleteTarget.name}" successfully`
        );
      } else {
        const errData = await readJsonSafe(res);
        showToast(
          errData?.error || (lang === "th" ? "ลบข้อมูลไม่สำเร็จ" : "Delete failed"),
          "error"
        );
      }
    } catch (err) {
      console.error("Delete connection error:", err);
      showToast(
        lang === "th" ? "เกิดข้อผิดพลาดในการเชื่อมต่อ" : "Connection error",
        "error"
      );
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const stats = {
    total: pets.length,
    available: pets.filter((p) => p.status === "AVAILABLE").length,
    pending: pets.filter((p) => p.status === "PENDING").length,
    adopted: pets.filter((p) => p.status === "ADOPTED").length,
  };

  const filteredPets =
    activeTab === "ALL" ? pets : pets.filter((p) => p.status === activeTab);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 80px" }}>
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 10000,
            padding: "12px 20px",
            borderRadius: 12,
            backgroundColor: toast.type === "success" ? "#15803d" : "#dc2626",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
            {t("adminTitle")}
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            {t("adminSubtitle")}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/"
            style={{
              padding: "10px 16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #cbd5e1",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
              textDecoration: "none",
            }}
          >
            🏠 {t("brandName")}
          </Link>
          <Link
            href="/admin/new"
            style={{
              padding: "10px 18px",
              backgroundColor: "#16a34a",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            {t("addNewPet")}
          </Link>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
            }}
            style={{
              padding: "10px 14px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #fecaca",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            {t("logout")}
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: 16, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{t("statTotal")}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginTop: 4 }}>
            {stats.total} {t("unitTail")}
          </div>
        </div>
        <div style={{ backgroundColor: "#f0fdf4", padding: "20px", borderRadius: 16, border: "1px solid #bbf7d0" }}>
          <div style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{t("statAvailable")}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#15803d", marginTop: 4 }}>
            {stats.available} {t("unitTail")}
          </div>
        </div>
        <div style={{ backgroundColor: "#fefce8", padding: "20px", borderRadius: 16, border: "1px solid #fef08a" }}>
          <div style={{ fontSize: 13, color: "#854d0e", fontWeight: 600 }}>{t("statPending")}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ca8a04", marginTop: 4 }}>
            {stats.pending} {t("unitTail")}
          </div>
        </div>
        <div style={{ backgroundColor: "#eef2ff", padding: "20px", borderRadius: 16, border: "1px solid #c7d2fe" }}>
          <div style={{ fontSize: 13, color: "#3730a3", fontWeight: 600 }}>{t("statAdopted")}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#4f46e5", marginTop: 4 }}>
            {stats.adopted} {t("unitTail")}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { key: "ALL", label: `${t("allCategories")} (${stats.total})` },
          { key: "AVAILABLE", label: `${t("statAvailable")} (${stats.available})` },
          { key: "PENDING", label: `${t("statPending")} (${stats.pending})` },
          { key: "ADOPTED", label: `${t("statAdopted")} (${stats.adopted})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              backgroundColor: activeTab === tab.key ? "#0f172a" : "#f1f5f9",
              color: activeTab === tab.key ? "#ffffff" : "#475569",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            {t("loading")}
          </div>
        ) : filteredPets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>📭</span>
            {t("emptyAdmin")}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#475569" }}>
                  <th style={{ padding: "14px 20px" }}>{t("colPet")}</th>
                  <th style={{ padding: "14px 16px" }}>{t("colBreed")}</th>
                  <th style={{ padding: "14px 16px" }}>{t("colAge")}</th>
                  <th style={{ padding: "14px 16px" }}>{t("colStatus")}</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>{t("colManage")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet) => {
                  const badge = formatStatus(pet.status);
                  return (
                    <tr key={pet.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              backgroundColor: "#f1f5f9",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {pet.imageUrl ? (
                              <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <span style={{ fontSize: 20 }}>🐾</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{pet.name}</div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>
                              {formatGender(pet.gender)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: "14px 16px", color: "#334155" }}>
                        <div>{pet.petType?.name || "-"}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>{pet.breed || "-"}</div>
                      </td>

                      <td style={{ padding: "14px 16px", color: "#334155" }}>
                        {formatAge(pet.ageMonths)}
                      </td>

                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 14,
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <Link
                            href={`/pets/${pet.id}`}
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#334155",
                              textDecoration: "none",
                            }}
                          >
                            {t("view")}
                          </Link>
                          <Link
                            href={`/admin/${pet.id}/edit`}
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#15803d",
                              textDecoration: "none",
                            }}
                          >
                            {t("edit")}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(pet)}
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#fef2f2",
                              border: "1px solid #fecaca",
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#dc2626",
                              cursor: "pointer",
                            }}
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={lang === "th" ? "ต้องการลบข้อมูลสัตว์เลี้ยง?" : "Delete Pet Record?"}
        message={
          lang === "th"
            ? `คุณกำลังจะลบข้อมูลของ "${deleteTarget?.name}" การกระทำนี้ไม่สามารถย้อนกลับได้`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}