import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadsService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  uploadProductImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'corazel/productos',
          resource_type: 'image',
          // Respaldo del lado del servidor: aunque el navegador no haya podido comprimir
          // (ej. formatos que no decodifica, como HEIC), Cloudinary acepta el original y
          // lo normaliza a JPG con un tamaño/calidad razonables.
          format: 'jpg',
          transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:good' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new Error(error?.message ?? 'Cloudinary no devolvió resultado'),
            );
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
