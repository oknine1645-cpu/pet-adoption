import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PetsService {
  private prisma = new PrismaClient();

  // ดึงรายการประเภทสัตว์เลี้ยง
  async findPetTypes() {
    return this.prisma.petType.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // ดึงรายการสัตว์เลี้ยงทั้งหมด
  async findAll(search?: string, typeId?: string, status?: string) {
    const where: any = {};

    // ค้นหาตามชื่อหรือสายพันธุ์
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { breed: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    // กรองประเภทสัตว์
    if (typeId && typeId !== 'ALL' && typeId.trim() !== '') {
      where.petTypeId = Number(typeId);
    }

    // กรองสถานะ (ถ้าส่ง 'ALL' มาจะไม่ใส่เงื่อนไข เพื่อดึงทุกสถานะ)
    if (status && status !== 'ALL' && status.trim() !== '') {
      where.status = status.trim();
    }

    return this.prisma.pet.findMany({
      where,
      include: {
        petType: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: { petType: true },
    });
    if (!pet) {
      throw new NotFoundException(`ไม่พบสัตว์เลี้ยงรหัส ${id}`);
    }
    return pet;
  }

  async create(dto: any) {
    return this.prisma.pet.create({
      data: dto,
      include: { petType: true },
    });
  }

  async update(id: number, dto: any) {
    return this.prisma.pet.update({
      where: { id },
      data: dto,
      include: { petType: true },
    });
  }

  async remove(id: number) {
    return this.prisma.pet.delete({
      where: { id },
    });
  }
}