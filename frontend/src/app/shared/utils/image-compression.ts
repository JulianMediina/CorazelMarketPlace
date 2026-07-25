const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Redimensiona/comprime una foto en el navegador antes de subirla. Las fotos de celular
 * suelen pesar 5-15MB, muy por encima de límites razonables de subida y de datos móviles —
 * esto evita que el usuario vea un error de "archivo muy pesado" sin entender por qué.
 *
 * Si el navegador no puede decodificar el formato (ej. HEIC de iPhone en navegadores sin
 * soporte nativo), se sube el archivo original sin tocar en vez de abortar la subida —
 * Cloudinary acepta prácticamente cualquier formato y lo normaliza del lado del servidor.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
    );
    if (!blob) {
      return file;
    }

    const nombreSinExtension = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${nombreSinExtension}.jpg`, { type: 'image/jpeg' });
  } catch {
    // Formato no decodificable por el navegador (ej. HEIC): se sube tal cual.
    return file;
  }
}
