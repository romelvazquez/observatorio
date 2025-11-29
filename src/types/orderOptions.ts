import {
  RegistroOrder,
  PatenteOrder,
  EjeOrder,
  BoletinOrder,
} from '@/types/enums';

export const orderOptions = {
  REGISTROS: Object.values(RegistroOrder),
  PATENTES: Object.values(PatenteOrder),
  EJES: Object.values(EjeOrder),
  BOLETINES: Object.values(BoletinOrder),
} as const;