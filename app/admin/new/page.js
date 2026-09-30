"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// ฟังก์ชันช่วยอ่าน JSON อย่างปลอดภัย ป้องกัน Unexpected end of JSON input
async function readJsonSafe(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (e) {
    return {};
  }
}

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

export default function NewPetPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isEn = lang === "en";

  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    petTypeId: "",
    breed: "",
    ageMonths: "",
    gender: "MALE",
    status: "AVAILABLE",
    imageUrl: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const text = {
    backToAdmin: isEn ? "← Back to Admin Dashboard" : "← กลับหน้าจัดการระบบ",
    pageTitle: isEn ? "➕ Add New Pet" : "➕ เพิ่มข้อมูลสัตว์เลี้ยงใหม่",
    pageSubtitle: isEn
      ? "Upload photo and fill in pet details for adoption"
      : "อัปโหลดรูปภาพและกรอกรายละเอียดสัตว์เลี้ยงเพื่อเปิดรับอุปการะ",
    imageLabel: isEn ? "Pet Photo" : "รูปภาพสัตว์เลี้ยง",
    choosePhoto: isEn ? "📁 Select image from computer" : "📁 เลือกรูปภาพจากคอมพิวเตอร์",
    uploading: isEn ? "⏳ Uploading..." : "⏳ กำลังอัปโหลด...",
    removePhoto: isEn ? "Remove photo" : "ลบรูปออก",
    imageHint: isEn
      ? "Supports .jpg, .png, .webp (If omitted, default emoji will be used)"
      : "รองรับไฟล์ .jpg, .png, .webp (หากไม่ใส่รูป ระบบจะใช้อิโมจิเริ่มต้นแทน)",
    nameLabel: isEn ? "Pet Name *" : "ชื่อสัตว์เลี้ยง *",
    namePlaceholder: isEn ? "e.g., Milo, Lucky" : "เช่น ขาวปลอด, มารวย",
    typeLabel: isEn ? "Pet Type *" : "ประเภทสัตว์ *",
    selectType: isEn ? "-- Select pet type --" : "-- เลือกประเภทสัตว์ --",
    breedLabel: isEn ? "Breed" : "สายพันธุ์",
    breedPlaceholder: isEn ? "e.g., Siamese, Golden Retriever" : "เช่น วิเชียรมาศ, โกลเด้น",
    ageLabel: isEn ? "Age (Months) *" : "อายุ (เดือน) *",
    agePlaceholder: isEn ? "e.g., 3" : "เช่น 3",
    genderLabel: isEn ? "Gender" : "เพศ",
    male: isEn ? "Male (MALE)" : "เพศผู้ (Male)",
    female: isEn ? "Female (FEMALE)" : "เพศเมีย (Female)",
    statusLabel: isEn ? "Adoption Status" : "สถานะการรับเลี้ยง",
    statusAvailable: isEn ? "Available (AVAILABLE)" : "พร้อมรับเลี้ยง (AVAILABLE)",
    statusPending: isEn ? "Pending (PENDING)" : "รอพิจารณา (PENDING)",
    statusAdopted: isEn ? "Adopted (ADOPTED)" : "รับเลี้ยงแล้ว (ADOPTED)",
    statusUnavailable: isEn ? "Unavailable (UNAVAILABLE)" : "ปิดรับเลี้ยงชั่วคราว (UNAVAILABLE)",
    descLabel: isEn ? "Bio & Personality" : "ประวัติและอุปนิสัย",
    descPlaceholder: isEn
      ? "e.g., Friendly, loves playing with balls, fully vaccinated..."
      : "เช่น เข้ากับคนง่าย ชอบเล่นลูกบอล ได้รับวัคซีนครบถ้วน...",
    cancelBtn: isEn ? "Cancel" : "ยกเลิก",
    submitBtn: isEn ? "Save Pet Information" : "บันทึกข้อมูลสัตว์เลี้ยง",
    submittingBtn: isEn ? "Saving information..." : "กำลังบันทึกข้อมูล...",
    nameRequired: isEn ? "Please enter pet name" : "กรุณากรอกชื่อสัตว์เลี้ยง",
    typeRequired: isEn ? "Please select pet type" : "กรุณาเลือกประเภทสัตว์เลี้ยง",
    imageOnlyError: isEn
      ? "Please select an image file only (JPG, PNG, WEBP)"
      : "กรุณาเลือกไฟล์ที่เป็นรูปภาพเท่านั้น (JPG, PNG, WEBP)",
    uploadError: isEn ? "Failed to upload image" : "อัปโหลดรูปภาพไม่สำเร็จ",
    serverUploadError: isEn ? "Error sending file to server" : "เกิดข้อผิดพลาดในการส่งไฟล์ไปยังเซิร์ฟเวอร์",
    saveError: isEn ? "Failed to save pet information" : "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
  };

  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch("/api/pet-types");
        if (res.ok) {
          const data = await readJsonSafe(res);
          if (Array.isArray(data)) {
            setTypes(data);
            if (data.length > 0) {
              setForm((prev) => ({ ...prev, petTypeId: String(data[0].id) }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load pet types:", err);
      }
    }
    loadTypes();
  }, []);

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

      return (a.name || "").localeCompare(b.name || "", "th");
    });
  }, [types]);

  // ฟังก์ชันอัปโหลดรูปภาพ
  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(text.imageOnlyError);
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await readJsonSafe(res);
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        setError(data.error || text.uploadError);
      }
    } catch (err) {
      setError(text.serverUploadError);
    } finally {
      setUploading(false);
    }
  }

  // ส่งข้อมูลบันทึกสัตว์เลี้ยง
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(text.nameRequired);
      return;
    }

    if (!form.petTypeId) {
      setError(text.typeRequired);
      return;
    }

    setLoading(true);

    try {
      const resolvedTypeId = parseInt(form.petTypeId, 10);
      const resolvedAge = form.ageMonths !== "" ? parseInt(form.ageMonths, 10) : 0;

      const payload = {
        name: form.name.trim(),
        petTypeId: resolvedTypeId,
        typeId: resolvedTypeId,
        breed: form.breed.trim() || null,
        ageMonths: isNaN(resolvedAge) ? 0 : resolvedAge,
        gender: form.gender,
        status: form.status,
        imageUrl: form.imageUrl.trim() || null,
        description: form.description.trim() || null,
      };

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // อ่านผลลัพธ์ผ่าน readJsonSafe เพื่อป้องกันปัญหา body ว่างเปล่า
      const data = await readJsonSafe(res);

      if (!res.ok) {
        const errMsg =
          data.error ||
          (data.errors && Object.values(data.errors).flat()[0]) ||
          text.saveError;
        throw new Error(errMsg);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message || text.saveError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingBottom: 60 }}>
      {/* ลิงก์ย้อนกลับ (เอาปุ่มสลับภาษาด้านบนออกแล้ว) */}
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#64748b",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
          }}
        >
          {text.backToAdmin}
        </Link>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: 24,
          padding: "36px 32px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
            {text.pageTitle}
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            {text.pageSubtitle}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 12,
              color: "#dc2626",
              fontSize: 13,
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* อัปโหลดรูปภาพ */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              {text.imageLabel}
            </label>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 14,
                  border: "2px dashed #cbd5e1",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: 28, color: "#94a3b8" }}>📷</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="pet-photo-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="pet-photo-upload"
                  style={{
                    display: "inline-block",
                    padding: "9px 16px",
                    background: "#f1f5f9",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    cursor: uploading ? "not-allowed" : "pointer",
                  }}
                >
                  {uploading ? text.uploading : text.choosePhoto}
                </label>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                    style={{
                      marginLeft: 10,
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {text.removePhoto}
                  </button>
                )}
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0 0" }}>
                  {text.imageHint}
                </p>
              </div>
            </div>
          </div>

          {/* ชื่อ และ ประเภท */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.nameLabel}
              </label>
              <input
                type="text"
                required
                placeholder={text.namePlaceholder}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.typeLabel}
              </label>
              <select
                required
                value={form.petTypeId}
                onChange={(e) => setForm({ ...form, petTypeId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  background: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="">{text.selectType}</option>
                {sortedTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {formatPetTypeName(t.name, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* สายพันธุ์ และ อายุ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.breedLabel}
              </label>
              <input
                type="text"
                placeholder={text.breedPlaceholder}
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.ageLabel}
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder={text.agePlaceholder}
                value={form.ageMonths}
                onChange={(e) => setForm({ ...form, ageMonths: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* เพศ และ สถานะ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.genderLabel}
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  background: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="MALE">{text.male}</option>
                <option value="FEMALE">{text.female}</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                {text.statusLabel}
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  background: "#ffffff",
                  outline: "none",
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
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              {text.descLabel}
            </label>
            <textarea
              rows={4}
              placeholder={text.descPlaceholder}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid #cbd5e1",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* ปุ่มบันทึก */}
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <Link
              href="/admin"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "13px",
                borderRadius: 10,
                border: "1.5px solid #cbd5e1",
                fontSize: 14,
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              {text.cancelBtn}
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              style={{
                flex: 2,
                padding: "13px",
                borderRadius: 10,
                background: loading || uploading ? "#86efac" : "#15803d",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                cursor: loading || uploading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? text.submittingBtn : text.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}