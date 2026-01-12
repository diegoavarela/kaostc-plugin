---
name: test
description: Escribir y correr tests. Invoca al test agent.
---

# /test

Escribe y corre tests invocando al test agent.

## Uso

```bash
/test                    # Tests para cambios recientes
/test "auth"             # Tests para módulo específico
/test --coverage         # Con reporte de coverage
```

## Proceso

**Invocar test agent:**
```
Use the test agent to write and run tests for [target]
```

El test agent:
1. Lee skill: testing-patterns
2. Identifica qué testear
3. Escribe tests
4. Corre tests
5. Reporta resultados

## Si hay failures

Automáticamente invoca fix agent:
```
Use the fix agent to fix the failing tests
```

Máximo 3 intentos de fix.

## Output

```
🧪 TESTS

Escritos: X tests
Pasaron: X
Fallaron: X
Coverage: X%
```
