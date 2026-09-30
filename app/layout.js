import { Prompt } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import Providers from "@/components/Providers";
import FloatingLanguageSwitch from "@/components/FloatingLanguageSwitch";
import "./globals.css";

// 1. ตั้งค่าฟอนต์ Prompt ด้วย next/font (ข้อ 10.1)
const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "บ้านพักใจ – Pet Adoption Center",
  description: "ระบบรับเลี้ยงและจัดการสัตว์เลี้ยง",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={prompt.className}>
      <body>
        {/* 2. นำ Providers มาครอบนอกสุดของระบบ (ข้อ 10.7) */}
        <Providers>
          <LanguageProvider>
            {children}
            <FloatingLanguageSwitch />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}