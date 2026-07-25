export interface Collection {
  id: string;
  nombre: string;
  slug: string;
  esencia: string | null;
  descripcion: string | null;
  imagenUrl: string | null;
  orden: number;
  activa: boolean;
}
