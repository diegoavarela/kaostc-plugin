---
name: map
description: Mapear y documentar proyecto existente.
---

# /map

Analiza un proyecto existente y genera documentación completa.

---

## Uso

```bash
/map                 # Mapear proyecto actual
```

---

## Cuándo usar

- Proyecto heredado sin documentación
- Onboarding a proyecto nuevo
- Antes de hacer cambios grandes

---

## Proceso

### 1. Detectar stack

```bash
# Package manager
PM="pnpm"

# Framework
FRAMEWORK="next"

# DB
grep -q "drizzle" package.json && DB="drizzle"
grep -q "prisma" package.json && DB="prisma"

# Auth
grep -q "next-auth" package.json && AUTH="next-auth"
grep -q "clerk" package.json && AUTH="clerk"
```

### 2. Analizar estructura

```bash
# Carpetas principales
ls -la

# Profundidad 2
find . -maxdepth 2 -type d | grep -v node_modules | grep -v .git
```

### 3. Detectar patrones

```bash
# Componentes
ls components/ 2>/dev/null

# API routes
ls app/api/ 2>/dev/null

# Pages
ls app/ 2>/dev/null | grep -v api
```

### 4. Leer configs existentes

```bash
cat CLAUDE.md 2>/dev/null
cat README.md 2>/dev/null
cat .env.example 2>/dev/null
```

### 5. Generar documentación

Crear/actualizar:
- `CLAUDE.md` - Contexto para Claude
- `.claude/rules/business.md` - Template de reglas

---

## Output

```
PROYECTO MAPEADO
═══════════════════════════════════════════════════════════════

Stack detectado:
- Framework: Next.js 15 (App Router)
- Package Manager: pnpm
- DB: PostgreSQL + Drizzle
- Auth: NextAuth v5
- UI: Tailwind + shadcn/ui
- Testing: Vitest

Estructura:
───────────────────────────────────────────────────────────────
app/
├── (auth)/          # 3 rutas de auth
├── (dashboard)/     # 5 rutas protegidas
└── api/             # 8 endpoints
components/
├── ui/              # 12 componentes shadcn
└── features/        # 6 componentes de negocio
lib/
├── db/              # Schema + queries
└── auth.ts          # Config NextAuth

Archivos generados:
───────────────────────────────────────────────────────────────
✅ CLAUDE.md (contexto para Claude)
✅ .claude/rules/business.md (template de reglas)

Próximos pasos:
1. Revisar CLAUDE.md y corregir si algo está mal
2. Agregar reglas de negocio con /rules add
3. Ya podés usar /feature, /test, /review

═══════════════════════════════════════════════════════════════
```
