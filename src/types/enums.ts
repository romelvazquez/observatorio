export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  OBSERVADOR = "observador",
  DIRECTIVO = "directivo",
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

// Registros
export enum RegistroCreator {
  AUTOR_1 = "Autor 1",
  AUTOR_2 = "Autor 2",
  AUTOR_3 = "Autor 3",
}

export enum RegistroSubject {
  MATERIA_1 = "Materia 1",
  MATERIA_2 = "Materia 2",
  MATERIA_3 = "Materia 3",
}

export enum RegistroPublisher {
  EDITORIAL_1 = "Editorial 1",
  EDITORIAL_2 = "Editorial 2",
  EDITORIAL_3 = "Editorial 3",
}

export enum RegistroLanguage {
  ESPAÑOL = "Español",
  INGLÉS = "Inglés",
  FRANCÉS = "Francés",
}

export enum RegistroRights {
  DERECHO_1 = "Derecho 1",
  DERECHO_2 = "Derecho 2",
  DERECHO_3 = "Derecho 3",
}

// Patentes
export enum PatenteFuente {
  GOOGLE = "Google",
  YOUTUBE = "YouTube",
  NATURE = "Nature",
}

export enum PatenteOffice {
  JAPÓN = "Japón",
  CHINA = "China",
  USPTO = "USPTO",
}

export enum PatenteClaims {
  CLAIM_1 = "Claim 1",
  CLAIM_2 = "Claim 2",
  CLAIM_3 = "Claim 3",
}

export enum PatenteDescription {
  BREVE = "Descripción breve",
  TÉCNICA = "Descripción técnica",
  COMPLETA = "Descripción completa",
}

// Orden de columnas para cada sección

export enum RegistroOrder {
  TITLE = "Título",
  CREATOR = "Autor",
  DATE = "Fecha",
  PUBLISHER = "Editorial",
  SUBJECT = "Materia",
  DESCRIPTION = "Descripción",
}

export enum PatenteOrder {
  FUENTE_ID = "Fuente",
  URL = "URL",
  ABSTRACT = "Resumen",
  PATENT_OFFICE = "Patent Office",
  CLAIMS = "Claims",
  DESCRIPTION = "Descripción",
}

export enum EjeOrder {
  NOMBRE_EJE = "Nombre",
  ESTA_ACTIVO = "Estado",
}

export enum BoletinOrder {
  THEME = "Tema",
  PUBLISHED_BY = "Redactor",
  PUBLICATION_DATE = "Fecha",
}