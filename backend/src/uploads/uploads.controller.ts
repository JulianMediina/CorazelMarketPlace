import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

// El frontend ya comprime las fotos antes de subirlas; este límite es solo una red de
// seguridad para el caso raro de que llegue algo sin comprimir.
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // Protegido por el JwtAuthGuard global: solo el admin autenticado sube imágenes.
  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_IMAGE_BYTES } }),
  )
  async uploadProductImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }
    const result = await this.uploadsService.uploadProductImage(file);
    return { url: result.secure_url, publicId: result.public_id };
  }

  // publicId de Cloudinary incluye "/" (ej. corazel/productos/abc123): va como query param,
  // no como segmento de ruta, para no romper el matching de Express.
  @Delete('product-image')
  deleteProductImage(@Query('publicId') publicId?: string) {
    if (!publicId) {
      throw new BadRequestException('publicId es requerido');
    }
    return this.uploadsService.deleteImage(publicId);
  }
}
