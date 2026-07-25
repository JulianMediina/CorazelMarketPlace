import { Talla } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class ProductVariantDto {
  @IsEnum(Talla)
  talla: Talla;

  @IsString()
  @MinLength(1)
  color: string;

  @IsOptional()
  @IsString()
  colorHex?: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  sku?: string;
}
