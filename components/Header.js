"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // ซ่อนแถบเมนูทั้งหมดเมื่ออยู่ในหน้า /login หรือ /register
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="site-header">
      <div className="header-brand">
        <div className="header-logo" aria-hidden="true">🐾</div>
        <div>
          <h1 className="site-title">บ้านพักใจ</h1>
          <p className="site-desc">ระบบจัดการและรับเลี้ยงสัตว์เลี้ยง</p>
        </div>
      </div>

      <nav className="header-nav">
        <Link href="/" className="nav-btn">
          รายการสัตว์
        </Link>
        <Link href="/about" className="nav-btn">
          ขั้นตอน & ติดต่อ
        </Link>
        <Link href="/admin" className="nav-btn">
          จัดการ (เจ้าหน้าที่)
        </Link>
      </nav>
    </header>
  );
}