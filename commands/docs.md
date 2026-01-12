---
name: docs
description: Generar/actualizar CLAUDE.md del proyecto.
---

# /docs

Genera documentación para que Claude entienda el proyecto en futuras sesiones.

---

## Uso

```bash
/docs              # Generar/actualizar CLAUDE.md
/docs --readme     # También actualizar README.md
```

---

## Proceso

### 1. Analizar proyecto

```bash
# Stack
cat package.json | jq '.dependencies'

# Comandos
cat package.json | jq '.scripts'

# Estructura
ls -la
ls app/ src/ components/ lib/ 2>/dev/null
```

### 2. Detectar convenciones

```bash
# Client components
grep -r "use client" --include="*.tsx" -l | head -5

# ORM
grep -r "drizzle\|prisma" --include="*.ts" -l | head -3

# Auth
grep -r "next-auth\|clerk\|supabase" --include="*.ts" -l | head -3
```

### 3. Generar CLAUDE.md

```markdown
# [Nombre del proyecto]

## Qué es
[Una oración]

## Stack
- **Framework:** [detectado]
- **DB:** [detectado]
- **Auth:** [detectado]
- **UI:** [detectado]

## Comandos
```bash
pnpm run dev       # [descripción]
pnpm run build     # [descripción]
pnpm test          # [descripción]
```

## Estructura
```
app/              # [qué hay]
components/       # [qué hay]
lib/              # [qué hay]
```

## Convenciones

### Componentes
- [convención detectada]
- [convención detectada]

### API
- [convención detectada]

### Base de datos
- [convención detectada]

## NO hacer ❌
- [anti-pattern del proyecto]
- [error común a evitar]

## Estado actual
- ✅ [qué funciona]
- ⏳ [qué está en progreso]
- ❌ [qué falta]

## Variables de entorno
```
DATABASE_URL=
NEXTAUTH_SECRET=
```
```

### 4. Validar

- [ ] Comandos existen en package.json
- [ ] Carpetas mencionadas existen
- [ ] Convenciones reflejan código real
- [ ] No hay información inventada

---

## Output

```
CLAUDE.md actualizado ✅

Detectado:
- Stack: Next.js 15, PostgreSQL, Drizzle, NextAuth
- Comandos: 6 scripts
- Estructura: 4 carpetas principales
- Convenciones: 8 reglas
- Anti-patterns: 4

Claude ahora tiene contexto del proyecto.
```
