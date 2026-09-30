"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import FloatingLanguageSwitch from "@/components/FloatingLanguageSwitch";

function LoginForm() {
  const { lang, t } = useLanguage();
  const isTh = lang === "th";
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  // ข้อความ 2 ภาษา
  const text = {
    title: t("loginTitle") || (isTh ? "เข้าสู่ระบบ" : "Sign In"),
    subtitle: isTh ? "ระบบจัดการบ้านพักใจ" : "Baan Pak Jai Management System",
    emailLabel: isTh ? "อีเมล" : "Email",
    passwordLabel: isTh ? "รหัสผ่าน" : "Password",
    submitBtn: isTh ? "เข้าสู่ระบบ" : "Sign In",
    submitting: isTh ? "กำลังเข้าสู่ระบบ..." : "Signing in...",
    or: isTh ? "หรือ" : "or",
    googleLogin: isTh ? "เข้าสู่ระบบด้วย Google" : "Continue with Google",
    backHome: isTh ? "← กลับสู่หน้าหลัก" : "← Back to Home",
    invalidCredentials: isTh ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : "Invalid email or password",
    accessDenied: isTh ? "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล" : "Access Denied: Admin privileges required",
    generalError: isTh ? "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง" : "Sign-in failed. Please try again.",
    googleError: isTh ? "ไม่สามารถเข้าสู่ระบบด้วย Google ได้" : "Unable to sign in with Google",
  };

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(
    urlError === "CredentialsSignin"
      ? text.invalidCredentials
      : urlError === "AccessDenied"
      ? text.accessDenied
      : urlError
      ? text.generalError
      : ""
  );
  const [loading, setLoading] = useState(false);

  // เข้าสู่ระบบด้วย Email / Password
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (!res || res.error || res.ok === false) {
        setError(text.invalidCredentials);
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Login Error:", err);
      setError(text.generalError);
      setLoading(false);
    }
  }

  // เข้าสู่ระบบด้วย Google
  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(text.googleError);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        backgroundColor: "#f8fafc",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* ลิงก์กลับหน้าแรก */}
        <div style={{ textAlign: "left", marginBottom: 16 }}>
          <Link
            href="/"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {text.backHome}
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
            {text.title}
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            {text.subtitle}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 14px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              color: "#dc2626",
              fontSize: 13,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              {text.emailLabel}
            </label>
            <input
              type="email"
              required
              disabled={loading}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
              {text.passwordLabel}
            </label>
            <input
              type="password"
              required
              disabled={loading}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: "13px",
              background: loading ? "#86efac" : "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? text.submitting : text.submitBtn}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "22px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}></div>
          <span style={{ padding: "0 10px", fontSize: 12, color: "#94a3b8" }}>{text.or}</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }}></div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "11px 14px",
            background: "#ffffff",
            border: "1.5px solid #cbd5e1",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "#334155",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {text.googleLogin}
        </button>
      </div>

      {/* ปุ่มสลับภาษา TH / EN ลอยที่มุมขวาล่าง */}
      <FloatingLanguageSwitch />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}