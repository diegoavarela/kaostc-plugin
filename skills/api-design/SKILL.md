# API Design

Reglas para diseño consistente de APIs.

## REST Conventions

### URLs
```
# ✅ CORRECTO
GET    /users          # Lista
GET    /users/:id      # Detalle
POST   /users          # Crear
PUT    /users/:id      # Update completo
PATCH  /users/:id      # Update parcial
DELETE /users/:id      # Eliminar

GET    /users/:id/posts    # Recursos anidados

# ❌ INCORRECTO
GET    /getUsers
POST   /createUser
GET    /user/delete/:id
```

### Plurales para colecciones
```
# ✅ CORRECTO
/users
/posts
/comments

# ❌ INCORRECTO
/user
/post
/comment
```

### Query params para filtros
```
# ✅ CORRECTO
GET /users?status=active&sort=name&limit=10&offset=20

# ❌ INCORRECTO
GET /users/active/sorted-by-name
```

## Response Format

### Estructura consistente
```typescript
// ✅ CORRECTO - Éxito
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}

// ✅ CORRECTO - Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Required" }
    ]
  }
}

// ❌ INCORRECTO - Inconsistente
{ "users": [...] }  // A veces así
{ "data": [...] }   // A veces así
{ "error": "..." }  // Error como string
```

### HTTP Status Codes
```
200 OK           - Éxito general
201 Created      - Recurso creado
204 No Content   - Éxito sin body (DELETE)
400 Bad Request  - Error de validación
401 Unauthorized - No autenticado
403 Forbidden    - No autorizado
404 Not Found    - Recurso no existe
409 Conflict     - Conflicto (ej: email duplicado)
422 Unprocessable- Error de negocio
429 Too Many Req - Rate limited
500 Internal     - Error del servidor
```

## Validación

### Input siempre validado
```typescript
// ✅ CORRECTO
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().min(0).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = createUserSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', details: result.error.issues } },
      { status: 400 }
    );
  }
  
  // Usar result.data (tipado y validado)
}
```

### Output también validado (opcional pero recomendado)
```typescript
const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  // NO incluir password, tokens, etc.
});

return Response.json({ data: userResponseSchema.parse(user) });
```

## Paginación

```typescript
// Request
GET /users?limit=10&offset=20
// o
GET /users?limit=10&cursor=abc123

// Response
{
  "data": [...],
  "meta": {
    "total": 150,
    "limit": 10,
    "offset": 20,
    "hasMore": true
  }
}
```

## Versionado

```typescript
// En URL (simple)
/api/v1/users
/api/v2/users

// O en header (más limpio)
Accept: application/vnd.api+json; version=1
```

## Server Actions (Next.js)

```typescript
'use server'

// ✅ CORRECTO - Validar, manejar errores, retornar resultado
export async function createUser(formData: FormData) {
  const result = createUserSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });
  
  if (!result.success) {
    return { error: 'Invalid input', details: result.error.flatten() };
  }
  
  try {
    const user = await db.users.create({ data: result.data });
    revalidatePath('/users');
    return { data: user };
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return { error: 'Email already exists' };
    }
    throw error;  // Re-throw errores inesperados
  }
}
```

## Documentación

Para APIs públicas:
- OpenAPI/Swagger spec
- Ejemplos de request/response
- Códigos de error posibles

Para APIs internas:
- Types de TypeScript son suficientes
- Comentarios en casos edge

## Review Agent verifica:

- [ ] URLs siguen convención REST
- [ ] Status codes correctos
- [ ] Input validado con schema
- [ ] Errores con formato consistente
- [ ] No exponer datos sensibles en response
- [ ] Paginación en listas
