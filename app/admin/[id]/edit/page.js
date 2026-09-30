"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// ฟังก์ชันแปลงชื่อประเภทสัตว์ 2 ภาษา
function formatPetTypeName(name, lang) {
  if (!name) return "-";
  if (lang !== "en") return name;
  const dict = {
    "สุนัข": "Dogs",
    "แมว": "Cats",
    "กระต่าย": "Rabbits",
    "นก": "Birds",
    "หนูแฮมสเตอร์": "Hamsters",
    "อื่นๆ": "Others",
    "อื่น ๆ": "Others",
  };
  return dict[name.trim()] || name;
}

export default function EditPetPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    petTypeId: "",
    breed: "",
    ageMonths: "",
    gender: "MALE",
    status: "AVAILABLE",
    description: "",
    imageUrl: "",
  });

  // พจนานุกรมข้อความ 2 ภาษาสำหรับหน้าแก้ไข
  const text = {
    backToAdmin: isEn ? "← Back to Admin Dashboard" : "← กลับหน้าจัดการระบบ",
    pageTitle: isEn ? "✏️ Edit Pet Information" : "✏️ แก้ไขข้อมูลสัตว์เลี้ยง",
    pageSubtitle: (name) =>
      isEn
        ? `Update details, status, or change photo for ${name || "pet"}`
        : `ปรับปรุงข้อมูล อัปเดตสถานะ หรือเปลี่ยนรูปภาพของ ${name || "สัตว์เลี้ยง"}`,
    imageLabel: isEn ? "Pet Photo" : "รูปภาพสัตว์เลี้ยง",
    changePhoto: isEn ? "📁 Change image from computer" : "📁 เปลี่ยนรูปภาพจากคอมพิวเตอร์",
    uploading: isEn ? "Uploading image..." : "กำลังอัปโหลดรูป...",
    removePhoto: isEn ? "Remove photo" : "ลบรูปออก",
    nameLabel: isEn ? "Pet Name *" : "ชื่อสัตว์เลี้ยง *",
    typeLabel: isEn ? "Pet Type *" : "ประเภทสัตว์ *",
    selectType: isEn ? "-- Select pet type --" : "-- เลือกประเภทสัตว์ --",
    breedLabel: isEn ? "Breed" : "สายพันธุ์",
    ageLabel: isEn ? "Age (Months) *" : "อายุ (เดือน) *",
    genderLabel: isEn ? "Gender" : "เพศ",
    male: isEn ? "Male (MALE)" : "เพศผู้ (Male)",
    female: isEn ? "Female (FEMALE)" : "เพศเมีย (Female)",
    statusLabel: isEn ? "Adoption Status" : "สถานะการรับเลี้ยง",
    statusAvailable: isEn ? "Available (AVAILABLE)" : "พร้อมรับเลี้ยง (AVAILABLE)",
    statusPending: isEn ? "Pending (PENDING)" : "รอพิจารณา (PENDING)",
    statusAdopted: isEn ? "Adopted (ADOPTED)" : "รับเลี้ยงแล้ว (ADOPTED)",
    statusUnavailable: isEn ? "Unavailable (UNAVAILABLE)" : "ปิดรับเลี้ยงชั่วคราว (UNAVAILABLE)",
    descLabel: isEn ? "Bio & Personality" : "ประวัติและอุปนิสัย",
    cancelBtn: isEn ? "Cancel" : "ยกเลิก",
    saveBtn: isEn ? "Save Changes" : "บันทึกการแก้ไข",
    savingBtn: isEn ? "Saving changes..." : "กำลังบันทึก...",
    loadError: isEn ? "Failed to load pet data" : "โหลดข้อมูลสัตว์เลี้ยงไม่สำเร็จ",
    saveError: isEn ? "Failed to save changes" : "บันทึกข้อมูลไม่สำเร็จ กรุณากรอกข้อมูลให้ครบถ้วน",
  };

  // ดึงข้อมูลประเภทสัตว์ และ ข้อมูลสัตว์เลี้ยงตัวนี้
  useEffect(() => {
    async function initData() {
      try {
        const [typesRes, petRes] = await Promise.all([
          fetch("/api/pet-types"),
          fetch(`/api/pets/${params.id}`),
        ]);

        if (!typesRes.ok || !petRes.ok) {
          setError(text.loadError);
          setLoading(false);
          return;
        }

        const typesData = await typesRes.json();
        const petData = await petRes.json();

        setTypes(typesData);
        setForm({
          name: petData.name || "",
          petTypeId: String(petData.petTypeId || petData.typeId || ""),
          breed: petData.breed || "",
          ageMonths: petData.ageMonths ?? "",
          gender: petData.gender || "MALE",
          status: petData.status || "AVAILABLE",
          description: petData.description || "",
          imageUrl: petData.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
        setError(text.loadError);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, [params.id]);

  // จัดลำดับประเภทสัตว์: สุนัข -> แมว -> อื่นๆ ท้ายสุด
  const sortedTypes = useMemo(() => {
    return [...types].sort((a, b) => {
      const isOtherA = a.name === "อื่นๆ" || a.name?.toLowerCase() === "other";
      const isOtherB = b.name === "อื่นๆ" || b.name?.toLowerCase() === "other";
      if (isOtherA) return 1;
      if (isOtherB) return -1;

      const priority = { "สุนัข": 1, "แมว": 2, Dog: 1, Cat: 2 };
      const pA = priority[a.name] || 99;
      const pB = priority[b.name] || 99;
      if (pA !== pB) return pA - pB;

      return a.name.localeCompare(b.name, "th");
    });
  }, [types]);

  // อัปโหลดรูปภาพเข้า Cloudinary ผ่าน /api/upload
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (err) {
      console.error(err);
      setError(isEn ? "Failed to upload image" : "อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploadingImage(false);
    }
  }

  // ส่งข้อมูลที่แก้ไข
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...form,
        petTypeId: Number(form.petTypeId),
        ageMonths: Number(form.ageMonths),
      };

      const res = await fetch(`/api/pets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || text.saveError);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || text.saveError);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
        <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>⏳</span>
        {isEn ? "Loading pet data..." : "กำลังโหลดข้อมูล..."}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
      {/* ลิงก์ย้อนกลับ */}
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 600,
            color: "#475569",
            textDecoration: "none",
          }}
        >
          {text.backToAdmin}
        </Link>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 24,
          padding: "36px 32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
          {text.pageTitle}
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 28px 0" }}>
          {text.pageSubtitle(form.name)}
        </p>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              color: "#dc2626",
              fontSize: 13,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* รูปภาพสัตว์เลี้ยง */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
              {text.imageLabel}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 16,
                  backgroundColor: "#f1f5f9",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e2e8f0",
                }}
              >
                {form.imageUrl ? (
                  <img src={form.imageUrl} alt="Pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 32 }}>🐾</span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#f8fafc",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    cursor: uploadingImage ? "not-allowed" : "pointer",
                  }}
                >
                  {uploadingImage ? text.uploading : text.changePhoto}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                </label>

                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#dc2626",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {text.removePhoto}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ชื่อสัตว์เลี้ยง & ประเภทสัตว์ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.nameLabel}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.typeLabel}
              </label>
              <select
                required
                value={form.petTypeId}
                onChange={(e) => setForm({ ...form, petTypeId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="">{text.selectType}</option>
                {sortedTypes.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {formatPetTypeName(tp.name, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* สายพันธุ์ & อายุ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.breedLabel}
              </label>
              <input
                type="text"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.ageLabel}
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.ageMonths}
                onChange={(e) => setForm({ ...form, ageMonths: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* เพศ & สถานะการรับเลี้ยง */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.genderLabel}
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="MALE">{text.male}</option>
                <option value="FEMALE">{text.female}</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                {text.statusLabel}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="AVAILABLE">{text.statusAvailable}</option>
                <option value="PENDING">{text.statusPending}</option>
                <option value="ADOPTED">{text.statusAdopted}</option>
                <option value="UNAVAILABLE">{text.statusUnavailable}</option>
              </select>
            </div>
          </div>

          {/* ประวัติและอุปนิสัย */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
              {text.descLabel}
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #cbd5e1",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* ปุ่มบันทึกและยกเลิก */}
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              style={{
                flex: 1,
                padding: "13px",
                backgroundColor: "#ffffff",
                border: "1.5px solid #cbd5e1",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "#475569",
                cursor: "pointer",
              }}
            >
              {text.cancelBtn}
            </button>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              style={{
                flex: 2,
                padding: "13px",
                backgroundColor: submitting ? "#86efac" : "#15803d",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? text.savingBtn : text.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}