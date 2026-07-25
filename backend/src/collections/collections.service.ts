import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(includeInactive = false) {
    return this.prisma.collection.findMany({
      where: includeInactive ? undefined : { activa: true },
      orderBy: { orden: 'asc' },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });
    if (!collection) {
      throw new NotFoundException(`Colección ${id} no encontrada`);
    }
    return collection;
  }

  async create(dto: CreateCollectionDto) {
    await this.ensureSlugAvailable(dto.slug);
    return this.prisma.collection.create({ data: dto });
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    if (dto.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }
    return this.prisma.collection.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.collection.update({
      where: { id },
      data: { activa: false },
    });
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.collection.findUnique({
      where: { slug },
    });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `Ya existe una colección con el slug "${slug}"`,
      );
    }
  }
}
