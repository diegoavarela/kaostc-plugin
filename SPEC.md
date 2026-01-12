# KaosTC Plugin - Especificación Técnica

> Plugin de Claude Code para desarrollo automatizado con equipo de agentes especializados.

---

## Resumen Ejecutivo

**KaosTC** es un plugin que transforma una idea en código listo para PR mediante un pipeline de 10 fases con agentes especializados.

| Métrica | Valor |
|---------|-------|
| Comandos | 2 |
| Agentes | 12 |
| Skills | 15 |
| Stacks soportados | Web (Next.js) / iOS (SwiftUI) |

---

## Comandos

### `/do "descripción"`

Pipeline completo de desarrollo de features.

```
/do "quiero notificaciones push"
```

**Fases:**

| # | Fase | Agente | Checkpoint |
|---|------|--------|------------|
| 0 | Setup | - | Auto |
| 1 | Spec | spec | ⏸️ Espera OK |
| 2 | Plan | plan | ⏸️ Espera OK |
| 2.5 | Service Check | service-check | ⏸️ Si falla, pregunta qué hacer |
| 3 | Implementación | dev | Auto |
| 4 | Tests | test | Auto |
| 5 | Fix Loop | fix | Auto (max 3) |
| 6 | Code Simplifier | plugin externo | Auto |
| 7 | Review | review | Auto (max 2 ciclos) |
| 7.5 | UI Review | ui-review | Auto (fix loop max 2, solo si hay UI) |
| 8 | Commit | devops | Auto (fix loop si TS/ESLint falla, para si mismo error 3x) |
| 9 | Docs | writer | Auto |

**Output:** Branch con código, tests, docs, listo para PR.

---

### `/map`

Onboarding de proyecto existente.

```
/map
```

**Fases:**

| # | Fase | Agente | Output |
|---|------|--------|--------|
| 0 | Setup | - | Stack detectado |
| 1 | Análisis | mapper | Estructura identificada |
| 2 | CLAUDE.md | mapper | `/CLAUDE.md` |
| 3 | Dependencias | mapper | Análisis para dev |
| 4 | Impact Map | dev | `/impact-map.json` |
| 5 | Specs existentes | spec | `/specs/existing/*.md` |
| 6 | Arquitectura | mapper | `/docs/architecture.md` |

**Output:** Proyecto documentado, listo para `/do`.

---

## Agentes

### Pipeline Principal

| Agente | Rol | Skills | Tools |
|--------|-----|--------|-------|
| **spec** | Product Owner - define QUÉ construir | auth-patterns, layouts (condicional según tipo de tarea) | Read, Write, Glob, Grep |
| **plan** | Arquitecto - diseña CÓMO construir | auth-patterns, layouts, swiftui-clean, nextjs-clean, database-rules, api-design | Read, Write, Bash, Glob, Grep |
| **service-check** | Verificador - valida servicios externos | - | Read, Bash, Glob, Grep |
| **dev** | Developer - implementa código | **DINÁMICOS** según archivos del plan | Read, Write, Edit, Bash, Glob, Grep |
| **test** | QA - escribe y corre tests | testing-patterns | Read, Write, Edit, Bash, Glob, Grep |
| **fix** | Debugger - repara failures | **HEREDADOS** de dev | Read, Write, Edit, Bash, Glob, Grep |
| **review** | Gate - valida código vs plan | **HEREDADOS** de dev + code-quality | Read, Glob, Grep |
| **ui-review** | Gate - valida UI visual | premium-ui, design-system, auth-patterns, layouts, [stack-skill] | Read, Glob, Grep, Bash |
| **devops** | DevOps - git + pre-commit | git-workflow, pre-commit-web | Bash, Read, Write, Glob |
| **writer** | Tech Writer - mantiene docs | - | Read, Write, Edit, Glob, Grep |

#### Skills Dinámicos (dev)

El pipeline selecciona skills para dev basándose en los archivos del plan:

| Archivos en el plan | Skills cargados |
|---------------------|-----------------|
| app/, components/, pages/ | premium-ui, design-system, layouts |
| api/, routes/ | api-design, error-handling |
| db/, prisma/, drizzle/ | database-rules |
| middleware/, auth/ | auth-patterns, security |
| Siempre | [stack-skill], performance |

