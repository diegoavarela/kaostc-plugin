# Git Workflow

Convenciones de Git para mantener historial limpio y deployable.

## Branch Strategy

### Branches principales
```
main        ← Producción, siempre deployable
develop     ← Integración (opcional, para equipos grandes)
```

### Branches de trabajo
```
feature/    ← Nueva funcionalidad
fix/        ← Bug fix
refactor/   ← Mejora sin cambio de comportamiento
docs/       ← Solo documentación
chore/      ← Mantenimiento, deps, config
```

### Naming
```bash
# ✅ CORRECTO
feature/user-authentication
fix/login-redirect-loop
refactor/extract-payment-service

# ❌ INCORRECTO
feature/auth          # Muy vago
my-branch             # Sin prefijo
Feature/UserAuth      # Mayúsculas
```

## Commits

### Conventional Commits
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
```
feat:     Nueva feature
fix:      Bug fix
refactor: Refactor sin cambio de comportamiento
docs:     Documentación
test:     Tests
chore:    Mantenimiento, deps, CI
style:    Formato, espacios (no CSS)
perf:     Mejora de performance
```

### Ejemplos
```bash
# ✅ CORRECTO
feat(auth): add biometric login support
fix(cart): prevent duplicate items on refresh
refactor(api): extract validation middleware
docs: update README with new setup steps
chore: upgrade dependencies to latest

# Con body para contexto
fix(payments): handle Stripe webhook timeout

The webhook was timing out after 10s because we were
processing synchronously. Now we acknowledge immediately
and process async.

Closes #123

# ❌ INCORRECTO
update stuff
fix bug
WIP
asdfasdf
```

### Reglas
- Imperativo: "add", no "added" o "adding"
- Sin punto al final
- < 72 caracteres en subject
- Body para el "por qué", no el "qué"

## Pull Requests

### Antes de PR
```bash
# 1. Actualizar desde main
git fetch origin
git rebase origin/main

# 2. Verificar que todo funciona
pnpm test
pnpm run lint
pnpm run build

# 3. Push
git push origin feature/my-feature
```

### PR Title
Seguir misma convención que commits:
```
feat(auth): add biometric login support
```

### PR Description Template
```markdown
## Qué cambia
Breve descripción del cambio.

## Por qué
Contexto y motivación.

## Cómo probar
1. Paso 1
2. Paso 2
3. Verificar que...

## Screenshots (si aplica)

## Checklist
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin console.logs
- [ ] Self-review completo
```

## Merge Strategy

### Squash and Merge (recomendado)
- Un commit por PR en main
- Historial limpio
- Fácil de revertir

### Merge commit
- Preserva historial completo
- Útil si los commits individuales importan

### Rebase (con cuidado)
- Historial lineal
- Puede causar problemas si no se usa bien

## Revert

```bash
# Revertir último commit
git revert HEAD

# Revertir commit específico
git revert <commit-hash>

# Revertir merge (PR completo)
git revert -m 1 <merge-commit-hash>
```

## Hotfix

```bash
# 1. Branch desde main
git checkout main
git pull
git checkout -b fix/critical-bug

# 2. Fix, commit, push
git commit -m "fix: critical security issue in auth"
git push origin fix/critical-bug

# 3. PR directo a main
# 4. Deploy inmediato
# 5. Cherry-pick a develop si existe
```

## .gitignore esenciales

### Web (Next.js/React)
```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Environment
.env
.env.local
.env.*.local

# Build
.next/
dist/
build/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Test
coverage/

# Secrets
*.pem
*.key
```

### iOS (Swift/SwiftUI)
```gitignore
# Xcode
build/
DerivedData/
*.xcuserstate
*.xccheckout
*.moved-aside
*.hmap
*.ipa
*.dSYM.zip
*.dSYM

# User settings
xcuserdata/
*.xcworkspace/xcuserdata/

# Swift Package Manager
.build/
.swiftpm/
Packages/

# CocoaPods
Pods/
Podfile.lock

# Carthage
Carthage/Build/
Carthage/Checkouts/

# OS
.DS_Store

# IDE
.idea/
*.swp

# Secrets
*.pem
*.key
*.p12
*.mobileprovision
```

## .vercelignore esenciales

```vercelignore
# Docs
*.md
docs/
specs/
plans/

# Config files no necesarios en deploy
.husky/
.github/
.vscode/
.idea/

# Tests
__tests__/
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
coverage/
jest.config.*
vitest.config.*

# Dev tools
.eslintrc*
.prettierrc*
tsconfig.*.json

# Misc
*.log
.DS_Store
```

## Crear archivos ignore

El devops agent verifica y crea estos archivos si no existen:

### .gitignore
- **web**: Usar template Web
- **ios**: Usar template iOS

### .vercelignore
- Solo para **web**
- Excluye docs, tests, y config de dev

## Hooks (automatización local)

```bash
# .husky/pre-commit
pnpm run lint
pnpm run test:changed

# .husky/commit-msg
npx commitlint --edit $1
```

## Reglas para Review/DevOps Agent

- [ ] Branch tiene prefijo correcto
- [ ] Commits siguen conventional commits
- [ ] No hay commits de merge innecesarios
- [ ] .env no está commiteado
- [ ] No hay console.logs en código final
- [ ] Tests pasan antes de merge
