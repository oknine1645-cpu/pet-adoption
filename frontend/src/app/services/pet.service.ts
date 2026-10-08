import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Pet, PetType } from '../models/pet.model';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private apiUrl = 'http://localhost:3000/api/pets';
  private typesUrl = 'http://localhost:3000/api/pet-types';

  constructor(private http: HttpClient) {}

  getAll(search?: string, typeId?: number | string, status?: string): Observable<Pet[]> {
    let params = new HttpParams();

    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    if (typeId && typeId !== 'ALL' && typeId.toString().trim() !== '') {
      params = params.set('typeId', typeId.toString());
    }
    if (status && status !== 'ALL' && status.trim() !== '') {
      params = params.set('status', status.trim());
    }

    return this.http.get<Pet[]>(this.apiUrl, { params }).pipe(
      timeout(5000), // 👈 ถ้าเซิร์ฟเวอร์ไม่ตอบใน 5 วินาที ให้ตีเป็น Error ทันที
      catchError(err => throwError(() => err))
    );
  }

  getTypes(): Observable<PetType[]> {
    return this.http.get<PetType[]>(this.typesUrl).pipe(timeout(5000));
  }

  getOne(id: number | string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }
  create(data: any): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, data);
  }
  update(id: number | string, data: any): Observable<Pet> {
    // ใช้ PUT ให้ตรงกับ Controller พร้อมระบบ timeout 7 วินาทีตัดจบ
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, data).pipe(
      timeout(7000),
      catchError((err) => throwError(() => err))
    );
  }
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}