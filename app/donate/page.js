"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function DonatePage() {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState(300);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({
    donorName: "",
    phone: "",
    slipUrl: "",
    note: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankAccount = "123-4-56789-0";

  function handleCopyAccount() {
    navigator.clipboard.writeText(bankAccount.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSlipUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, slipUrl: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.slipUrl) {
      alert(t("slipLabel"));
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  }

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a" }}>
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
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>🏡</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#15803d" }}>{t("brandName")}</span>
          </Link>
          <Link
            href="/"
            style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}
          >
            {t("backToHome")}
          </Link>
        </div>
      </header>

      <section
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
          color: "#ffffff",
          padding: "50px 20px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <span
            style={{
              padding: "4px 14px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {t("donateBadge")}
          </span>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 900, margin: "14px 0 10px 0" }}>
            {t("donateHeroTitle")}
          </h1>
          <p style={{ fontSize: 15, color: "#bbf7d0", margin: 0, lineHeight: 1.6 }}>
            {t("donateHeroDesc")}
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 1000, margin: "-30px auto 80px", padding: "0 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {/* ช่องทางบริจาค */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 20,
              padding: "32px 24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#0f172a" }}>
              {t("paymentChannels")}
            </h2>

            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: 16,
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: "#166534", fontWeight: 700, marginBottom: 4 }}>
                {t("bankName")}
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#15803d", letterSpacing: 1 }}>
                {bankAccount}
              </div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>
                {t("accountName")}
              </div>

              <button
                type="button"
                onClick={handleCopyAccount}
                style={{
                  marginTop: 14,
                  padding: "8px 16px",
                  borderRadius: 10,
                  backgroundColor: copied ? "#15803d" : "#ffffff",
                  color: copied ? "#ffffff" : "#166534",
                  border: "1px solid #86efac",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {copied ? t("copiedAccount") : t("copyAccount")}
              </button>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#334155", margin: "0 0 10px 0" }}>
                {t("itemsTitle")}
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                <li>{t("item1")}</li>
                <li>{t("item2")}</li>
                <li>{t("item3")}</li>
                <li>{t("item4")}</li>
              </ul>
            </div>
          </div>

          {/* แบบฟอร์มแจ้งโอน */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 20,
              padding: "32px 24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            }}
          >
            {success ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <span style={{ fontSize: 52 }}>🎉</span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#15803d", margin: "14px 0 8px 0" }}>
                  {t("donateSuccessTitle")}
                </h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px 0" }}>
                  {t("donateSuccessDesc")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setForm({ donorName: "", phone: "", slipUrl: "", note: "" });
                    setCustomAmount("");
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    backgroundColor: "#f1f5f9",
                    color: "#334155",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t("donateMoreBtn")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#0f172a" }}>
                  {t("donationFormTitle")}
                </h2>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                    {t("amountLabel")}
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
                    {[100, 300, 500, 1000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        style={{
                          padding: "8px 0",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          border: selectedAmount === amt && !customAmount ? "2px solid #16a34a" : "1.5px solid #cbd5e1",
                          backgroundColor: selectedAmount === amt && !customAmount ? "#f0fdf4" : "#ffffff",
                          color: selectedAmount === amt && !customAmount ? "#15803d" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        {amt}฿
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder={t("customAmountPlaceholder")}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
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
                    {t("donorNameLabel")} <span style={{ color: "#94a3b8", fontWeight: 400 }}>{t("donorNameAnon")}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.donorName}
                    onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
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
                    {t("phoneLabel")}
                  </label>
                  <input
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
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
                    {t("slipLabel")} <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="file"
                      id="slip-upload"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="slip-upload"
                      style={{
                        padding: "9px 14px",
                        backgroundColor: "#f1f5f9",
                        border: "1.5px solid #cbd5e1",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                    >
                      {uploading ? "⏳..." : t("chooseSlip")}
                    </label>
                    {form.slipUrl && (
                      <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
                        {t("slipUploaded")}
                      </span>
                    )}
                  </div>
                  {form.slipUrl && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={form.slipUrl}
                        alt="Slip"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10, border: "1px solid #cbd5e1" }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    {t("noteLabel")}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t("notePlaceholder")}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #cbd5e1",
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  style={{
                    marginTop: 6,
                    padding: "13px",
                    backgroundColor: submitting ? "#86efac" : "#16a34a",
                    color: "#ffffff",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? t("saving") : `${t("confirmDonateBtn")} ${finalAmount || 0} ${t("currency")}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}