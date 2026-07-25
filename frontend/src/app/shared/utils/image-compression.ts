const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Redimensiona/comprime una foto en el navegador antes de subirla. Las fotos de celular
 * suelen pesar 5-15MB, muy por encima de límites razonables de subida y de datos móviles —
 * esto evita que el usuario vea un error de "archivo muy pesado" sin entender por qué.
 */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

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
}
