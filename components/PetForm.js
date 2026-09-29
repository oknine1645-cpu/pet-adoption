'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUSES, STATUS_LABEL } from '@/lib/rules';

const blank = {
  name: '', petTypeId: '', status: 'AVAILABLE', gender: '', age: '', weightKg: '',
  breed: '', arrivedDate: new Date().toISOString().slice(0, 10),
  description: '', healthNote: '', imageUrl: '',
};

export default function PetForm({ types, pet }) {
  const router = useRouter();
  const [f, setF] = useState(
    pet
      ? { ...blank, ...Object.fromEntries(Object.entries(pet).map(([k, v]) => [k, v ?? ''])) }
      : { ...blank, petTypeId: types[0]?.id ?? '' }
  );
  const [errors, setErrors] = useState({});
  const [confirmReopen, setConfirmReopen] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const needConfirm = pet?.status === 'ADOPTED' && f.status === 'AVAILABLE';
  const young = f.age !== '' && Number(f.age) < 2;
  const Err = ({ k }) => (errors[k] ? <span className="err">{errors[k]}</span> : null);

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!String(f.name).trim()) er.name = 'กรุณากรอกชื่อสัตว์ (ห้ามเว้นว่าง)';
    if (!f.petTypeId) er.petTypeId = 'กรุณาเลือกประเภทสัตว์';
    if (needConfirm && !confirmReopen) er.status = 'ต้องติ๊กยืนยันก่อนเปลี่ยนกลับเป็น AVAILABLE';
    if (Object.keys(er).length) return setErrors(er);
    setSaving(true);
    const res = await fetch(pet ? `/api/pets/${pet.id}` : '/api/pets', {
      method: pet ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, confirmReopen }),
    });
    if (res.ok) { router.push('/admin'); router.refresh(); return; }
    const j = await res.json().catch(() => ({}));
    setErrors(j.errors || { form: 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง' });
    setSaving(false);
  }

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h1>{pet ? `แก้ไขข้อมูล: ${pet.name}` : 'เพิ่มสัตว์เลี้ยงใหม่'}</h1>
      <p className="sub">สำหรับเจ้าหน้าที่ · ช่องที่มี <span className="req">*</span> จำเป็นต้องกรอก</p>
      <div className="grid2">
        <div className="field"><label htmlFor="name">ชื่อสัตว์ <span className="req">*</span></label>
          <input id="name" value={f.name} onChange={set('name')} placeholder="เช่น มะลิ" /><Err k="name" /></div>
        <div className="field"><label htmlFor="type">ประเภทสัตว์ <span className="req">*</span></label>
          <select id="type" value={f.petTypeId} onChange={set('petTypeId')}>
            <option value="">— เลือกประเภท —</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select><Err k="petTypeId" /></div>
        <div className="field"><label htmlFor="status">สถานะ</label>
          <select id="status" value={f.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s} value={s}>{s} — {STATUS_LABEL[s]}</option>)}
          </select><Err k="status" /></div>
        <div className="field"><label htmlFor="gender">เพศ</label>
          <select id="gender" value={f.gender} onChange={set('gender')}>
            <option value="">ไม่ระบุ</option><option value="MALE">ผู้</option><option value="FEMALE">เมีย</option>
          </select></div>
        <div className="field"><label htmlFor="age">อายุ (เดือน)</label>
          <input id="age" type="number" min="0" value={f.age} onChange={set('age')} /><Err k="age" /></div>
        <div className="field"><label htmlFor="w">น้ำหนัก (กก.)</label>
          <input id="w" type="number" min="0" step="0.1" value={f.weightKg} onChange={set('weightKg')} /><Err k="weightKg" /></div>
        <div className="field"><label htmlFor="breed">สายพันธุ์</label>
          <input id="breed" value={f.breed} onChange={set('breed')} /></div>
        <div className="field"><label htmlFor="arr">วันที่เข้ามาในระบบ</label>
          <input id="arr" type="date" value={f.arrivedDate} onChange={set('arrivedDate')} /><Err k="arrivedDate" /></div>
      </div>
      {young && <p className="hint">อายุต่ำกว่า 2 เดือน — ระบบจะแสดงป้าย “ยังไม่พร้อมแยกจากแม่”</p>}
      {needConfirm && (
        <div className="note rule">
          สัตว์ที่ ADOPTED แล้วเปลี่ยนกลับเป็น AVAILABLE โดยตรงไม่ได้
          <label className="check"><input type="checkbox" checked={confirmReopen} onChange={(e) => setConfirmReopen(e.target.checked)} /> ยืนยันเปิดรับเลี้ยงอีกครั้ง</label>
        </div>
      )}
      <div className="field"><label htmlFor="desc">ลักษณะนิสัย / ข้อมูลเพิ่มเติม</label>
        <textarea id="desc" value={f.description} onChange={set('description')} /></div>
      <div className="field"><label htmlFor="health">ข้อมูลสุขภาพ</label>
        <input id="health" value={f.healthNote} onChange={set('healthNote')} placeholder="เช่น ฉีดวัคซีนแล้ว, ทำหมันแล้ว" /></div>
      <div className="field"><label htmlFor="img">ลิงก์รูปสัตว์ (URL)</label>
        <input id="img" type="url" value={f.imageUrl} onChange={set('imageUrl')} placeholder="https://..." /></div>
      {errors.form && <p className="err">{errors.form}</p>}
      <div className="actions">
        <button type="button" className="btn ghost" onClick={() => router.push('/admin')}>ยกเลิก</button>
        <button type="submit" className="btn primary" disabled={saving}>{saving ? 'กำลังบันทึก…' : 'บันทึก'}</button>
      </div>
    </form>
  );
}
