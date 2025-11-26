---
Tarea 2: Crear capa de API unificada

### Responsable: 1 desarrollador

### Tiempo estimado: 3-4 días

### Prioridad: 🔴 Alta

### Problema actual

- Uso directo de `axiosInstance` en todos los servicios
- Código duplicado para manejo de errores
- No hay interceptores centralizados
- Falta de retry logic

### Solución propuesta

#### Archivos a crear:

1. `src/lib/apiClient.ts` - Cliente HTTP mejorado
2. `src/lib/apiInterceptors.ts` - Interceptores de request/response
3. `src/types/api.ts` - Tipos compartidos

#### Archivos a modificar:

- `src/lib/utils.ts` - Mantener axiosInstance pero encapsular
- Todos `src/services/*.ts`

#### Implementación

**1. Cliente API mejorado**

```typescript
// src/lib/apiClient.ts
import { axiosInstance } from "@/lib/utils";
import { handleApiError } from "@/lib/errorHandler";

export type ApiResponse<T> = { success: true; data: T; message?: string } | { success: false; error: string; code?: number };

class ApiClient {
	async get<T>(path: string, params?: any): Promise<ApiResponse<T>> {
		try {
			const { data } = await axiosInstance.get<T>(path, { params });
			return { success: true, data };
		} catch (error) {
			const apiError = handleApiError(error, path);
			return { success: false, error: apiError.message, code: apiError.code };
		}
	}

	async post<T, B = any>(path: string, body: B): Promise<ApiResponse<T>> {
		try {
			const { data } = await axiosInstance.post<T>(path, body);
			return { success: true, data };
		} catch (error) {
			const apiError = handleApiError(error, path);
			return { success: false, error: apiError.message, code: apiError.code };
		}
	}

	async put<T, B = any>(path: string, body: B): Promise<ApiResponse<T>> {
		try {
			const { data } = await axiosInstance.put<T>(path, body);
			return { success: true, data };
		} catch (error) {
			const apiError = handleApiError(error, path);
			return { success: false, error: apiError.message, code: apiError.code };
		}
	}

	async delete<T>(path: string): Promise<ApiResponse<T>> {
		try {
			const { data } = await axiosInstance.delete<T>(path);
			return { success: true, data };
		} catch (error) {
			const apiError = handleApiError(error, path);
			return { success: false, error: apiError.message, code: apiError.code };
		}
	}
}

export const apiClient = new ApiClient();
```

**2. Implementar interceptores**

```typescript
// src/lib/apiInterceptors.ts
import { axiosInstance } from "@/lib/utils";

// Request interceptor: agregar tokens, logging
axiosInstance.interceptors.request.use(
	(config) => {
		console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
		// Agregar token si existe
		const token = localStorage.getItem("auth_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor: refresh tokens, logging
axiosInstance.interceptors.response.use(
	(response) => {
		console.log(`[API Response] ${response.config.url} - ${response.status}`);
		return response;
	},
	async (error) => {
		console.error(`[API Error] ${error.config?.url}`, error.response?.status);

		// Retry lógica para 401
		if (error.response?.status === 401) {
			// Intentar refresh token
			// ...
		}

		return Promise.reject(error);
	}
);
```

### Checklist

- [ ] Crear cliente API con tipos genéricos
- [ ] Implementar interceptores
- [ ] Migrar servicios a usar apiClient
- [ ] Agregar retry logic para errores de red
- [ ] Tests para apiClient
- [ ] Documentar uso

---
