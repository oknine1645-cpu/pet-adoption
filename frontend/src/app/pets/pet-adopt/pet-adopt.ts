import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-adopt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pet-adopt.html',
})
export class PetAdoptComponent implements OnInit {
  pet: Pet | null = null;
  adoptForm!: FormGroup;
  loadingPet = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private petService: PetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPet(id);
    }
  }

  initForm(): void {
    this.adoptForm = this.fb.group({
      prefix: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address1: [''],
      address2: [''],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['Thailand', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      socialContact: [''],
      nearestAirport: [''],
      householdMembers: [''],
      householdAgreement: [''],
      otherPets: [''],
      housingDetails: [''],
      occupationAndHours: [''],
      adoptionReason: ['', [Validators.required]],
      receiveNews: ['ต้องการรับข่าวสาร'],
      agreeDonationInfo: [false],
    });
  }

  loadPet(id: string): void {
    this.loadingPet = true;
    this.cdr.detectChanges();

    this.petService.getOne(id).subscribe({
      next: (res: any) => {
        this.pet = res?.data ? res.data : res;
        this.loadingPet = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading pet:', err);
        this.loadingPet = false;
        this.cdr.detectChanges();
      },
    });
  }

  formatAge(months?: number | null): string {
    if (!months || months <= 0) return 'ไม่ระบุอายุ';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} ปี ${remainingMonths} เดือน`;
    } else if (years > 0) {
      return `${years} ปี`;
    } else {
      return `${remainingMonths} เดือน`;
    }
  }

  getGenderThai(gender?: string): string {
    if (gender === 'MALE') return 'ตัวผู้';
    if (gender === 'FEMALE') return 'ตัวเมีย';
    return gender || '-';
  }

  removeSelectedPet(): void {
    if (confirm('ต้องการยกเลิกการเลือกสัตว์เลี้ยงตัวนี้และกลับไปหน้ารายการหรือไม่?')) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.adoptForm.invalid) {
      this.adoptForm.markAllAsTouched();
      alert('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมายดอกจัน (*) ให้ครบถ้วน');
      return;
    }

    if (this.adoptForm.value.email !== this.adoptForm.value.confirmEmail) {
      alert('อีเมลและยืนยันอีเมลไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.cdr.detectChanges();
      alert(`🎉 ส่งแบบฟอร์มขอรับเลี้ยง "${this.pet?.name || 'สัตว์เลี้ยง'}" สำเร็จแล้ว!\nเจ้าหน้าที่จะติดต่อกลับหาคุณโดยเร็วที่สุด`);
      this.router.navigate(['/']);
    }, 1000);
  }
}