### Onboarding

| Agente | Rol | Skills | Tools |
|--------|-----|--------|-------|
| **mapper** | Arqueólogo - analiza código existente | swiftui-clean, nextjs-clean, database-rules, api-design | Read, Write, Bash, Glob, Grep |

### On-Demand (no parte del pipeline automático)

| Agente | Rol | Skills | Invocación |
|--------|-----|--------|------------|
| **ui** | UI Developer - crea componentes | **POR STACK**: premium-ui[-swiftui], design-system[-swiftui], layouts[-swiftui] | `@ui "descripción"` |

*Nota: `ui-review` ahora es parte del pipeline (FASE 7.5) pero también se puede invocar manualmente con `@ui-review [archivo]`.*

---

## Skills

### UI/UX (Web)

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **premium-ui** | UI que impresiona. Dark mode, glass morphism, gradientes. | dev, fix, review, ui, ui-review |
| **design-system** | Sistema de diseño. Tokens CSS, colores, tipografía. | dev, fix, review, ui, ui-review |
| **layouts** | Patrones de layout. Sidebar, top nav, responsive. | spec, plan, dev, fix, review, ui, ui-review |

### UI/UX (Swift - macOS/iOS)

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **premium-ui-swiftui** | Materials, vibrancy, SF Symbols, spacing nativo. | dev, fix, review, ui, ui-review |
| **design-system-swiftui** | Color assets, tokens Swift, typography. | dev, fix, review, ui, ui-review |
| **layouts-swiftui** | NavigationSplitView, TabView, size classes. | spec, plan, dev, fix, review, ui, ui-review |

### Compartidos

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **auth-patterns** | Flujos de auth correctos. Landing vs login, providers, avatar dropdown. | spec, plan, dev, fix, review, ui, ui-review |

### Arquitectura

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **nextjs-clean** | Clean Architecture para Next.js/Vercel. 5 capas. | plan, dev, fix, review, ui, ui-review |
| **swiftui-clean** | Clean Architecture para SwiftUI. 3 capas, MVVM. | plan, dev, fix, review, ui, ui-review |

### Código

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **database-rules** | ORM obligatorio, migraciones versionadas, no SQL raw. | plan, dev, fix, review |
| **error-handling** | Errores tipados, fail fast, contexto útil. | dev, fix, review |
| **security** | No secrets en código, env vars, sanitización. | dev, fix, review |
| **performance** | Evitar N+1, lazy loading, memoization. | dev, fix, review |
| **code-quality** | Blockers: SQL raw, secrets, console.log. Warnings: funciones largas, any types. | review |
| **api-design** | REST conventions, status codes, pagination, versionado. | plan, review |

### Testing & DevOps

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **testing-patterns** | AAA, un concepto por test, mocks apropiados. | test |
| **git-workflow** | Conventional commits, branch naming, PR flow. | devops |
| **pre-commit-web** | TypeScript + ESLint cero errores/warnings. | devops (web) |
| **pre-commit-swift** | SwiftLint, SwiftFormat, xcodebuild. | devops (ios/mac) |

### Estructura

| Skill | Descripción | Usado por |
|-------|-------------|-----------|
| **monorepo** | Estructura multi-app, packages compartidos, turborepo. | spec, plan, dev |

---

## Flujo de Datos

### Stack Detection (FASE 0)

```
package.json existe → STACK = "web"
Package.swift o *.xcodeproj existe → STACK = "ios"
```

**STACK se detecta UNA vez y se pasa a todos los agentes.**

### Impact Analysis (Dev → Test)

```
Dev implementa
    ↓
Dev trackea archivos tocados
    ↓
Dev analiza dependencias (imports)
    ↓
Dev identifica features impactadas
    ↓
Dev actualiza impact-map.json
    ↓
Dev entrega a Test:
  - Archivos modificados
  - Features impactadas
  - Tests a priorizar
```

### Archivos Generados

