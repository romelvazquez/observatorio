import type { Fuente } from './fuente';
import type { PatenteOffice } from './enums';

  export type Patente = {
    id: string;
    abstract: string;
    description: string;
    claims: string;
    patent_office: PatenteOffice;
    url: string;
    sourceData?: Fuente | null;
    fuente: number;
  };
  

  