import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(includeInactive = false) {
    return this.prisma.category.findMany({
      where: includeInactive ? undefined : { activa: true },
      orderBy: { orden: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoría ${id} no encontrada`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    await this.ensureSlugAvailable(dto.slug);
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Baja lógica: preserva el historial de productos que referencian esta categoría.
    return this.prisma.category.update({
      where: { id },
      data: { activa: false },
    });
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `Ya existe una categoría con el slug "${slug}"`,
      );
    }
  }
}
