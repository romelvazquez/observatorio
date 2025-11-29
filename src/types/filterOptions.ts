import {
  RegistroCreator,
  RegistroSubject,
  RegistroPublisher,
  RegistroLanguage,
  RegistroRights,
  PatenteFuente,
  PatenteOffice,
  PatenteClaims,
  PatenteDescription,
} from '@/types/enums';

export const filterOptions = {
  REGISTROS: {
    creators: Object.values(RegistroCreator),
    subject: Object.values(RegistroSubject),
    publisher: Object.values(RegistroPublisher),
    language: Object.values(RegistroLanguage),
    rights: Object.values(RegistroRights),
  },
  PATENTES: {
    fuente: Object.values(PatenteFuente),
    patent_office: Object.values(PatenteOffice),
    claims: Object.values(PatenteClaims),
    description: Object.values(PatenteDescription),
  },
} as const;