'use client';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, name }) {
  const router = useRouter();
  async function del() {
    if (!window.confirm(`ลบ “${name}” ออกจากระบบ? การลบย้อนกลับไม่ได้`)) return;
    const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    if (res.ok) router.refresh();
    else window.alert('ลบไม่สำเร็จ');
  }
  return <button type="button" className="mini danger" onClick={del}>ลบ</button>;
}
