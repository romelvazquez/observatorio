import type { RegistroSubject } from './enums';
export type Fuente = {
    id: number;
    title: string;
    organization: string;
    frequency: number;
    is_monitoring: boolean;
    editores: string;
    materia: RegistroSubject;
    url: string;
    id_eje: number | null;
  }
  