| Archivo | Generado por | Descripción |
|---------|--------------|-------------|
| `/specs/[feature].md` | spec | Spec de feature nueva |
| `/specs/existing/[modulo].md` | spec (modo doc) | Spec de código existente |
| `/plans/[feature].md` | plan | Plan técnico de implementación |
| `/impact-map.json` | dev | Mapa de dependencias |
| `/CLAUDE.md` | mapper | Contexto para Claude |
| `/docs/architecture.md` | mapper | Arquitectura documentada |
| `.gitignore` | devops | Archivos a ignorar (git) |
| `.vercelignore` | devops | Archivos a ignorar (deploy) |

---

## Límites y Retry Logic

| Fase | Límite | Comportamiento |
|------|--------|----------------|
| Fix Loop | 3 intentos | STOP si 3/3 fallan |
| Review | 2 ciclos | STOP si 2/2 fallan |

---

## Output Format

### Durante ejecución

```
══════════════════════════════════════════════════
  FASE X: [Nombre]
──────────────────────────────────────────────────
  Agente   : [nombre]
  Skills   : [lista]
  Input    : [archivo/s]
══════════════════════════════════════════════════
```

### Status Report Final

**Éxito:**
```
┌─────────────────────────────────────────────────┐
│  ✅ DONE: [feature]                             │
├────────────┬────────────────────────────────────┤
│ Stack      │ web                                │
│ Branch     │ feature/X → PR ready               │
├────────────┼────────────────────────────────────┤
│ Código     │ +N ~M archivos                     │
│ Tests      │ ✓ X passed                         │
│ Commit     │ abc123 feat: X                     │
├────────────┼────────────────────────────────────┤
│ Duración   │ Xm Ys                              │
└────────────┴────────────────────────────────────┘
```

**Fallo:**
```
┌─────────────────────────────────────────────────┐
│  ❌ STOPPED: [feature]                          │
├────────────┬────────────────────────────────────┤
│ Fase       │ X ([nombre])                       │
│ Error      │ [descripción]                      │
│ Progreso   │ ████████░░ X%                      │
└────────────┴────────────────────────────────────┘
```

---

## Instalación

```bash
# Descomprimir
tar -xzvf kaostc-plugin.tar.gz

# Copiar a proyecto (local)
cp -r kaostc-plugin/* tu-proyecto/.claude/

# O instalar global
cp -r kaostc-plugin/agents/* ~/.claude/agents/
cp -r kaostc-plugin/commands/* ~/.claude/commands/
cp -r kaostc-plugin/skills/* ~/.claude/skills/
```

---

## Extensiones Opcionales

| Plugin | Integración | Instalación |
|--------|-------------|-------------|
| code-simplifier (Anthropic) | Se invoca automáticamente en FASE 6 si está instalado | `claude plugin install code-simplifier` |

---

## Skills de Negocio (Usuario)

El usuario puede agregar skills custom de reglas de negocio:

```markdown
# skills/financial-rules/SKILL.md

## Reglas
- Margen nunca > 100%
- Usar Decimal.js para montos
- IVA siempre al final

## Features impactadas
- checkout
- invoicing
```

Los agentes `dev`, `test`, `fix`, y `review` cargarán estos skills automáticamente.

---

## Flujos de Uso

### Proyecto nuevo

```
/do "primera feature"
    ↓
(pipeline completo)
    ↓
Dev crea impact-map.json inicial
    ↓
Branch listo para PR
```

### Proyecto existente (sin mapear)

```
/map
    ↓
(onboarding)
    ↓
/do "nueva feature"
    ↓
(pipeline con contexto)
```

### Feature incremental

```
/do "nueva feature"
    ↓
Dev consulta impact-map.json
    ↓
Dev actualiza impact-map.json
    ↓
Test prioriza features impactadas
    ↓
Branch listo para PR
```

---

## Limitaciones Conocidas

1. **Stack**: Solo web (Next.js) e iOS (SwiftUI) soportados
2. **Testing iOS**: Requiere simulador configurado
3. **Code Simplifier**: Plugin externo opcional
4. **Impact Map**: Se genera/actualiza solo con uso del plugin

---

## Changelog

| Versión | Cambios |
|---------|---------|
| 1.0 | Release inicial: 2 comandos, 11 agentes, 11 skills |
