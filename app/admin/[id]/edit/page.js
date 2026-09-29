"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPetPage({ params }) {
  const resolvedParams = use(params);
  const petId = resolvedParams.id;
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
    confirmReopen: false,
  });
  const [originalStatus, setOriginalStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initData() {
      try {
        const [typesRes, petRes] = await Promise.all([
          fetch("/api/pet-types"),
          fetch(`/api/pets/${petId}`),
        ]);

        if (typesRes.ok) setTypes(await typesRes.json());
        if (petRes.ok) {
          const pet = await petRes.json();
          setForm({
            name: pet.name || "",
            typeId: pet.typeId || "",
            breed: pet.breed || "",
            ageMonths: pet.ageMonths ?? 0,
            gender: pet.gender || "MALE",
            status: pet.status || "AVAILABLE",
            imageUrl: pet.imageUrl || "",
            description: pet.description || "",
            confirmReopen: false,
          });
          setOriginalStatus(pet.status);
        } else {
          setError("ไม่พบข้อมูลสัตว์เลี้ยงตัวนี้");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [petId]);

  // ฟังก์ชันอัปโหลดรูปภาพจากในเครื่อง
  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setSaving(true);

    try {
      const res = await fetch(`/api/pets/${petId}`, {
        method: "PUT",
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
          confirmReopen: form.confirmReopen,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปเดต");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
        กำลังโหลดข้อมูลสัตว์เลี้ยง...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", paddingBottom: 60 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin"
          style={{ fontSize: 14, fontWeight: 600, color: "#64748b", display: "inline-flex", gap: 6 }}
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
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
            ✏️ แก้ไขข้อมูลสัตว์เลี้ยง
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            ปรับปรุงข้อมูล อัปเดตสถานะ หรือเปลี่ยนรูปภาพของ {form.name}
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
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ช่องอัปโหลดรูปภาพ */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
              รูปภาพสัตว์เลี้ยง
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
                  id="edit-pet-photo-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="edit-pet-photo-upload"
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
                  {uploading ? "⏳ กำลังอัปโหลด..." : "📁 เปลี่ยนรูปภาพจากคอมพิวเตอร์"}
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
              </div>
            </div>
          </div>

          {/* ชื่อ และ ประเภท */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                ชื่อสัตว์เลี้ยง *
              </label>
              <input
                type="text"
                required
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
                ประเภทสัตว์ *
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
                อายุ (เดือน) *
              </label>
              <input
                type="number"
                min="0"
                required
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

          {/* ยืนยันเปิดรับเลี้ยงใหม่อีกครั้ง */}
          {originalStatus === "ADOPTED" && form.status === "AVAILABLE" && (
            <div
              style={{
                padding: "14px 16px",
                background: "#fef3c7",
                borderRadius: 12,
                border: "1px solid #fde68a",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <input
                type="checkbox"
                id="confirmReopen"
                checked={form.confirmReopen}
                onChange={(e) => setForm({ ...form, confirmReopen: e.target.checked })}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              <label htmlFor="confirmReopen" style={{ fontSize: 13, color: "#92400e", fontWeight: 600, cursor: "pointer" }}>
                ยืนยันเปิดรับเลี้ยงอีกครั้ง (สัตว์ตัวนี้เคยมีบ้านแล้ว)
              </label>
            </div>
          )}

          {/* ประวัติและอุปนิสัย */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              ประวัติและอุปนิสัย
            </label>
            <textarea
              rows={4}
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
              disabled={saving || uploading}
              style={{
                flex: 2,
                padding: "13px",
                borderRadius: 10,
                background: saving || uploading ? "#86efac" : "#15803d",
                border: "none",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                cursor: saving || uploading ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}