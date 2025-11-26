## Tarea 4: Mejorar tipado y consistencia

### Responsable: 1 desarrollador

### Tiempo estimado: 2-3 días

### Prioridad: 🟡 Media

### Problema actual

- Tipos desincronizados con schemas
- Campos opcionales inconsistentes
- Falta de tipos para respuestas de API
- No hay enums para valores constantes

### Solución propuesta

#### Archivos a crear:

1. `src/types/api.ts` - Tipos para respuestas API
2. `src/types/enums.ts` - Enumeraciones
3. `src/types/index.ts` - Barrel export

#### Archivos a modificar:

- Todos `src/types/*.ts`

#### Implementación

**1. Tipos de respuestas API**

```typescript
// src/types/api.ts
export interface ApiSuccessResponse<T> {
	success: true;
	data: T;
	message?: string;
}

export interface ApiErrorResponse {
	success: false;
	error: string;
	code?: number;
	fields?: Record<string, string>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
}
```

**2. Enumeraciones**

```typescript
// src/types/enums.ts
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
```
```

### Checklist

- [ ] Crear tipos para respuestas API
- [ ] Definir enumeraciones

---
