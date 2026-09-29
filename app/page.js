"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { lang, t, formatGender, formatStatus, formatAge } = useLanguage();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await fetch("/api/pets?status=AVAILABLE");
        if (res.ok) {
          const data = await res.json();
          setPets(data);
        }
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  // กรองตามประเภทสัตว์เลี้ยง
  const filteredPets =
    filterType === "ALL"
      ? pets
      : pets.filter((p) => p.petType?.name === filterType);

  // ดึงรายการประเภทสัตว์เลี้ยงที่ไม่ซ้ำกัน
  const petTypes = ["ALL", ...new Set(pets.map((p) => p.petType?.name).filter(Boolean))];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Top Navbar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>🐾</span>
            <span>{t?.("brandName") || "บ้านพักใจ"}</span>
          </Link>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link
              href="/admin"
              style={{
                padding: "8px 16px",
                backgroundColor: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⚙️</span>
              <span>{t?.("adminTitle") || "จัดการระบบ"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
          padding: "50px 20px",
          textAlign: "center",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 12px 0",
              letterSpacing: "-0.5px",
            }}
          >
            หาบ้านใหม่ให้น้องสัตว์เลี้ยง
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.6, margin: 0 }}>
            ร่วมเป็นส่วนหนึ่งในการมอบความรักและบ้านที่อบอุ่นให้กับเพื่อนสี่ขาที่กำลังรอคอยความเมตตา
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 80px" }}>
        {/* Category Filters */}
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
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>
              สัตว์เลี้ยงพร้อมรับเลี้ยง ({filteredPets.length})
            </h2>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {petTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  backgroundColor: filterType === type ? "#0f172a" : "#ffffff",
                  color: filterType === type ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
              >
                {type === "ALL" ? "ทั้งหมด" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Cards Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
            {t?.("loading") || "กำลังโหลดข้อมูลสัตว์เลี้ยง..."}
          </div>
        ) : filteredPets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "70px 20px",
              backgroundColor: "#ffffff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 10 }}>🐶🐱</div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
              ขณะนี้ยังไม่มีสัตว์เลี้ยงที่ตรงตามเงื่อนไข
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 24,
            }}
          >
            {filteredPets.map((pet) => {
              const badge = formatStatus?.(pet.status) || {
                label: "พร้อมรับเลี้ยง",
                bg: "#dcfce7",
                color: "#15803d",
              };

              return (
                <div
                  key={pet.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 6px -1px rgba(0,0,0,0.06)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      height: 200,
                      backgroundColor: "#f1f5f9",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {pet.imageUrl ? (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 48,
                        }}
                      >
                        🐾
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "4px 10px",
                        borderRadius: 12,
                        backgroundColor: badge.bg,
                        color: badge.color,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        {pet.name}
                      </h3>
                      <span style={{ fontSize: 13, color: "#64748b" }}>
                        {formatGender?.(pet.gender) || pet.gender}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
                      <span>{pet.petType?.name || "-"}</span>
                      {pet.breed && <span> • {pet.breed}</span>}
                      {pet.ageMonths !== undefined && (
                        <span> • {formatAge?.(pet.ageMonths) || `${pet.ageMonths} เดือน`}</span>
                      )}
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <Link
                        href={`/pets/${pet.id}`}
                        style={{
                          display: "block",
                          textAlign: "center",
                          padding: "10px",
                          backgroundColor: "#16a34a",
                          color: "#ffffff",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}