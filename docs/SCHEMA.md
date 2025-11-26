# Esquemas de Datos del Proyecto (Frontend)

**Fecha de actualización**: 26 de noviembre de 2025

Este documento describe todos los modelos de datos y esquemas de validación utilizados en el frontend del Observatorio. Úsalo para comparar con el backend y asegurar consistencia entre ambos sistemas.

---

## Tabla de Contenido

1. [Fuentes](#fuentes)
2. [Ejes Temáticos](#ejes-temáticos)
3. [Boletines](#boletines)
4. [Usuarios](#usuarios)
5. [Patentes](#patentes)
6. [Registros](#registros)
7. [Notas Importantes](#notas-importantes)

---

## Fuentes

### Schema (Zod) - `src/schemas/fuentes.ts`

#### InsertFuenteSchema

```typescript
{
  title: string (min: 1),
  organization: string (min: 1),
  editores: string (min: 1),
  frequency: number (min: 1),
  url: string (formato URL),
  materia: string (min: 1),
  id_eje: number (min: 1),
  is_monitoring: boolean
}
```

#### UpdateFuenteSchema

```typescript
{
  id: number,
  title: string (min: 1),
  organization: string (min: 1),
  editores: string (min: 1),
  frequency: number (min: 1),
  url: string (formato URL),
  materia: string (min: 1),
  id_eje: number (min: 1),
  is_monitoring: boolean
}
```

#### DeleteFuenteSchema

```typescript
{
	id: number;
}
```

### Tipo (TypeScript) - `src/types/fuente.ts`

```typescript
interface Fuente {
	id: number;
	title: string;
	organization: string;
	frequency: number;
	is_monitoring: boolean;
	editores: string;
	materia: string;
	url: string;
	id_eje: number | null;
}
```

### Endpoints API

- `POST /insert-fuente` - Crear fuente
- `PUT /edit-fuente` - Editar fuente
- `DELETE /delete-fuente/:id` - Eliminar fuente
- `GET /start-monitoring/:id` - Iniciar monitoreo
- `GET /stop-monitoring/:id` - Detener monitoreo

---

## Ejes Temáticos

### Schema (Zod) - `src/schemas/ejes.ts`

#### InsertEjeSchema

```typescript
{
  nombre_eje: string (min: 1),
  esta_activo: boolean
}
```

#### UpdateEjeSchema

```typescript
{
  id_eje: number,
  nombre_eje: string (min: 1),
  esta_activo: boolean
}
```

#### DeleteEjeSchema

```typescript
{
	id_eje: number;
}
```

### Tipo (TypeScript) - `src/types/ejeTEmatico.ts`

```typescript
interface EjeTematico {
	id_eje: number;
	nombre_eje: string;
	esta_activo: boolean;
}
```

### Endpoints API

- `POST /insert-eje` - Crear eje temático
- `PUT /edit-eje` - Editar eje temático
- `DELETE /delete-eje/:id` - Eliminar eje temático

---

## Boletines

### Schema (Zod) - `src/schemas/boletines.ts`

#### CreateBoletinSchema

```typescript
{
  title: string (min: 1),
  image?: File (opcional),
  theme: number (positivo),
  published_by: number (positivo),
  labels?: string[] (opcional),
  content: string (min: 1),
  attached_document?: File (opcional)
}
```

### Tipo (TypeScript) - `src/types/boletin.ts`

```typescript
interface Boletin {
	id: number;
	title: string;
	image: string | null;
	theme: {
		id_eje: number;
		nombre_eje: string | null;
		esta_activo: boolean;
	} | null;
	published_by: {
		id: number;
		username: string;
		email: string;
		first_name: string;
		last_name: string;
	} | null;
	labels: Record<string, any> | null;
	attached_document: string | null;
	content: string;
	publication_date: string; // ISO format
}

interface GetBoletinesResponse {
	boletines: Boletin[];
	total_pages: number;
	total_boletines: number;
}
```

### Endpoints API

- `POST /boletines/create` - Crear boletín (multipart/form-data)
- `GET /boletines` - Listar boletines (con paginación)

---

## Usuarios

### Schema (Zod) - `src/schemas/user.ts`

#### LoginSchema

```typescript
{
  username: string (min: 3, max: 20),
  password: string (min: 8, debe tener: minúscula, mayúscula, número)
}
```

#### SignUpSchema

```typescript
{
  email: string (formato email),
  username: string (min: 3, max: 20),
  first_name: string (min: 1),
  last_name: string (min: 1),
  organization: string,
  password: string (min: 8, debe tener: minúscula, mayúscula, número),
  confirmPassword: string (min: 8, debe coincidir con password),
  role: string (min: 1)
}
```

#### EditUserSchema

```typescript
{
  id: number,
  email: string (formato email),
  username: string (min: 3, max: 20),
  first_name: string (min: 1),
  last_name: string (min: 1),
  organization: string,
  role: string (min: 1)
}
```

#### DeleteUserSchema

```typescript
{
	id: number;
}
```

### Tipos (TypeScript) - `src/types/user.ts`

```typescript
type UserRole = "admin" | "user" | "observador" | "directivo";

interface User {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	isActive: boolean;
	is_superuser: boolean;
	userprofile: {
		role: UserRole;
		organization: string;
	};
}

interface AuthUser {
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	role: UserRole;
	id: number;
}
```

### Endpoints API

- `POST /login` - Autenticación
- `POST /signup` - Registro de usuario
- `PUT /edit-user` - Editar usuario
- `DELETE /delete-user/:id` - Eliminar usuario

---

## Patentes

### Tipo (TypeScript) - `src/types/patente.ts`

```typescript
interface Patente {
	id: string;
	abstract: string;
	description: string;
	claims: string;
	patent_office: string;
	url: string;
	sourceData?: Fuente | null;
	fuente: number;
}
```

### Endpoints API

- (Necesita documentar endpoints específicos)

---

## Registros

### Tipo (TypeScript) - `src/types/registro.ts`

```typescript
interface Registros {
	id: number;
	header: { [key: string]: string };
	metadata: string;
	day: number;
	month: number;
	year: number;
	source?: Fuente | null;
}

interface FormattedRegistros {
	title: string;
	creators: string;
	subject: string;
	description: string;
	publisher: string;
	date: string;
	type: string;
	format: string;
	identifier: string;
	language: string;
	rights: string;
	source: string;
	relation: string;
	id: number;
}
```

### Endpoints API

- (Necesita documentar endpoints específicos)

---

## Notas Importantes

### Inconsistencias detectadas

1. **Naming conventions mixtas**:

   - Fuentes usa: `id`, `id_eje`
   - Ejes usa: `id_eje`
   - Usuarios usa: `id`
   - **Recomendación**: Estandarizar a `id` para claves primarias

2. **Campos opcionales vs requeridos**:

   - En `Fuente`, `id_eje` puede ser `null` en el tipo pero es requerido (min: 1) en el schema
   - **Recomendación**: Sincronizar schemas con tipos

3. **Formatos de fecha**:

   - `Boletin.publication_date`: string ISO
   - `Registros`: `day`, `month`, `year` separados
   - **Recomendación**: Unificar a formato ISO o timestamp

4. **Metadata en Registros**:

   - El tipo define `metadata` como `string` pero se parsea como JSON
   - **Recomendación**: Definir tipo específico para metadata parseada

5. **Relaciones anidadas**:
   - `Boletin` incluye objetos completos de `theme` y `published_by`
   - `Patente` y `Registros` usan `sourceData` opcional
   - **Recomendación**: Documentar si backend devuelve relaciones expandidas o solo IDs

### Campos que faltan schema de validación

- **Patentes**: No tiene schema de inserción/actualización
- **Registros**: No tiene schema de inserción/actualización

### Comparación con Backend (Checklist)

Al comparar con el backend, verificar:

- [ ] Nombres de campos coinciden (camelCase vs snake_case)
- [ ] Tipos de datos coinciden (string, number, boolean)
- [ ] Campos opcionales vs requeridos
- [ ] Longitudes máximas/mínimas
- [ ] Formatos (URLs, emails, fechas)
- [ ] Relaciones (IDs vs objetos anidados)
- [ ] Valores por defecto
- [ ] Enumeraciones permitidas (ej: roles de usuario)

### Validaciones adicionales recomendadas

```typescript
// Ejemplo para estandarizar validaciones
const COMMON_VALIDATIONS = {
	email: z.string().email().max(255),
	url: z.string().url().max(2000),
	shortText: z.string().min(1).max(255),
	mediumText: z.string().min(1).max(1000),
	longText: z.string().min(1).max(10000),
	positiveInt: z.number().int().positive(),
	nonNegativeInt: z.number().int().nonnegative(),
};
```

---

## Próximos pasos

1. **Sincronizar con backend**: Comparar este documento con los modelos Django/FastAPI
2. **Completar schemas faltantes**: Crear schemas para Patentes y Registros
3. **Estandarizar naming**: Decidir convención única (camelCase o snake_case)
4. **Documentar endpoints**: Completar lista de endpoints disponibles con payloads y respuestas
5. **Agregar validaciones comunes**: Crear utilidades de validación reutilizables

---

**Mantenimiento**: Este documento debe actualizarse cada vez que se modifique un schema o tipo.
