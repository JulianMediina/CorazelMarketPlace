import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const DEFAULT_SELLER_SLUG = 'corazel';

const productListInclude = {
  category: true,
  collection: true,
  imagenes: { orderBy: { orden: 'asc' as const } },
  variantes: true,
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ProductWhereInput = {
      activo: true,
      category: query.categoria ? { slug: query.categoria } : undefined,
      collection: query.coleccion ? { slug: query.coleccion } : undefined,
      destacado:
        query.destacado !== undefined ? query.destacado === 'true' : undefined,
      nombre: query.buscar
        ? { contains: query.buscar, mode: 'insensitive' }
        : undefined,
      variantes:
        query.talla || query.color
          ? {
              some: {
                talla: query.talla,
                color: query.color
                  ? { equals: query.color, mode: 'insensitive' }
                  : undefined,
              },
            }
          : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: productListInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: productListInclude,
    });
    if (!product) {
      throw new NotFoundException(`Producto ${idOrSlug} no encontrado`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    await this.ensureSlugAvailable(dto.slug);
    const seller = await this.getDefaultSeller();

    const { variantes, imagenes, ...data } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...data,
        sellerId: seller.id,
        variantes: { create: variantes },
        imagenes: { create: imagenes ?? [] },
      },
      include: productListInclude,
    });

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    if (dto.slug) {
      await this.ensureSlugAvailable(dto.slug, id);
    }

    const { variantes, imagenes, ...data } = dto;

    // Variantes/imágenes se reemplazan por completo: el admin envía el estado final
    // del formulario, así que borrar-y-recrear es más simple y confiable que hacer
    // un diff granular para un panel de un solo administrador.
    return this.prisma.$transaction(async (tx) => {
      if (variantes) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
      }
      if (imagenes) {
        await tx.productImage.deleteMany({ where: { productId: id } });
      }

      return tx.product.update({
        where: { id },
        data: {
          ...data,
          variantes: variantes ? { create: variantes } : undefined,
          imagenes: imagenes ? { create: imagenes } : undefined,
        },
        include: productListInclude,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { activo: false },
    });
  }

  private async ensureSlugAvailable(slug: string, excludeId?: string) {
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `Ya existe un producto con el slug "${slug}"`,
      );
    }
  }

  /**
   * El negocio hoy es single-vendor: todo producto se asigna al Seller de sistema
   * "Corazel" para que el schema quede listo para un futuro marketplace
   * multi-vendedor sin exponer ese concepto en el admin todavía.
   */
  private async getDefaultSeller() {
    return this.prisma.seller.upsert({
      where: { slug: DEFAULT_SELLER_SLUG },
      update: {},
      create: { nombre: 'Corazél', slug: DEFAULT_SELLER_SLUG },
    });
  }
}
