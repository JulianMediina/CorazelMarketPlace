export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  activa: boolean;
}
