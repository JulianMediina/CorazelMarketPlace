import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Talla } from '@prisma/client';

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  categoria?: string; // slug de Category

  @IsOptional()
  @IsString()
  coleccion?: string; // slug de Collection

  @IsOptional()
  @IsIn(Object.values(Talla))
  talla?: Talla;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  buscar?: string; // búsqueda por nombre

  @IsOptional()
  @IsBooleanString()
  destacado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  limit?: number = 20;
}
