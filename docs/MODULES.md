# Guía de Repartición de Módulos (Integración de Endpoints)

## Resumen

- **Objetivo**: Cada desarrollador integra un conjunto de endpoints de la API y entrega: modelos/`schemas`, servicios, hooks y tests.
- **Formato**: Módulos independientes por dominio (ej.: `fuentes`, `patentes`, `registros`, `boletines`, `usuarios`).
- **Basado en**: patrones del repo (`src/services/*`, `src/lib/utils.ts`, `src/schemas`, `src/types`).

---

## Estructura recomendada por módulo

Cada módulo debe incluir:

- `src/services/<module>.ts` — funciones que llaman la API (server actions o helpers).
- `src/schemas/<module>.ts` — validaciones Zod/TS para payloads (ya hay `src/schemas`).
- `src/types/<module>.ts` — tipos TS (si el repo usa `src/types`, agregarlos ahí).
- `src/hooks/use<Module>.ts` — hooks para uso en componentes (fetching, mutaciones).
- `src/components/<Module>/` — UI específica (si aplica).
- `src/__tests__/<module>.test.ts` — tests unitarios/integ para servicios y hooks.
- Documentación corta en: `docs/modules/<module>.md` (opcional).

### Ejemplo de mapeo (por módulo)

**Módulo: `fuentes`**

- `src/services/fuente.ts` (ya existe en repo — útil como ejemplo).
- `src/schemas/fuentes.ts` (existente).
- `src/types/fuente.ts` (añadir tipo si falta).
- `src/hooks/useFuentes.ts` (nuevo).

---

## ⚠️ Archivos/zonas que NO deben tocar

- **`src/lib/utils.ts`** — contiene `axiosInstance` y utilidades centrales; si se necesita, **extender** con nuevas utilidades, pero no romper la configuración actual (baseURL, withCredentials).
- **`src/constants/backendURL.ts`** — punto único para la URL del backend.
- **Rutas y constantes en `src/constants/*`** — evitan inconsistencias.
- **`src/middleware.ts`** y configuración de Next (p.ej. `next.config.mjs`) — cambios requieren coordinación.
- **Archivos de schemas existentes: `src/schemas/*`** — si se modifica la firma, avisar al equipo y actualizar consumidores.
- **Archivos en `app/`** que tienen lógica de routing/layout — coordinar antes de cambios.

---

## Convenciones y reglas generales

### 1. Uso de `axiosInstance`

- Reusar `axiosInstance` de `src/lib/utils.ts` para llamadas HTTP.
- **NO** crear nuevos clientes de axios con configuraciones diferentes sin consenso del equipo.

### 2. Formato de respuesta de servicios

Todas las funciones en `src/services/*` deben devolver una forma consistente:

- **Resultado exitoso**: `{ success: T }`
- **Error controlado**: `{ error: string | { message: string; code?: number } }`

### 3. Validaciones

- Usar **Zod** (o patrón existente) en `src/schemas` para validar entradas antes de enviar al backend.

### 4. Tipado estricto

- Crear/usar tipos en `src/types` y exportarlos desde `index` si es necesario.

### 5. Server vs Client

- **Acciones que requieren cookies/credenciales y lógica segura** → `"use server"` o llamadas desde server actions.
- **Data fetching para UI** → hooks en cliente; preferir técnicas del repo (fetch + revalidation).

### 6. Revalidación

- Usar `revalidatePath` cuando se modifica contenido mostrado por rutas estáticas (como se hace en `fuente.ts`).

### 7. Manejo de errores

- Devolver mensajes amigables y loggear detalles en consola/monitor si procede.

---

## Plantilla de archivos (snippets)

### 1. `src/lib/apiClient.ts` — opcional: envoltorio de axios para estandarizar errores

```typescript
// src/lib/apiClient.ts
import { axiosInstance } from "@/lib/utils";

type ApiResult<T> = { success?: T; error?: { message: string; code?: number } };

export const apiGet = async <T>(path: string, params?: any): Promise<ApiResult<T>> => {
	try {
		const { data } = await axiosInstance.get<T>(path, { params });
		return { success: data };
	} catch (err: any) {
		return { error: { message: err?.response?.data?.message ?? "Error", code: err?.response?.status } };
	}
};

export const apiPost = async <T, B = any>(path: string, body: B): Promise<ApiResult<T>> => {
	try {
		const { data } = await axiosInstance.post<T>(path, body);
		return { success: data };
	} catch (err: any) {
		return { error: { message: err?.response?.data?.message ?? "Error", code: err?.response?.status } };
	}
};

export const apiPut = async <T, B = any>(path: string, body: B): Promise<ApiResult<T>> => {
	try {
		const { data } = await axiosInstance.put<T>(path, body);
		return { success: data };
	} catch (err: any) {
		return { error: { message: err?.response?.data?.message ?? "Error", code: err?.response?.status } };
	}
};

export const apiDelete = async <T>(path: string): Promise<ApiResult<T>> => {
	try {
		const { data } = await axiosInstance.delete<T>(path);
		return { success: data };
	} catch (err: any) {
		return { error: { message: err?.response?.data?.message ?? "Error", code: err?.response?.status } };
	}
};
```

