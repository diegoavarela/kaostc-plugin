---
name: do
description: Pipeline completo. Orquesta agentes desde spec hasta deploy.
---

# /do

Orquesta el pipeline completo de desarrollo usando agentes especializados.

---

## Uso

```bash
/do "crear sistema de login"
/do "agregar filtros a la lista de contactos"
```

---

## Pipeline

```
/do "feature"
    │
    ├──▶ FASE 1: SPEC
    │    Invocar: spec agent
    │    ⏸️ Esperar aprobación
    │
    ├──▶ FASE 2: PLAN
    │    Crear plan de implementación
    │    ⏸️ Esperar aprobación
    │
    ├──▶ FASE 3: DEV
    │    Invocar: dev agent
    │
    ├──▶ FASE 4: TEST
    │    Invocar: test agent
    │
    ├──▶ FASE 5: FIX (si hay failures)
    │    Invocar: fix agent
    │    Loop máximo 3 veces
    │
    ├──▶ FASE 6: REVIEW
    │    Invocar: review agent
    │    Si FAIL → volver a FASE 3
    │
    ├──▶ FASE 7: COMMIT
    │    Invocar: devops agent
    │    ⏸️ Confirmar commit
    │
    └──▶ FASE 8: DOCS
         Invocar: writer agent
```

---

## FASE 1: SPEC ⏸️

**Invocar spec agent:**
```
Use the spec agent to create a specification for: [feature]
```

El spec agent:
1. Lee skills: architecture, api-design
2. Hace preguntas
3. Escribe spec en `.claude/specs/`

**Esperar:** "¿Aprobás la spec?"

---

## FASE 2: PLAN ⏸️

Crear plan de implementación:

```markdown
# Plan: [feature]

## Archivos a crear
1. path/to/file.ts - [qué hace]
2. path/to/component.tsx - [qué hace]

## Archivos a modificar
1. path/to/existing.ts - [qué cambiar]

## Orden de implementación
1. [paso 1]
2. [paso 2]
3. [paso 3]

## Dependencias nuevas
- [paquete] - [para qué]
```

Guardar en `.claude/plans/[feature].md`

**Esperar:** "¿Aprobás el plan?"

---

## FASE 3: DEV

**Invocar dev agent:**
```
Use the dev agent to implement the plan in .claude/plans/[feature].md
```

El dev agent:
1. Lee skills: nextjs-clean, database-rules, performance, error-handling, auth-patterns, layouts
2. Implementa siguiendo el plan
3. Verifica que compila

---

## FASE 4: TEST

**Invocar test agent:**
```
Use the test agent to write and run tests for the spec in .claude/specs/[feature].md
```

El test agent:
1. Lee skill: testing-patterns
2. Escribe tests basados en criterios de aceptación
3. Corre los tests

---

## FASE 5: FIX

Si hay tests que fallan:

**Invocar fix agent:**
```
Use the fix agent to fix the failing tests
```

El fix agent:
1. Lee skills: error-handling, testing-patterns
2. Diagnostica el error
3. Arregla (máximo 3 intentos)

Si después de 3 intentos sigue fallando → parar y reportar.

---

## FASE 6: REVIEW

**Invocar review agent:**
```
Use the review agent to validate the implementation against spec and plan
```

El review agent:
1. Lee skills: code-quality, security, premium-ui, performance
2. Valida contra spec y plan
3. Genera reporte

**Si FAIL:** Volver a FASE 3 con el feedback.
**Si PASS:** Continuar.

---

## FASE 7: COMMIT ⏸️

**Invocar devops agent:**
```
Use the devops agent to commit the changes
```

El devops agent:
1. Lee skills: git-workflow, vercel-deploy
2. Verifica build y tests
3. Prepara commit

**Esperar:** "¿Confirmar commit?"

---

## FASE 8: DOCS

**Invocar writer agent:**
```
Use the writer agent to update documentation if needed
```

El writer agent:
1. Revisa si hay cambios relevantes
2. Actualiza README.md y/o CLAUDE.md si es necesario

---

## Output Final

```
✅ DONE: [feature]

Spec: .claude/specs/[feature].md
Plan: .claude/plans/[feature].md
Tests: X passed
Commit: [hash] [message]
Docs: [actualizado/sin cambios]

Agentes usados: spec → dev → test → fix(X) → review → devops → writer
```

---

## Flags

```bash
/do "feature" --no-test    # Saltar tests
/do "feature" --no-commit  # No commitear al final
```
