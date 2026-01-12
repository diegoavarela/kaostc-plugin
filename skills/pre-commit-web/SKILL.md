# Pre-Commit (Web/Vercel)

Verificaciones obligatorias antes de commit en proyectos web.

## Regla Principal

**CERO warnings. CERO errores.**

No se commitea código con:
- Errores de TypeScript
- Warnings de TypeScript
- Errores de ESLint
- Warnings de ESLint

## Comandos a ejecutar

```bash
# 1. TypeScript - debe pasar sin output
npx tsc --noEmit

# 2. ESLint - debe pasar sin output
npx eslint . --max-warnings=0

# 3. Build - debe completar
npm run build
```

Si cualquiera falla → NO commitear.

## Proceso

```bash
# Verificación completa antes de commit
npm run typecheck    # o npx tsc --noEmit
npm run lint         # o npx eslint . --max-warnings=0
npm run build        # verificar que compila

# Si todo pasa
git add .
git commit -m "feat: ..."
```

## Scripts recomendados en package.json

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix",
    "build": "next build",
    "precommit": "npm run typecheck && npm run lint && npm run build"
  }
}
```

## Errores comunes y fixes

### TypeScript: implicit any
```typescript
// ❌ Error: Parameter 'x' implicitly has 'any' type
function process(x) { ... }

// ✅ Fix
function process(x: string) { ... }
```

### TypeScript: unused variable
```typescript
// ❌ Error: 'x' is declared but never used
const x = 5;

// ✅ Fix - remover o usar
// o prefixear con _ si es intencional
const _unusedButNeeded = 5;
```

### ESLint: react-hooks/exhaustive-deps
```typescript
// ❌ Warning: React Hook useEffect has missing dependency
useEffect(() => {
  fetchData(id);
}, []);

// ✅ Fix
useEffect(() => {
  fetchData(id);
}, [id]);
```

### ESLint: no-unused-vars
```typescript
// ❌ Warning: 'helper' is defined but never used
import { helper } from './utils';

// ✅ Fix - remover import
```

### ESLint: prefer-const
```typescript
// ❌ Warning: 'x' is never reassigned, use 'const'
let x = 5;

// ✅ Fix
const x = 5;
```

## Para el DevOps Agent

Antes de hacer `git commit`:

1. Detectar si es proyecto web (existe package.json con next/react/vite)
2. Ejecutar verificaciones:
   ```bash
   npm run typecheck 2>&1 || echo "TYPECHECK_FAILED"
   npm run lint 2>&1 || echo "LINT_FAILED"
   npm run build 2>&1 || echo "BUILD_FAILED"
   ```
3. Si alguna falla → PARAR y reportar errores
4. Si todo pasa → proceder con commit

## Output esperado

```
## Pre-commit Check

TypeScript: ✓ No errors
ESLint: ✓ No warnings
Build: ✓ Success

Listo para commit.
```

o

```
## Pre-commit Check

TypeScript: ✗ 3 errors
- src/api/users.ts(15,3): 'data' implicitly has 'any' type
- src/api/users.ts(23,1): unused variable 'temp'
- src/components/Card.tsx(8,5): missing return type

ESLint: (skipped - fix TS first)
Build: (skipped)

Arreglá los errores antes de commitear.
```

## Cuándo NO aplica

- Proyectos Swift/iOS (no tienen ESLint)
- Scripts Python
- Archivos de configuración

Solo aplica a proyectos con `package.json` que tengan TypeScript y ESLint configurados.
