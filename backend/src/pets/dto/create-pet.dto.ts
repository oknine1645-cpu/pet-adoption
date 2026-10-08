import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class CreatePetDto {
  // แก้ไข: ตัดช่องว่าง (trim) ก่อนตรวจสอบ เพื่อป้องกันการส่ง Spacebar ล้วน
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'ชื่อสัตว์เลี้ยงห้ามว่าง' })
  @IsString({ message: 'ชื่อสัตว์เลี้ยงต้องเป็นข้อความ' })
  name: string;

  @Type(() => Number)
  @IsInt({ message: 'petTypeId ต้องเป็นจำนวนเต็ม' })
  @IsNotEmpty({ message: 'ต้องระบุประเภทสัตว์เลี้ยง' })
  petTypeId: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @Type(() => Number)
  @IsInt({ message: 'อายุต้องเป็นจำนวนเต็มเท่านั้น' })
  @Min(0, { message: 'อายุต้องไม่ต่ำกว่า 0 เดือน' })
  @Max(600, { message: 'อายุต้องไม่เกิน 600 เดือน' })
  @IsNotEmpty({ message: 'กรุณากรอกอายุ' })
  ageMonths: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'น้ำหนักต้องเป็นตัวเลข' })
  @Min(0, { message: 'น้ำหนักต้องไม่ติดลบ' })
  weightKg?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  healthNote?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  arrivedDate?: string;
}