---
name: vercel-deploy
description: Reglas para que el build de Vercel no falle. Se aplica automáticamente en FASE 7.
---

# Vercel Deploy Constraints

Reglas para evitar que el build rompa en Vercel.

**Nota:** En FASE 7, el plugin verifica automáticamente las env vars y las sube a Vercel antes del push.

## Pre-push obligatorio

- **MUST** correr `pnpm run build` local antes de push
- **MUST** correr `pnpm run lint` antes de push
- **NEVER** pushear sin verificar que compila

```bash
# Antes de cada push
pnpm run lint
pnpm run build
```

## TypeScript

- **MUST** resolver todos los errores de TypeScript (Vercel usa strict)
- **NEVER** usar `// @ts-ignore` sin comentario explicativo
- **NEVER** usar `any` - usar `unknown` y type guards
- **MUST** tipar todas las funciones explícitamente

```typescript
// ❌ PROHIBIDO
const data: any = await fetch()
// @ts-ignore
const x = thing.prop

// ✅ CORRECTO
const data: unknown = await fetch()
if (isValidData(data)) {
  // usar data
}
```

## Variables de entorno

- **MUST** tener todas las env vars en Vercel Dashboard
- **MUST** usar `NEXT_PUBLIC_` prefix para vars del cliente
- **NEVER** hardcodear secrets
- **SHOULD** tener `.env.example` con todas las vars necesarias

```typescript
// ❌ PROHIBIDO - rompe en Vercel si no está la var
const url = process.env.API_URL // puede ser undefined

// ✅ CORRECTO
const url = process.env.API_URL
if (!url) throw new Error('API_URL not configured')
```

## Dependencies

- **MUST** dependencias de runtime en `dependencies`
- **MUST** dependencias de build en `devDependencies`
- **NEVER** importar algo que está solo en devDependencies desde código de runtime

```json
{
  "dependencies": {
    "next": "...",
    "react": "...",
    "drizzle-orm": "..."  // Se usa en runtime
  },
  "devDependencies": {
    "typescript": "...",
    "eslint": "...",
    "drizzle-kit": "..."  // Solo para generar migraciones
  }
}
```

## pnpm específico

- **MUST** commitear `pnpm-lock.yaml`
- **NEVER** mezclar lockfiles (no package-lock.json + pnpm-lock.yaml)
- **MUST** declarar TODO lo que importás (pnpm es estricto)

```typescript
// ❌ Esto rompe con pnpm si lodash es dep transitiva
import _ from 'lodash'  // No está en tu package.json

// ✅ Agregar a package.json primero
pnpm add lodash
```

## Server vs Client

- **NEVER** importar módulos de Node.js en client components
- **MUST** usar `'use client'` o `'use server'` explícitamente cuando sea ambiguo

```typescript
// ❌ PROHIBIDO en client component
import fs from 'fs'
import path from 'path'

// ✅ CORRECTO - solo en server components/actions
'use server'
import fs from 'fs'
```

## Imports y exports

- **MUST** usar extensiones en imports si es ESM puro
- **NEVER** mezclar require() y import en el mismo archivo
- **SHOULD** usar barrel exports con cuidado (pueden aumentar bundle)

## Build output

- **SHOULD** verificar que no hay páginas que excedan 250KB inicial
- **SHOULD** usar dynamic imports para código pesado
- **MUST** verificar que las rutas API no excedan timeout (10s en hobby)

## Checklist pre-deploy

```bash
# 1. Lint
pnpm run lint

# 2. Types
pnpm run typecheck  # o tsc --noEmit

# 3. Build
pnpm run build

# 4. Verificar env vars en Vercel Dashboard
```

## Errores comunes y soluciones

### "Module not found"
→ Dependencia no declarada en package.json. Agregar con `pnpm add`

### "Type error"
→ Vercel usa TypeScript strict. Arreglar el tipo, no ignorar.

### "Cannot find module 'X'" en runtime
→ X está en devDependencies pero se usa en runtime. Mover a dependencies.

### "Environment variable not found"
→ Agregar en Vercel Dashboard → Settings → Environment Variables

## Referencias

Cuando el build falla, consultar:

- **Errores comunes:** https://vercel.com/docs/errors
- **Troubleshooting builds:** https://vercel.com/docs/deployments/troubleshoot-a-build
- **Framework guides:** https://vercel.com/docs/frameworks
- **Next.js específico:** https://nextjs.org/docs/messages
- **Environment variables:** https://vercel.com/docs/projects/environment-variables

## ORMs y Databases

### Prisma

Prisma necesita configuración especial en Vercel (serverless):

- **MUST** usar Prisma Accelerate o adapter para serverless
- **MUST** tener `"postinstall": "prisma generate"` en scripts
- **SHOULD** usar connection pooling (PgBouncer o Prisma Accelerate)

```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

**Si falla con Prisma:**
1. Verificar que `postinstall` existe
2. Verificar adapter: https://www.prisma.io/docs/orm/overview/databases/vercel-postgres
3. Ver guía Vercel: https://vercel.com/docs/storage/vercel-postgres/using-an-orm#prisma

### Drizzle

Drizzle generalmente funciona sin config extra en Vercel.

- **SHOULD** usar Vercel Postgres o Neon para mejor compatibilidad
- Ver: https://vercel.com/docs/storage/vercel-postgres/using-an-orm#drizzle

### Errores comunes de DB en Vercel

| Error | Causa | Solución |
|-------|-------|----------|
| `PrismaClientInitializationError` | Falta generate | Agregar postinstall |
| `Connection timeout` | Sin pooling | Usar Accelerate/PgBouncer |
| `Too many connections` | Serverless crea muchas | Connection pooling |
| `ECONNREFUSED` | DB no accesible | Verificar que IP de Vercel tiene acceso |
