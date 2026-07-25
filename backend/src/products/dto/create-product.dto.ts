import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductImageDto } from './product-image.dto';
import { ProductVariantDto } from './product-variant.dto';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  slug: string;

  @IsString()
  @MinLength(10)
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  collectionId: string;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variantes: ProductVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  imagenes?: ProductImageDto[];
}
