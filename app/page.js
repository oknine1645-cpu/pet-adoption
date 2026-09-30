"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { isYoung } from "@/lib/rules";

// ฟังก์ชันแปลงอายุตามภาษาที่เลือก
function formatAge(months, lang, t) {
  if (!months && months !== 0) return "-";
  if (months < 12) return `${months} ${t("months")}`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  return remaining === 0
    ? `${years} ${t("years")}`
    : `${years} ${t("years")} ${remaining} ${t("months")}`;
}

export default function HomePage() {
  const { lang, t, formatGender } = useLanguage();
  const [pets, setPets] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ตัวกรองและค้นหา
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  // ระบบ Favorites
  const [favorites, setFavorites] = useState([]);

  // ฟังก์ชันช่วยแสดงชื่อเพศ
  const getGenderText = (gender) => {
    if (formatGender) return formatGender(gender);
    if (gender === "MALE") return t("male") || "ผู้";
    if (gender === "FEMALE") return t("female") || "เมีย";
    return "-";
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [petsRes, typesRes] = await Promise.all([
        fetch("/api/pets?status=AVAILABLE"),
        fetch("/api/pet-types"),
      ]);

      if (!petsRes.ok || !typesRes.ok) {
        setError(true);
        return;
      }

      setPets(await petsRes.json());
      setTypes(await typesRes.json());
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedFavs = localStorage.getItem("pet_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [loadData]);

  function toggleFavorite(id, e) {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("pet_favorites", JSON.stringify(updated));
  }

  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => {
        const matchesSearch =
          pet.name.toLowerCase().includes(search.toLowerCase()) ||
          (pet.breed && pet.breed.toLowerCase().includes(search.toLowerCase())) ||
          (pet.description && pet.description.toLowerCase().includes(search.toLowerCase()));

        const matchesType =
          selectedType === "ALL" ||
          String(pet.petTypeId) === String(selectedType) ||
          String(pet.typeId) === String(selectedType);

        const matchesGender = selectedGender === "ALL" || pet.gender === selectedGender;
        const matchesFav = !showOnlyFavs || favorites.includes(pet.id);

        return matchesSearch && matchesType && matchesGender && matchesFav;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "AGE_ASC") return (a.ageMonths || 0) - (b.ageMonths || 0);
        if (sortBy === "AGE_DESC") return (b.ageMonths || 0) - (a.ageMonths || 0);
        return 0;
      });
  }, [pets, search, selectedType, selectedGender, sortBy, showOnlyFavs, favorites]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a" }}>
      {/* 1. Header Bar */}
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26 }}>🏡</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#15803d", letterSpacing: "-0.5px" }}>
              {t("brandName")}
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/donate"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#b45309",
                backgroundColor: "#fef3c7",
                border: "1px solid #fde68a",
                padding: "8px 14px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {t("navDonate")}
            </Link>

            <Link
              href="/about"
              style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}
            >
              {t("navAbout")}
            </Link>

            <Link
              href="/admin"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#15803d",
                backgroundColor: "#dcfce7",
                padding: "8px 16px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {t("navAdmin")}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
          color: "#ffffff",
          padding: "60px 20px 70px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              backgroundColor: "rgba(255,255,255,0.18)",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              backdropFilter: "blur(4px)",
            }}
          >
            {t("heroBadge")}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, margin: "0 0 16px 0", lineHeight: 1.25 }}>
            {t("heroTitle1")} <br /> {t("heroTitle2")}
          </h1>
          <p style={{ fontSize: 16, color: "#bbf7d0", margin: "0 0 32px 0", lineHeight: 1.6 }}>
            {t("heroSubtitle")}
          </p>

          {/* Search Box */}
          <div
            style={{
              maxWidth: 580,
              margin: "0 auto",
              display: "flex",
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 6,
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "12px 18px",
                fontSize: 15,
                color: "#0f172a",
                borderRadius: 12,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#94a3b8",
                  padding: "0 12px",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Toolbar */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px 80px" }}>
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
          {/* หมวดหมู่ */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setSelectedType("ALL")}
              style={{
                padding: "8px 18px",
                borderRadius: 30,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: selectedType === "ALL" ? "#0f172a" : "#ffffff",
                color: selectedType === "ALL" ? "#ffffff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {t("allCategories")}
            </button>
            {types.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setSelectedType(String(tp.id))}
                style={{
                  padding: "8px 18px",
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: String(selectedType) === String(tp.id) ? "#0f172a" : "#ffffff",
                  color: String(selectedType) === String(tp.id) ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {tp.name}
              </button>
            ))}

            {/* Favorite Filter */}
            <button
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              style={{
                padding: "8px 16px",
                borderRadius: 30,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: showOnlyFavs ? "#fee2e2" : "#ffffff",
                color: showOnlyFavs ? "#dc2626" : "#64748b",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{showOnlyFavs ? "❤️️" : "🤍"}</span>
              <span>{t("favorites")} ({favorites.length})</span>
            </button>
          </div>

          {/* เพศ & จัดเรียง (10.2 formatGender) */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: 12,
                border: "1.5px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">{t("allGenders")}</option>
              <option value="MALE">{getGenderText("MALE")}</option>
              <option value="FEMALE">{getGenderText("FEMALE")}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: 12,
                border: "1.5px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="NEWEST">{t("sortNewest")}</option>
              <option value="AGE_ASC">{t("sortAgeAsc")}</option>
              <option value="AGE_DESC">{t("sortAgeDesc")}</option>
            </select>
          </div>
        </div>

        {/* 4. สถานะการแสดงผล Grid (10.4 โหลดข้อมูลไม่สำเร็จ) */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#94a3b8" }}>
            <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>⏳</span>
            {t("loading")}
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "#ffffff",
              borderRadius: 24,
              border: "1px dashed #fca5a5",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>⚠️</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#dc2626", margin: "0 0 8px 0" }}>
              โหลดข้อมูลไม่สำเร็จ
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              ไม่สามารถเชื่อมต่อหรือดึงข้อมูลสัตว์เลี้ยงได้ กรุณาลองใหม่อีกครั้ง
            </p>
            <button
              onClick={loadData}
              style={{
                padding: "10px 24px",
                backgroundColor: "#15803d",
                color: "#ffffff",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        ) : filteredPets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              backgroundColor: "#ffffff",
              borderRadius: 24,
              border: "1px dashed #cbd5e1",
            }}
          >
            <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🐾</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#334155", margin: "0 0 6px 0" }}>
              {t("notFoundTitle")}
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
              {t("notFoundDesc")}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {filteredPets.map((pet) => {
              const isFav = favorites.includes(pet.id);
              // 10.3 ป้าย "ยังไม่พร้อมแยกจากแม่"
              const isBaby = isYoung(pet.ageMonths);

              return (
                /* 10.5 ตัวการ์ดเป็น div ที่มี position: relative */
                <div
                  key={pet.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";
                  }}
                >
                  {/* Link คลุมทั้งการ์ด (position: absolute, inset: 0, zIndex: 1) */}
                  <Link
                    href={`/pets/${pet.id}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                    }}
                    aria-label={`ดูข้อมูล ${pet.name}`}
                  />

                  {/* รูปภาพ */}
                  <div
                    style={{
                      width: "100%",
                      height: 220,
                      backgroundColor: "#f1f5f9",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {pet.imageUrl ? (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 64 }}>🐾</span>
                    )}

                    {/* ปุ่ม Favorite วางเป็นพี่น้องที่มี z-index สูงกว่า (zIndex: 5) */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(pet.id, e)}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 5,
                      }}
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>

                    {isBaby && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 12,
                          left: 12,
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 12,
                          border: "1px solid #fde68a",
                          zIndex: 2,
                        }}
                      >
                        {t("babyWarning") || "ยังไม่พร้อมแยกจากแม่"}
                      </div>
                    )}
                  </div>

                  {/* รายละเอียด */}
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        {pet.name}
                      </h3>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>
                        {formatAge(pet.ageMonths, lang, t)}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      <span
                        style={{
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {pet.petType?.name || "Pet"}
                      </span>
                      {pet.breed && (
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {pet.breed}
                        </span>
                      )}
                      <span
                        style={{
                          backgroundColor: pet.gender === "MALE" ? "#eff6ff" : "#fdf2f8",
                          color: pet.gender === "MALE" ? "#2563eb" : "#db2777",
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {getGenderText(pet.gender)}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.5,
                        margin: "0 0 18px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      {pet.description || t("defaultDesc")}
                    </p>

                    <div
                      style={{
                        padding: "10px",
                        borderRadius: 10,
                        backgroundColor: "#f0fdf4",
                        color: "#166534",
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {t("viewMore")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          <p style={{ margin: "0 0 6px 0", fontWeight: 700, color: "#1e293b" }}>
            {t("footerTitle")}
          </p>
          <p style={{ margin: 0 }}>
            {t("footerDesc")}
          </p>
        </div>
      </footer>
    </div>
  );
}