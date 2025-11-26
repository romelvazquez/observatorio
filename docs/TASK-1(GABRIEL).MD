**1. Crear sistema de errores tipados**

```typescript
// src/lib/errors.ts
export class ApiError extends Error {
	constructor(message: string, public code: number, public endpoint: string, public details?: any) {
		super(message);
		this.name = "ApiError";
	}
}

export class ValidationError extends Error {
	constructor(message: string, public fields?: Record<string, string>) {
		super(message);
		this.name = "ValidationError";
	}
}

export class NetworkError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NetworkError";
	}
}
```

**2. Crear manejador de errores**

```typescript
// src/lib/errorHandler.ts
import { ApiError, NetworkError, ValidationError } from "./errors";

export const handleApiError = (error: any, endpoint: string) => {
	// Error de red
	if (!error.response) {
		return new NetworkError("No se pudo conectar con el servidor");
	}

	// Error de validación (400)
	if (error.response.status === 400) {
		return new ValidationError(error.response.data?.message || "Datos inválidos", error.response.data?.fields);
	}

	// Error de autorización (401, 403)
	if (error.response.status === 401 || error.response.status === 403) {
		return new ApiError("No autorizado", error.response.status, endpoint);
	}

	// Error del servidor (500+)
	if (error.response.status >= 500) {
		return new ApiError("Error del servidor", error.response.status, endpoint, error.response.data);
	}

	// Error genérico
	return new ApiError(error.response.data?.message || "Error desconocido", error.response.status, endpoint);
};
```

**3. Actualizar servicios**

```typescript
// Ejemplo: src/services/fuente.ts
import { handleApiError } from "@/lib/errorHandler";

export const insertFuente = async (data: TSInsertFuenteSchema) => {
	try {
		await axiosInstance.post("insert-fuente", data);
		revalidatePath(routes.adminFuentes);
		return { success: "Fuente insertada correctamente" };
	} catch (error) {
		const apiError = handleApiError(error, "insert-fuente");
		console.error("[insertFuente]", apiError);
		return {
			error: apiError.message,
			code: apiError instanceof ApiError ? apiError.code : undefined,
		};
	}
};
```

### Checklist

- [ ] Crear clases de error personalizadas
- [ ] Implementar manejador central de errores
- [ ] Actualizar todos los servicios para usar el manejador
- [ ] Agregar logging consistente
- [ ] Crear tests para manejo de errores
- [ ] Documentar en README
