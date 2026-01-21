# KaosTC Web Plugin v7.1.0

Plugin de Claude Code para desarrollo web con Next.js + Vercel.

---

## Instalación

```bash
# 1. Descomprimir
tar -xzvf kaostc-plugin.tar.gz

# 2. Copiar a tu proyecto
cp -r kaostc-plugin/* tu-proyecto/.claude/
```

La estructura queda:

```
tu-proyecto/
├── .claude/
│   ├── commands/
│   ├── agents/
│   ├── skills/
│   └── rules/
├── src/
└── ...
```

Claude Code detecta automáticamente `.claude/` y los comandos quedan disponibles.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  COMANDOS - Definen workflows, orquestan el trabajo         │
└─────────────────────────────────────────────────────────────┘
                            │ invocan
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENTES - Ejecutan tareas con contexto aislado             │
└─────────────────────────────────────────────────────────────┘
                            │ leen
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  SKILLS - Conocimiento especializado, reglas, patrones      │
└─────────────────────────────────────────────────────────────┘
```

- **Comandos** = QUÉ hacer y en qué orden
- **Agentes** = QUIÉN lo hace
- **Skills** = CÓMO hacerlo

---

## Comandos (10)

| Comando | Qué hace |
|---------|----------|
| `/do "feature"` | Pipeline completo: spec → plan → dev → test → fix → review → commit → docs |
| `/feature "cambio"` | Feature rápida en proyecto existente |
| `/review` | Code review |
| `/test` | Escribir y correr tests |
| `/ui "componente"` | Mejorar UI |
| `/build` | Build local (`--deploy` para Vercel) |
| `/smoke` | Tests E2E con Playwright |
| `/rules` | Ver/agregar/validar reglas de negocio |
| `/map` | Mapear proyecto existente |
| `/version` | Ver versión del plugin |

---

## Agentes (8)

| Agente | Rol | Skills |
|--------|-----|--------|
| **spec** | Product Owner | architecture, api-design |
| **dev** | Developer | nextjs-clean, database-rules, performance, error-handling, auth-patterns, layouts, business-rules |
| **test** | QA Engineer | testing-patterns |
| **fix** | Debugger | error-handling, testing-patterns |
| **review** | Code Reviewer | code-quality, security, premium-ui, performance, business-rules |
| **ui** | UI Specialist | premium-ui, layouts |
| **devops** | DevOps | git-workflow, vercel-deploy |
| **writer** | Tech Writer | - |

---

## Skills (15)

| Skill | Qué contiene |
|-------|--------------|
| api-design | Diseño de APIs REST |
| architecture | Arquitectura de proyecto |
| auth-patterns | Patrones de autenticación |
| business-rules | Reglas de negocio |
| code-quality | Calidad de código |
| database-rules | ORM, migraciones, no SQL raw |
| error-handling | Manejo de errores |
| git-workflow | Git, commits, PRs |
| layouts | Layouts de UI (sidebar, stack, tabs) |
| nextjs-clean | Next.js patterns, Server Components |
| performance | Performance, N+1, paginación |
| premium-ui | UI premium, estados, animaciones |
| security | Seguridad, secrets, validación |
| testing-patterns | Patrones de testing |
| vercel-deploy | Deploy a Vercel, env vars |

---

## Flujo: /do

```
/do "crear login"
    │
    ├──▶ FASE 1: SPEC ⏸️
    │    spec agent → hace preguntas, escribe spec
    │
    ├──▶ FASE 2: PLAN ⏸️
    │    crea plan de implementación
    │
    ├──▶ FASE 3: DEV
    │    dev agent → implementa código
    │
    ├──▶ FASE 4: TEST
    │    test agent → escribe y corre tests
    │
    ├──▶ FASE 5: FIX
    │    fix agent → arregla failures (máx 3)
    │
    ├──▶ FASE 6: REVIEW
    │    review agent → valida vs spec/plan
    │    Si FAIL → volver a FASE 3
    │
    ├──▶ FASE 7: COMMIT ⏸️
    │    devops agent → git commit
    │
    └──▶ FASE 8: DOCS
         writer agent → actualiza README/CLAUDE.md
```

⏸️ = espera aprobación del usuario

---

## Flujo: /feature

Versión rápida para proyectos existentes:

```
/feature "agregar botón exportar"
    │
    ├──▶ FASE 1: ENTENDER ⏸️
    │    lee código, crea mini-spec
    │
    ├──▶ FASE 2: DEV
    │    dev agent → implementa
    │
    ├──▶ FASE 3: VERIFY
    │    pnpm run dev + verificar
    │
    ├──▶ FASE 4: REVIEW
    │    review agent → review rápido
    │
    └──▶ FASE 5: COMMIT
         devops agent → commit
```

---

## Estructura de Directorios

```
kaostc-plugin/
├── commands/           # 10 workflows
│   ├── do.md
│   ├── feature.md
│   ├── review.md
│   ├── test.md
│   ├── ui.md
│   ├── build.md
│   ├── smoke.md
│   ├── rules.md
│   ├── map.md
│   └── version.md
│
├── agents/             # 8 ejecutores
│   ├── spec.md
│   ├── dev.md
│   ├── test.md
│   ├── fix.md
│   ├── review.md
│   ├── ui.md
│   ├── devops.md
│   └── writer.md
│
├── skills/             # 15 conocimientos
│   ├── api-design/
│   ├── architecture/
│   ├── auth-patterns/
│   ├── business-rules/
│   ├── code-quality/
│   ├── database-rules/
│   ├── error-handling/
│   ├── git-workflow/
│   ├── layouts/
│   ├── nextjs-clean/
│   ├── performance/
│   ├── premium-ui/
│   ├── security/
│   ├── testing-patterns/
│   └── vercel-deploy/
│
├── rules/
│   └── business.md
│
├── README.md
├── CHANGELOG.md
└── VERSION
```

---

## Uso Típico

```bash
# Nueva app desde cero
/do "crear CRM para gestión de contactos"

# Agregar feature a proyecto existente
/feature "agregar filtro por fecha"

# Mejorar UI
/ui "sidebar"

# Code review
/review

# Tests
/test

# Deploy
/build --deploy

# Ver reglas de negocio
/rules

# Validar código contra reglas
/rules check
```

---

## Requisitos

- Claude Code con suscripción Max ($200/mes)
- Node.js 18+
- pnpm
- Para `/smoke`: Playwright MCP instalado

---

## Changelog

### v7.1.0
- Arquitectura restaurada: comandos → agentes → skills
- 8 agentes con skills asignados
- 10 comandos que orquestan agentes
- 15 skills de conocimiento
- Eliminados comandos redundantes (/ux, /docs)

---

## Contributing

Las contribuciones son bienvenidas. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

Todas las PRs son revisadas y mergeadas por [@diegoavarela](https://github.com/diegoavarela).

---

## License

MIT License - Ver [LICENSE](LICENSE) para más detalles.

Copyright (c) 2026 Diego Varela
