import type { PaginatedResponse } from "./api";

export type Boletin = {
    id: number;
    title: string;
    image: string | null; // URL de la imagen o null
    theme: {
      id_eje: number;
      nombre_eje: string | null;
      esta_activo: boolean;
    } | null; // Tema o null si no está definido
    published_by: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
    } | null; // Usuario o null si no está definido
    labels: Record<string, any> | null; // JSON de etiquetas o null
    attached_document: string | null; // URL del documento adjunto o null
    content: string;
    publication_date: string; // Fecha en formato ISO
  };

 export type GetBoletinesResponse = PaginatedResponse<Boletin>