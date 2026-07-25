import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class ProductImageDto {
  @IsString()
  @MinLength(1)
  url: string;

  @IsString()
  @MinLength(1)
  publicId: string;

  @IsOptional()
  @IsInt()
  orden?: number;
}
