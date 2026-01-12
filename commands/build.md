---
name: build
description: Build y deploy. Invoca al devops agent.
---

# /build

Build y deploy invocando al devops agent.

## Uso

```bash
/build               # Build local
/build --deploy      # Build + deploy a Vercel
/build --fix         # Build y arreglar errores
```

## Proceso

**Invocar devops agent:**
```
Use the devops agent to build the project
```

El devops agent:
1. Lee skills: vercel-deploy
2. Corre `pnpm run build`
3. Reporta errores si hay
4. Si --deploy, sube a Vercel

## Build local

```bash
pnpm run build
```

Si hay errores:
- TypeScript errors → mostrar y ofrecer fix
- Build errors → diagnosticar causa

## Con --deploy

1. Verificar env vars en Vercel
2. Verificar que build pasa
3. `vercel --prod`

## Con --fix

Si el build falla, automáticamente intenta arreglar:
```
Use the fix agent to fix the build errors
```

Máximo 3 intentos.

## Output

```
🔨 BUILD

Status: ✅ Success / ❌ Failed
Tiempo: Xs
Errores: X

[Si deploy]
URL: https://[proyecto].vercel.app
```
