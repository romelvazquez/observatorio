import type { Fuente } from './fuente';
import type {
  RegistroCreator,
  RegistroSubject,
  RegistroPublisher,
  RegistroLanguage,
  RegistroRights,
} from './enums';

export type Registros = {
  id: number;
  header: Record<string, string>; 
  metadata: string;
  day: number;
  month: number;
  year: number;
  source?: Fuente | null;
};

export type formattedRegistros = {
  title: string;
  creators: RegistroCreator;
  subject: RegistroSubject;
  description: string;
  publisher: RegistroPublisher;
  date: string;
  type: string;
  format: string;
  identifier: string;
  language: RegistroLanguage;
  rights: RegistroRights;
  source: string;
  relation: string;
  id: number;
};