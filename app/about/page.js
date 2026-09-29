"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { lang, t } = useLanguage();

  const content = {
    th: {
      badge: "🏡 เกี่ยวกับศูนย์พักพิงสัตว์บ้านพักใจ",
      heroTitle: "สะพานเชื่อมความรัก เพื่อชีวิตใหม่ของสัตว์ไร้บ้าน",
      heroDesc:
        "เราเป็นศูนย์พักพิงที่ไม่แสวงหาผลกำไร มุ่งมั่นช่วยเหลือ รักษา ฟื้นฟูสภาพจิตใจ และหาบ้านที่อบอุ่นถาวรให้กับสุนัขและแมวจรจัด",
      
      // ส่วนพันธกิจ 3 ข้อ
      missionTitle: "ภารกิจและเป้าหมายของเรา",
      mission1Title: "การช่วยเหลือและรักษา",
      mission1Desc: "รับดูแลสัตว์ที่ถูกทอดทิ้ง บาดเจ็บ หรือไร้ที่พึ่ง พร้อมตรวจสุขภาพ ฉีดวัคซีน และทำหมันก่อนส่งมอบ",
      mission2Title: "การฟื้นฟูจิตใจและพฤติกรรม",
      mission2Desc: "ดูแลด้วยความรักในสภาพแวดล้อมที่สะอาด ปลอดภัย เพื่อให้น้องๆ กลับมาไว้ใจมนุษย์อีกครั้ง",
      mission3Title: "คัดกรองบ้านที่พร้อมดูแลจริง",
      mission3Desc: "สนับสนุนการรับเลี้ยงแทนการซื้อสัตว์ และคัดกรองความพร้อมเพื่อให้สัตว์ทุกตัวได้บ้านที่อบอุ่นตลอดอายุขัย",

      // 4 ขั้นตอนการรับเลี้ยง
      stepsTitle: "🐾 4 ขั้นตอนง่ายๆ ในการรับอุปการะ",
      step1Num: "1",
      step1Title: "เลือกดูสัตว์เลี้ยง",
      step1Desc: "เลือกดูรูปภาพ ประวัติ อายุ และอุปนิสัยของน้องๆ บนหน้าเว็บไซต์",
      step2Num: "2",
      step2Title: "ติดต่อและนัดหมาย",
      step2Desc: "โทรหรือทักแชตศูนย์เพื่อนัดหมายเวลาเข้ามาทำความคุ้นเคยกับน้องตัวจริง",
      step3Num: "3",
      step3Title: "พูดคุยประเมินความพร้อม",
      step3Desc: "เจ้าหน้าที่จะพูดคุยเกี่ยวกับสถานที่เลี้ยง ประสบการณ์ และความพร้อมของสมาชิกในครอบครัว",
      step4Num: "4",
      step4Title: "พาน้องกลับบ้าน",
      step4Desc: "เซ็นเอกสารรับอุปการะและรับน้องกลับบ้าน โดยไม่มีค่าใช้จ่ายในการรับเลี้ยง",

      // ข้อมูลติดต่อและเวลาทำการ
      visitTitle: "📍 เยี่ยมชมศูนย์และติดต่อเรา",
      hoursLabel: "วันและเวลาเปิดทำการ:",
      hoursVal: "เปิดทุกวันจันทร์ - อาทิตย์ เวลา 09:00 - 17:00 น.",
      locationLabel: "ที่ตั้งศูนย์:",
      locationVal: "123 ถนนสุขใจ แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500",
      contactLabel: "ช่องทางการติดต่อ:",
      contactPhone: "โทร: 02-123-4567",
      contactLine: "Line Official: @baanpakjai",
      contactFb: "Facebook: บ้านพักใจ เพื่อสัตว์ไร้บ้าน",

      // Call to action
      ctaTitle: "พร้อมเปิดประตูบ้านต้อนรับสมาชิกใหม่แล้วหรือยัง?",
      ctaBtn: "🐶 ดูรายการสัตว์เลี้ยงที่พร้อมรับเลี้ยง →",
    },

    en: {
      badge: "🏡 About Baan Pak Jai Animal Shelter",
      heroTitle: "A Bridge of Love and Hope for Rescued Pets",
      heroDesc:
        "We are a non-profit animal shelter dedicated to rescuing, rehabilitating, and rehoming stray and abandoned dogs and cats into loving forever homes.",

      // 3 Missions
      missionTitle: "Our Mission & Commitments",
      mission1Title: "Rescue & Medical Care",
      mission1Desc: "Rescuing vulnerable, injured, and abandoned animals, providing full veterinary checks, vaccinations, and neutering.",
      mission2Title: "Emotional Rehabilitation",
      mission2Desc: "Providing a safe, loving, and hygienic sanctuary to help rescued pets regain trust and confidence in humans.",
      mission3Title: "Forever Home Placement",
      mission3Desc: "Promoting adoption over purchasing, ensuring thoughtful matching between prospective families and animals.",

      // 4 Adoption Steps
      stepsTitle: "🐾 4 Simple Steps to Adopt",
      step1Num: "1",
      step1Title: "Browse Rescued Pets",
      step1Desc: "Explore photos, ages, traits, and background stories on our website.",
      step2Num: "2",
      step2Title: "Schedule a Visit",
      step2Desc: "Contact our team to book a visit and spend time getting to know your future companion.",
      step3Num: "3",
      step3Title: "Screening & Chat",
      step3Desc: "A brief conversation regarding your living environment, family agreement, and pet care readiness.",
      step4Num: "4",
      step4Title: "Welcome Home",
      step4Desc: "Sign the adoption pledge and welcome your new friend home with zero adoption fees.",

      // Contact & Visiting
      visitTitle: "📍 Visiting Information & Contact",
      hoursLabel: "Visiting Hours:",
      hoursVal: "Open Daily (Monday – Sunday) 09:00 AM – 05:00 PM",
      locationLabel: "Shelter Location:",
      locationVal: "123 Sukjai Rd, Bang Rak, Bang Rak District, Bangkok 10500",
      contactLabel: "Get in Touch:",
      contactPhone: "Phone: 02-123-4567",
      contactLine: "Line Official: @baanpakjai",
      contactFb: "Facebook: Baan Pak Jai Rescue Center",

      // Call to action
      ctaTitle: "Ready to Open Your Heart and Home?",
      ctaBtn: "🐶 View Available Pets for Adoption →",
    },
  };

  const c = content[lang] || content.th;

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
              }}
            >
              {t("navDonate")}
            </Link>
            <Link
              href="/"
              style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}
            >
              {t("backToHome")}
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
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span
            style={{
              padding: "6px 16px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 600,
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            {c.badge}
          </span>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 900, margin: "0 0 16px 0", lineHeight: 1.3 }}>
            {c.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: "#bbf7d0", margin: 0, lineHeight: 1.7, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            {c.heroDesc}
          </p>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <main style={{ maxWidth: 1040, margin: "-30px auto 80px", padding: "0 20px" }}>
        {/* 3 Missions Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 48,
          }}
        >
          {[
            { icon: "🩺", title: c.mission1Title, desc: c.mission1Desc },
            { icon: "❤️", title: c.mission2Title, desc: c.mission2Desc },
            { icon: "🏠", title: c.mission3Title, desc: c.mission3Desc },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#ffffff",
                padding: "28px 24px",
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Steps Adoption Process */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "36px 30px",
            borderRadius: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 24px 0", textAlign: "center" }}>
            {c.stepsTitle}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {[
              { num: c.step1Num, title: c.step1Title, desc: c.step1Desc },
              { num: c.step2Num, title: c.step2Title, desc: c.step2Desc },
              { num: c.step3Num, title: c.step3Title, desc: c.step3Desc },
              { num: c.step4Num, title: c.step4Title, desc: c.step4Desc },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "20px",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#15803d",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    marginBottom: 12,
                  }}
                >
                  {step.num}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact and Visiting Hours */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "32px 30px",
            borderRadius: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 20px 0" }}>
            {c.visitTitle}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              fontSize: 14,
            }}
          >
            <div style={{ backgroundColor: "#f0fdf4", padding: "18px", borderRadius: 14, border: "1px solid #bbf7d0" }}>
              <div style={{ fontWeight: 700, color: "#166534", marginBottom: 4 }}>🕒 {c.hoursLabel}</div>
              <div style={{ color: "#15803d" }}>{c.hoursVal}</div>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: 14, border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: 4 }}>📌 {c.locationLabel}</div>
              <div style={{ color: "#64748b" }}>{c.locationVal}</div>
            </div>

            <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: 14, border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 700, color: "#334155", marginBottom: 4 }}>📞 {c.contactLabel}</div>
              <div style={{ color: "#64748b", lineHeight: 1.6 }}>
                <div>{c.contactPhone}</div>
                <div>{c.contactLine}</div>
                <div>{c.contactFb}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Card */}
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            borderRadius: 24,
            border: "1.5px solid #86efac",
          }}
        >
          <h3 style={{ fontSize: 22, fontWeight: 900, color: "#166534", margin: "0 0 16px 0" }}>
            {c.ctaTitle}
          </h3>
          <Link
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#15803d",
              color: "#ffffff",
              padding: "12px 28px",
              borderRadius: 30,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(21, 128, 61, 0.3)",
            }}
          >
            {c.ctaBtn}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "30px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          <p style={{ margin: 0 }}>{t("footerDesc")}</p>
        </div>
      </footer>
    </div>
  );
}