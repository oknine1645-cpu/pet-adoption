import Link from 'next/link';
import { STATUS_LABEL, GENDER_LABEL, ageText, isYoung } from '@/lib/rules';

const emoji = (t) => (t === 'แมว' ? '🐱' : t === 'สุนัข' ? '🐶' : '🐾');

export function Photo({ pet, big }) {
  const cls = 'photo' + (big ? ' big' : '');
  // eslint-disable-next-line @next/next/no-img-element
  if (pet.imageUrl) return <img src={pet.imageUrl} alt={pet.name} className={cls} />;
  return <div className={cls + ' ph'} role="img" aria-label={pet.name}>{emoji(pet.petType?.name)}</div>;
}

export function StatusTag({ status }) {
  return <span className={`tag ${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>;
}

export function PetCard({ pet, i = 0 }) {
  const tilt = [-2, 1.5, -1, 2, -2.5, 1][i % 6];
  return (
    <Link href={`/pets/${pet.id}`} className="card" style={{ '--tilt': `${tilt}deg` }}>
      <Photo pet={pet} />
      <h3>{pet.name}</h3>
      <p className="meta">
        {pet.breed || pet.petType.name} · {pet.gender ? GENDER_LABEL[pet.gender] : 'ไม่ระบุเพศ'} · {ageText(pet.age)}
      </p>
      <StatusTag status={pet.status} />
      {isYoung(pet.age) && <span className="tag pending">ยังไม่พร้อมแยกจากแม่</span>}
    </Link>
  );
}
