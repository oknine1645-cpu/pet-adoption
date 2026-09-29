"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPetPage() {
  const router = useRouter();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    typeId: "",
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

  useEffect(() => {
    async function loadTypes() {
      try {
        const res = await fetch("/api/pet-types");
        if (res.ok) {
          const data = await res.json();
          setTypes(data);
          if (data.length > 0) {
            setForm((prev) => ({ ...prev, typeId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load pet types:", err);
      }
    }
    loadTypes();
  }, []);

  // ฟังก์ชันอัปโหลดไฟล์รูปภาพจากในเครื่อง
  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // จำกัดเฉพาะไฟล์รูปภาพ
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์ที่เป็นรูปภาพเท่านั้น (JPG, PNG, WEBP)");
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

      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        setError(data.error || "อัปโหลดรูปภาพไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งไฟล์ไปยังเซิร์ฟเวอร์");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("กรุณากรอกชื่อสัตว์เลี้ยง");
      return;
    }

    if (!form.typeId) {
      setError("กรุณาเลือกประเภทสัตว์เลี้ยง");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          typeId: Number(form.typeId) || form.typeId,
          breed: form.breed.trim() || null,
          ageMonths: Number(form.ageMonths) || 0,
          gender: form.gender,
          status: form.status,
          imageUrl: form.imageUrl.trim() || null,
          description: form.description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingBottom: 60 }}>
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
          }}
        >
          ← กลับหน้าจัดการระบบ
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
            ➕ เพิ่มข้อมูลสัตว์เลี้ยงใหม่
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            อัปโหลดรูปภาพและกรอกรายละเอียดสัตว์เลี้ยงเพื่อเปิดรับอุปการะ
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
          {/* ช่องเลือกรูปภาพจากในเครื่อง */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              รูปภาพสัตว์เลี้ยง
            </label>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {/* ภาพตัวอย่าง (Preview) */}
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
                  position: "relative",
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

              {/* ปุ่มเลือกไฟล์จากเครื่อง */}
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
                    transition: "all 0.15s",
                  }}
                >
                  {uploading ? "⏳ กำลังอัปโหลด..." : "📁 เลือกรูปภาพจากคอมพิวเตอร์"}
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
                    ลบรูปออก
                  </button>
                )}
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0 0" }}>
                  รองรับไฟล์ .jpg, .png, .webp (หากไม่ใส่รูป ระบบจะใช้อิโมจิเริ่มต้นแทน)
                </p>
              </div>
            </div>
          </div>

          {/* ชื่อ และ ประเภท */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                ชื่อสัตว์เลี้ยง <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ขาวปลอด, มารวย"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                ประเภทสัตว์ <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <select
                value={form.typeId}
                onChange={(e) => setForm({ ...form, typeId: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  background: "#ffffff",
                  outline: "none",
                }}
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* สายพันธุ์ และ อายุ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                สายพันธุ์
              </label>
              <input
                type="text"
                placeholder="เช่น วิเชียรมาศ, โกลเด้น"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                อายุ (เดือน) <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="เช่น 3"
                value={form.ageMonths}
                onChange={(e) => setForm({ ...form, ageMonths: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #cbd5e1",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* เพศ และ สถานะ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                เพศ
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
                }}
              >
                <option value="MALE">เพศผู้ (Male)</option>
                <option value="FEMALE">เพศเมีย (Female)</option>
                <option value="UNKNOWN">ไม่ระบุ</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                สถานะการรับเลี้ยง
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
                }}
              >
                <option value="AVAILABLE">พร้อมรับเลี้ยง (AVAILABLE)</option>
                <option value="PENDING">รอพิจารณา (PENDING)</option>
                <option value="ADOPTED">รับเลี้ยงแล้ว (ADOPTED)</option>
                <option value="UNAVAILABLE">ปิดรับเลี้ยงชั่วคราว (UNAVAILABLE)</option>
              </select>
            </div>
          </div>

          {/* ประวัติและอุปนิสัย */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              ประวัติและอุปนิสัย
            </label>
            <textarea
              rows={4}
              placeholder="เช่น เข้ากับคนง่าย ชอบเล่นลูกบอล ได้รับวัคซีนครบถ้วน..."
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
              }}
            >
              ยกเลิก
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
              {loading ? "กำลังบันทึกข้อมูล..." : "บันทึกข้อมูลสัตว์เลี้ยง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}