"use client";

import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  th: {
    // แถบเมนู & ทั่วไป
    brandName: "บ้านพักใจ",
    navAbout: "เกี่ยวกับศูนย์",
    navDonate: "💛 ร่วมบริจาค",
    navAdmin: "🔒 พื้นที่เจ้าหน้าที่",
    backToHome: "← กลับหน้าหลัก",
    backToPets: "← กลับหน้ารายการสัตว์เลี้ยง",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    delete: "ลบ",
    edit: "แก้ไข",
    view: "ดู",
    save: "บันทึกข้อมูล",
    saving: "กำลังบันทึก...",
    loading: "กำลังโหลดข้อมูล...",

    // หน้าหลัก (Home)
    heroBadge: "🐾 เปิดรับอุปการะสัตว์เลี้ยงเพื่อบ้านที่อบอุ่น",
    heroTitle1: "มอบความรักและบ้านใหม่",
    heroTitle2: "ให้เพื่อนสี่ขาที่รอคอยคุณ",
    heroSubtitle: "สัตว์เลี้ยงทุกตัวผ่านการตรวจสุขภาพเบื้องต้น พร้อมเปิดรับการอุปการะโดยไม่มีค่าใช้จ่าย",
    searchPlaceholder: "ค้นหาชื่อสัตว์เลี้ยง, สายพันธุ์, หรือลักษณะนิสัย...",
    allCategories: "ทั้งหมด",
    favorites: "ถูกใจ",
    allGenders: "ทุกเพศ",
    sortNewest: "มาใหม่ล่าสุด",
    sortAgeAsc: "อายุน้อย → มาก",
    sortAgeDesc: "อายุมาก → น้อย",
    notFoundTitle: "ไม่พบข้อมูลสัตว์เลี้ยงที่คุณค้นหา",
    notFoundDesc: "ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองหมวดหมู่อีกครั้ง",
    babyWarning: "⚠️ ยังไม่พร้อมแยกจากแม่",
    defaultDesc: "รอคอยบ้านใหม่ที่อบอุ่นและพร้อมดูแลด้วยความรัก",
    viewMore: "ดูข้อมูลเพิ่มเติม →",

    // หน้ารายละเอียดสัตว์เลี้ยง (Pet Detail)
    arrivedAt: "เข้ามาที่ศูนย์เมื่อ:",
    petStory: "เรื่องของ",
    noPetStory: "ยังไม่มีข้อมูลประวัติและอุปนิสัยของสัตว์เลี้ยงตัวนี้",
    ageLabel: "อายุ",
    contactTitle: "สนใจรับเลี้ยง? ติดต่อศูนย์ได้เลย",
    contactSubtitle: "เว็บนี้แสดงข้อมูลสัตว์เลี้ยงเท่านั้น ขั้นตอนรับเลี้ยงดำเนินการที่ศูนย์โดยตรง",
    contactTel: "โทร:",
    contactLine: "Line:",
    contactFb: "Facebook: บ้านพักใจ",
    contactAddr: "ที่อยู่: 123 ถนนสุขใจ แขวงบางรัก กรุงเทพฯ 10500 (ทุกวัน 09:00–17:00 น.)",
    editStaffLink: "✏️ แก้ไขข้อมูลสัตว์เลี้ยงตัวนี้ (สำหรับเจ้าหน้าที่)",

    // หน้าบริจาค (Donate)
    donateBadge: "💛 ส่งต่อความรักสู่เพื่อนสี่ขา",
    donateHeroTitle: "ร่วมสนับสนุนศูนย์พักพิงบ้านพักใจ",
    donateHeroDesc: "ทุกยอดบริจาคจะนำไปเป็นค่าอาหาร ยารักษาโรค และการดูแลสัตว์เพื่อรอคอยบ้านใหม่",
    paymentChannels: "💳 ช่องทางการสนับสนุน",
    bankName: "ธนาคารกสิกรไทย (KBANK)",
    accountName: "ชื่อบัญชี: โครงการช่วยเหลือสัตว์บ้านพักใจ",
    copyAccount: "📋 คัดลอกเลขบัญชี",
    copiedAccount: "✓ คัดลอกเลขบัญชีแล้ว",
    itemsTitle: "📦 สิ่งของจำเป็นที่ศูนย์เปิดรับ:",
    item1: "อาหารเม็ด / อาหารเปียก สำหรับสุนัขและแมว",
    item2: "ทรายแมว และแผ่นรองซับสิ่งขับถ่าย",
    item3: "แชมพูอาบน้ำกำจัดเห็บหมัด และยากันยุงสำหรับสัตว์",
    item4: "ผ้าเช็ดตัวเก่า ผ้าห่ม หรือกรงเดินทาง",
    donationFormTitle: "📑 แบบฟอร์มแจ้งการบริจาค",
    amountLabel: "จำนวนเงิน (บาท)",
    customAmountPlaceholder: "หรือระบุจำนวนเงินเอง",
    donorNameLabel: "ชื่อผู้บริจาค",
    donorNameAnon: "(หรือระบุ 'ผู้ไม่ประสงค์ออกนาม')",
    phoneLabel: "เบอร์โทรศัพท์ติดต่อ",
    slipLabel: "แนบรูปสลิปหลักฐานการโอน",
    chooseSlip: "📎 เลือกรูปสลิป",
    slipUploaded: "✓ แนบสลิปเรียบร้อย",
    noteLabel: "ข้อความให้กำลังใจน้องๆ (ไม่บังคับ)",
    notePlaceholder: "ขอให้น้องๆ ได้บ้านใหม่ไวๆ นะ...",
    confirmDonateBtn: "ยืนยันการบริจาค",
    donateSuccessTitle: "ขอบพระคุณสำหรับความเมตตา!",
    donateSuccessDesc: "เราได้รับข้อมูลการบริจาคของคุณเรียบร้อยแล้ว น้องๆ จะได้รับการดูแลอย่างเต็มที่",
    donateMoreBtn: "แจ้งการบริจาคเพิ่ม",

    // หน้าแอดมิน (Admin)
    adminTitle: "🐾 ระบบจัดการสัตว์เลี้ยง",
    adminSubtitle: "ควบคุมสถานะ บันทึกประวัติ และอัปเดตข้อมูลบ้านพักใจ",
    addNewPet: "➕ เพิ่มสัตว์ใหม่",
    logout: "ออกจากระบบ",
    statTotal: "สัตว์ทั้งหมด",
    statAvailable: "พร้อมรับเลี้ยง",
    statPending: "กำลังรอพิจารณา",
    statAdopted: "มีบ้านแล้ว",
    colPet: "สัตว์เลี้ยง",
    colBreed: "ประเภท / สายพันธุ์",
    colAge: "อายุ",
    colStatus: "สถานะ",
    colManage: "จัดการ",
    emptyAdmin: "ไม่พบรายการสัตว์เลี้ยงในหมวดหมู่นี้",

    // หน่วยนับ
    months: "เดือน",
    years: "ปี",
    unitTail: "ตัว",
    currency: "บาท",

    // Footer
    footerTitle: "🏡 บ้านพักใจ — ระบบจัดการและรับเลี้ยงสัตว์เลี้ยง",
    footerDesc: "เปิดทำการทุกวัน 09:00 - 17:00 น. | โทร. 02-123-4567 | Line: @baanpakjai",
  },

  en: {
    // Navigation & Common
    brandName: "Baan Pak Jai",
    navAbout: "About Us",
    navDonate: "💛 Donate",
    navAdmin: "🔒 Staff Portal",
    backToHome: "← Back to Home",
    backToPets: "← Back to Pet Catalog",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    save: "Save Information",
    saving: "Saving...",
    loading: "Loading information...",

    // Homepage
    heroBadge: "🐾 Rescuing & rehoming pets with love",
    heroTitle1: "Give Love and a Warm Home",
    heroTitle2: "To companions waiting for you",
    heroSubtitle: "All rescued pets are health-checked and ready for adoption with no fees.",
    searchPlaceholder: "Search pet name, breed, or traits...",
    allCategories: "All",
    favorites: "Favorites",
    allGenders: "All Genders",
    sortNewest: "Newest First",
    sortAgeAsc: "Age: Young to Old",
    sortAgeDesc: "Age: Old to Young",
    notFoundTitle: "No pets match your criteria",
    notFoundDesc: "Try adjusting your search terms or reset category filters.",
    babyWarning: "⚠️ Too young to adopt",
    defaultDesc: "Waiting for a warm home and caring adopters.",
    viewMore: "View Details →",

    // Pet Detail
    arrivedAt: "Arrived at shelter on:",
    petStory: "About",
    noPetStory: "No background or personality details provided yet.",
    ageLabel: "Age",
    contactTitle: "Interested in Adoption? Contact Us",
    contactSubtitle: "This website provides pet information only. Adoption procedures are handled directly at the center.",
    contactTel: "Tel:",
    contactLine: "Line:",
    contactFb: "Facebook: Baan Pak Jai",
    contactAddr: "Address: 123 Sukjai Rd, Bang Rak, Bangkok 10500 (Daily 09:00–17:00)",
    editStaffLink: "✏️ Edit this pet's details (Staff Only)",

    // Donation
    donateBadge: "💛 Share love to four-legged friends",
    donateHeroTitle: "Support Baan Pak Jai Shelter",
    donateHeroDesc: "All donations go directly toward food, veterinary care, and shelter operations.",
    paymentChannels: "💳 Donation Channels",
    bankName: "Kasikornbank (KBANK)",
    accountName: "Account Name: Baan Pak Jai Pet Shelter Project",
    copyAccount: "📋 Copy Account Number",
    copiedAccount: "✓ Account Number Copied",
    itemsTitle: "📦 Essential Supplies We Accept:",
    item1: "Kibble & wet food for dogs and cats",
    item2: "Cat litter and pee pads",
    item3: "Tick/flea shampoo and pet mosquito repellents",
    item4: "Old clean towels, blankets, and pet carriers",
    donationFormTitle: "📑 Donation Submission Form",
    amountLabel: "Donation Amount (THB)",
    customAmountPlaceholder: "Or enter custom amount",
    donorNameLabel: "Donor Name",
    donorNameAnon: "(or specify 'Anonymous')",
    phoneLabel: "Contact Phone Number",
    slipLabel: "Upload Transfer Slip / Receipt",
    chooseSlip: "📎 Choose Slip Image",
    slipUploaded: "✓ Slip Attached Successfully",
    noteLabel: "Words of Encouragement (Optional)",
    notePlaceholder: "Wish you all find a loving home soon...",
    confirmDonateBtn: "Confirm Donation",
    donateSuccessTitle: "Thank You for Your Generosity!",
    donateSuccessDesc: "We have received your donation confirmation. The animals will be well cared for thanks to your kindness.",
    donateMoreBtn: "Make Another Donation",

    // Admin
    adminTitle: "🐾 Pet Management System",
    adminSubtitle: "Manage statuses, update records, and monitor shelter pets",
    addNewPet: "➕ Add New Pet",
    logout: "Sign Out",
    statTotal: "Total Pets",
    statAvailable: "Available",
    statPending: "Pending Review",
    statAdopted: "Adopted",
    colPet: "Pet",
    colBreed: "Type / Breed",
    colAge: "Age",
    colStatus: "Status",
    colManage: "Actions",
    emptyAdmin: "No pets found in this category",

    // Units
    months: "months",
    years: "years",
    unitTail: "pets",
    currency: "THB",

    // Footer
    footerTitle: "🏡 Baan Pak Jai — Pet Rescue & Adoption Center",
    footerDesc: "Open Daily 09:00 - 17:00 | Tel. 02-123-4567 | Line: @baanpakjai",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("th");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang");
    if (saved === "th" || saved === "en") {
      setLang(saved);
    }
  }, []);

  function toggleLanguage() {
    const nextLang = lang === "th" ? "en" : "th";
    setLang(nextLang);
    localStorage.setItem("preferred_lang", nextLang);
  }

  const t = (key) => translations[lang]?.[key] || key;

  // ฟังก์ชันแปลงเพศตามภาษา
  function formatGender(gender) {
    if (gender === "MALE") return lang === "th" ? "เพศผู้" : "Male";
    if (gender === "FEMALE") return lang === "th" ? "เพศเมีย" : "Female";
    return lang === "th" ? "ไม่ระบุเพศ" : "Unknown";
  }

  // ฟังก์ชันแปลงสถานะตามภาษา
  function formatStatus(status) {
    switch (status) {
      case "AVAILABLE":
        return {
          label: lang === "th" ? "พร้อมรับเลี้ยง" : "Available",
          bg: "#dcfce7",
          color: "#15803d",
        };
      case "PENDING":
        return {
          label: lang === "th" ? "รอพิจารณา" : "Pending",
          bg: "#fef3c7",
          color: "#b45309",
        };
      case "ADOPTED":
        return {
          label: lang === "th" ? "รับเลี้ยงแล้ว" : "Adopted",
          bg: "#e0e7ff",
          color: "#4338ca",
        };
      default:
        return {
          label: lang === "th" ? "ปิดรับชั่วคราว" : "Unavailable",
          bg: "#fee2e2",
          color: "#b91c1c",
        };
    }
  }

  // ฟังก์ชันแปลงอายุตามภาษา
  function formatAge(months) {
    if (!months && months !== 0) return "-";
    if (months < 12) return `${months} ${t("months")}`;
    const yrs = Math.floor(months / 12);
    const rem = months % 12;
    if (rem === 0) return `${yrs} ${t("years")}`;
    return `${yrs} ${t("years")} ${rem} ${t("months")}`;
  }

  return (
    <LanguageContext.Provider
      value={{
        lang,
        toggleLanguage,
        t,
        formatGender,
        formatStatus,
        formatAge,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  // ป้องกัน Error 'lang is undefined' กรณีโหลดไม่ทันหรืออยู่นอก Provider
  if (!context) {
    return {
      lang: "th",
      toggleLanguage: () => {},
      t: (key) => key,
      formatGender: (g) => (g === "MALE" ? "เพศผู้" : g === "FEMALE" ? "เพศเมีย" : "-"),
      formatStatus: (s) => ({ label: s, bg: "#f1f5f9", color: "#475569" }),
      formatAge: (m) => (m ? `${m} เดือน` : "-"),
    };
  }

  return context;
}