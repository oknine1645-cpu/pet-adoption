import { LanguageProvider } from "@/context/LanguageContext";
import FloatingLanguageSwitch from "@/components/FloatingLanguageSwitch";
import "./globals.css";

export const metadata = {
  title: "บ้านพักใจ – Pet Adoption Center",
  description: "ระบบรับเลี้ยงและจัดการสัตว์เลี้ยง",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        <LanguageProvider>
          {children}
          <FloatingLanguageSwitch />
        </LanguageProvider>
      </body>
    </html>
  );
}