### 2. Plantilla de servicio por módulo (server action estilo repo)

```typescript
// src/services/<module>.ts
"use server";

import { apiPost, apiGet, apiPut, apiDelete } from "@/lib/apiClient";
import { revalidatePath } from "next/cache";
import { routes } from "@/constants/routes"; // si aplica
import { TInsertModuleSchema, TUpdateModuleSchema } from "@/schemas/<module>";

export const createItem = async (payload: TInsertModuleSchema) => {
	const resp = await apiPost<{ id: number }>("create-item", payload);
	if (resp.success) {
		revalidatePath(routes.someRoute); // si se necesita
		return { success: "Creado correctamente", data: resp.success };
	}
	return { error: resp.error?.message ?? "Error al crear" };
};

export const fetchItems = async () => {
	const resp = await apiGet<ItemType[]>("list-items");
	if (resp.success) return { success: resp.success };
	return { error: resp.error?.message ?? "Error" };
};

export const updateItem = async (payload: TUpdateModuleSchema) => {
	const resp = await apiPut<{ id: number }>(`update-item/${payload.id}`, payload);
	if (resp.success) {
		revalidatePath(routes.someRoute);
		return { success: "Actualizado correctamente" };
	}
	return { error: resp.error?.message ?? "Error al actualizar" };
};

export const deleteItem = async (id: number) => {
	const resp = await apiDelete(`delete-item/${id}`);
	if (resp.success) {
		revalidatePath(routes.someRoute);
		return { success: "Eliminado correctamente" };
	}
	return { error: resp.error?.message ?? "Error al eliminar" };
};
```

### 3. Plantilla `schema` (Zod)

```typescript
// src/schemas/<module>.ts
import { z } from "zod";

export const InsertModuleSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	url: z.string().url("URL inválida"),
	description: z.string().optional(),
	// ... más campos según API
});

export type TInsertModuleSchema = z.infer<typeof InsertModuleSchema>;

export const UpdateModuleSchema = InsertModuleSchema.extend({
	id: z.number(),
});

export type TUpdateModuleSchema = z.infer<typeof UpdateModuleSchema>;

export const DeleteModuleSchema = z.object({
	id: z.number(),
});

export type TDeleteModuleSchema = z.infer<typeof DeleteModuleSchema>;
```

### 4. Tipos TypeScript

```typescript
// src/types/<module>.ts
export interface ModuleItem {
	id: number;
	title: string;
	url: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface ModuleListResponse {
	items: ModuleItem[];
	total: number;
	page: number;
	per_page: number;
}
```

### 5. Hook de cliente para consumo (opcional con SWR/React Query o fetch)

```typescript
// src/hooks/use<Module>.ts
import useSWR from "swr";
import { apiGet } from "@/lib/apiClient";
import { ModuleItem } from "@/types/<module>";

const fetcher = (path: string) => apiGet<ModuleItem[]>(path).then((res) => res.success);

export const useItems = () => {
	const { data, error, isValidating, mutate } = useSWR<ModuleItem[]>("/list-items", fetcher);

	return {
		items: data,
		error,
		loading: !data && !error,
		isValidating,
		refresh: mutate,
	};
};
```

### 6. Ejemplo mínimo de test (jest)

```typescript
// src/__tests__/<module>.test.ts
import { createItem, fetchItems } from "@/services/<module>";
import { axiosInstance } from "@/lib/utils";

jest.mock("@/lib/utils");

describe("<module> service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("creates item successfully", async () => {
		const mockData = { id: 1 };
		(axiosInstance.post as jest.Mock).mockResolvedValue({ data: mockData });

		const res = await createItem({
			title: "Test",
			url: "https://example.com",
		} as any);

		expect(res).toHaveProperty("success");
		expect(axiosInstance.post).toHaveBeenCalledWith("create-item", expect.any(Object));
	});

	it("fetches items successfully", async () => {
		const mockItems = [{ id: 1, title: "Item 1" }];
		(axiosInstance.get as jest.Mock).mockResolvedValue({ data: mockItems });

		const res = await fetchItems();

		expect(res).toHaveProperty("success");
		expect(res.success).toEqual(mockItems);
	});

	it("handles errors gracefully", async () => {
		(axiosInstance.post as jest.Mock).mockRejectedValue({
			response: { data: { message: "Error de validación" }, status: 400 },
		});

		const res = await createItem({ title: "", url: "" } as any);

		expect(res).toHaveProperty("error");
	});
});
```

