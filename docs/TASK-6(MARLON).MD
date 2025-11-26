## Tarea 8: Implementar testing completo

### Responsable: 1-2 desarrolladores

### Tiempo estimado: 5 días

### Prioridad: 🔴 Alta

### Problema actual

- Cobertura de tests baja
- Tests existentes incompletos
- No hay tests de integración
- Falta de mocks reutilizables

### Solución propuesta

#### Archivos a crear:

1. `src/__tests__/utils/mocks.ts` - Mocks reutilizables
2. `src/__tests__/utils/testHelpers.ts` - Helpers
3. Tests para todos los módulos faltantes

#### Implementación

**1. Mocks reutilizables**

```typescript
// src/__tests__/utils/mocks.ts
import { Fuente } from "@/types/fuente";
import { User } from "@/types/user";

export const mockFuente: Fuente = {
	id: 1,
	title: "Fuente Test",
	organization: "Org Test",
	editores: "Editor Test",
	frequency: 7,
	url: "https://example.com",
	materia: "Materia Test",
	id_eje: 1,
	is_monitoring: false,
};

export const mockUser: User = {
	id: 1,
	username: "testuser",
	first_name: "Test",
	last_name: "User",
	email: "test@example.com",
	isActive: true,
	is_superuser: false,
	userprofile: {
		role: "user",
		organization: "Test Org",
	},
};

export const mockAxiosInstance = {
	get: jest.fn(),
	post: jest.fn(),
	put: jest.fn(),
	delete: jest.fn(),
};
```

**2. Test helpers**

```typescript
// src/__tests__/utils/testHelpers.ts
import { render } from "@testing-library/react";
import { ReactElement } from "react";

export const renderWithProviders = (ui: ReactElement) => {
	return render(ui);
	// Agregar providers necesarios (theme, context, etc.)
};

export const waitForLoadingToFinish = () => screen.findByText(/loading/i, {}, { timeout: 3000 });
```

### Checklist

- [ ] Crear mocks reutilizables
- [ ] Crear test helpers
- [ ] Tests unitarios para servicios (100%)
- [ ] Tests para hooks personalizados
- [ ] Tests de integración para flujos críticos
- [ ] Configurar coverage threshold (80%+)
- [ ] CI/CD con tests automáticos

---
