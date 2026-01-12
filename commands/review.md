---
name: review
description: Code review. Invoca al review agent.
---

# /review

Ejecuta code review invocando al review agent.

## Uso

```bash
/review              # Review de cambios pendientes
/review "login"      # Review de archivos específicos
```

## Proceso

**Invocar review agent:**
```
Use the review agent to review the recent changes
```

El review agent:
1. Lee skills: code-quality, security, premium-ui, performance
2. Revisa archivos modificados
3. Genera reporte con findings

## Output

El review agent genera:
- ✅ PASS con sugerencias menores, o
- ❌ FAIL con blockers que arreglar