---

## ✅ Checklist por historia/tarea (para cada dev)

- [ ] Crear/actualizar `src/schemas/<module>.ts` (validación de entrada).
- [ ] Añadir tipos en `src/types/<module>.ts`.
- [ ] Implementar funciones en `src/services/<module>.ts` (seguir forma `{ success | error }`).
- [ ] Si hay UI: component/es en `src/components/<Module>/`.
- [ ] Agregar hook en `src/hooks/use<Module>.ts` si consume desde cliente.
- [ ] Tests:
  - Unit tests para servicios en `src/__tests__/<module>.test.ts`.
  - Mockear `axiosInstance` para pruebas.
- [ ] Documentar en `docs/modules/<module>.md` (endpoints, payloads, respuestas esperadas).
- [ ] Crear PR con descripción: endpoints integrados, archivos añadidos/modificados, cómo probar manualmente.

---

## Buenas prácticas técnicas y recomendaciones

### Reutilización

- Reusar `axiosInstance` y no crear nuevos clients con otra configuración sin consenso.

### Separación de responsabilidades

- Evitar lógica de presentación en `services/*`. `services` solo habla con la API.

### Comunicación

- Todos los cambios que afecten rutas públicas o revalidación deben comunicar a quien mantiene `app/` (layout/routes).

### Consistencia

- Consistencia en mensajes de error (traducir/estandarizar).

### Testing

- Tests: cubrir happy path y errores más probables (400/500).

### Code Review

- Revisiones: cada PR debe incluir un snippet de cómo ejecutar manualmente y qué endpoints se probaron.

---

## Plantillas de archivos a crear (lista concreta)

| Archivo                          | Prioridad     | Descripción      |
| -------------------------------- | ------------- | ---------------- |
| `src/services/<module>.ts`       | **Requerido** | Funciones de API |
| `src/schemas/<module>.ts`        | **Requerido** | Validaciones Zod |
| `src/types/<module>.ts`          | Recomendado   | Tipos TypeScript |
| `src/hooks/use<Module>.ts`       | Recomendado   | Hooks de cliente |
| `src/components/<Module>/...`    | Si aplica     | Componentes UI   |
| `src/__tests__/<module>.test.ts` | **Requerido** | Tests unitarios  |

---

## Sugerencia de reparto entre el equipo (ejemplo para 4 devs)

| Dev       | Módulo                       | Endpoints                  | Complejidad |
| --------- | ---------------------------- | -------------------------- | ----------- |
| **Dev A** | `fuentes`                    | CRUD completo, monitoreo   | Media       |
| **Dev B** | `patentes`                   | Listar, filtrar, download  | Media       |
| **Dev C** | `registros`                  | Paginación + formatos      | Alta        |
| **Dev D** | `boletines` + `estadísticas` | Mutaciones + revalidations | Media-Alta  |

---

## Revisión y flujo de PR

### PR debe incluir:

1. **Nombre del módulo** y endpoints cubiertos.
2. **Archivos añadidos/modificados** listados.
3. **Comandos para ejecutar tests** unitarios relevantes.
4. **Pasos manuales para validar** (ej.: crear recurso con payload X).

### Reviewer debe validar:

- Tipos/schemas correctos y consistentes.
- Que `axiosInstance` sea usado (no nuevos clientes).
- Tests pasan y cubren casos principales.
- Código sigue convenciones del repo.

### Merge:

- Sólo cuando tests pasan y al menos **1 aprobación** de otro dev.

---

## Pasos siguientes recomendados (operacionales)

1. **Asignar módulos y fechas de entrega** a cada desarrollador.
2. **Cada dev crea un PR por módulo** con plantilla de comprobación.
3. **Reunión breve (15 min)** para alinear `revalidatePaths` y rutas que podrían verse afectadas.
4. **Daily standup** para reportar avances y bloqueos.
5. **Code review cruzado** entre desarrolladores antes de merge.

---

## Comandos útiles

### Ejecutar tests

```bash
# Todos los tests
pnpm test

# Tests de un módulo específico
pnpm test <module>

# Tests con coverage
pnpm test --coverage
```

### Linter y formateo

```bash
# Ejecutar linter
pnpm lint

# Fix automático
pnpm lint --fix
```

### Desarrollo local

```bash
# Servidor de desarrollo
pnpm dev

# Build de producción
pnpm build
```

---

## Recursos adicionales

- [Documentación de Zod](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [SWR Documentation](https://swr.vercel.app/)
- [Jest Testing](https://jestjs.io/docs/getting-started)

---

## Contacto y soporte

Para dudas o bloqueos:

- **Slack**: Canal #frontend-team
- **Daily standup**: 9:00 AM
- **Tech lead**: [Nombre del lead]

---

**Última actualización**: 26 de noviembre de 2025
