---
name: business-rules
description: Cómo implementar y validar reglas de negocio en código.
---

# Business Rules

Guía para implementar reglas de negocio de forma validable.

## Principios

- MUST tener reglas documentadas en `.claude/rules/business.md`
- MUST implementar validaciones cerca de donde se usa el dato
- MUST usar el mismo lenguaje que el negocio (no términos técnicos)
- NEVER hardcodear valores de negocio (usar constantes o config)
- SHOULD tener tests para cada regla crítica

## Dónde implementar validaciones

### Límites y cuotas

```typescript
// constants/limits.ts
export const LIMITS = {
  FREE_WORKSPACES: 3,
  PRO_WORKSPACES: 10,
  FREE_CONTACTS: 100,
  PRO_CONTACTS: Infinity,
} as const

// Uso
if (user.plan === 'free' && count >= LIMITS.FREE_WORKSPACES) {
  throw new Error('Límite de workspaces alcanzado')
}
```

### Validación de datos

```typescript
// schemas/user.ts
export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})
```

### Reglas de estado

```typescript
// No permitir borrar usuario con workspaces activos
async function deleteUser(userId: string) {
  const workspaces = await db.query.workspaces.findMany({
    where: eq(workspaces.ownerId, userId)
  })
  
  if (workspaces.length > 0) {
    throw new Error('No se puede eliminar usuario con workspaces activos')
  }
  
  await db.delete(users).where(eq(users.id, userId))
}
```

## Estructura de reglas

```markdown
# Reglas de Negocio

## [Dominio]
- [Regla en lenguaje simple]
- [Regla en lenguaje simple]

## Ejemplos buenos:
- "Usuario máximo 3 workspaces en plan free"
- "Email único en todo el sistema"
- "Precio siempre en centavos"

## Ejemplos malos:
- "Validar MAX_WORKSPACES" (muy técnico)
- "El email debe ser válido" (muy vago)
- "No duplicados" (no dice de qué)
```

## Validación con /rules check

El comando `/rules check` usa estas reglas para:
1. Buscar código relacionado con cada regla
2. Verificar que la validación existe
3. Reportar violaciones

Para que `/rules check` funcione bien:
- Usar términos consistentes (si la regla dice "workspace", el código debe decir "workspace")
- Reglas específicas y medibles
- Una regla por línea
