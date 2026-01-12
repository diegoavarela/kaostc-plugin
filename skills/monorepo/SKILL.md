# Monorepo

Estructura y reglas para monorepos con múltiples apps.

## Estructura Base

```
proyecto/
├── apps/                    # Aplicaciones deployables
│   ├── web/                 # Next.js → Vercel
│   ├── mobile/              # React Native / Expo
│   ├── teams/               # Microsoft Teams App
│   ├── macos/               # SwiftUI macOS
│   └── ios/                 # SwiftUI iOS
│
├── packages/                # Código compartido
│   ├── shared/              # Types, utils, constants
│   ├── ui/                  # Componentes UI (web)
│   └── api-client/          # Cliente API
│
├── services/                # Backend services
│   └── api/
│
├── specs/                   # Specs (por feature, no por app)
├── plans/                   # Plans (por feature, no por app)
│
├── package.json             # Root workspaces
├── turbo.json               # Turborepo
└── pnpm-workspace.yaml
```

## Detección de Monorepo

```bash
# Es monorepo si existe:
[ -d "apps" ] && [ -f "turbo.json" -o -f "pnpm-workspace.yaml" -o -f "lerna.json" ]
```

## Apps y sus Stacks

| Carpeta | Stack | Deploy |
|---------|-------|--------|
| apps/web | Next.js | Vercel |
| apps/mobile | React Native / Expo | App Store / Play Store |
| apps/teams | Teams Toolkit | Azure |
| apps/macos | SwiftUI | Mac App Store |
| apps/ios | SwiftUI | App Store |

## Reglas

### 1. Features van a múltiples apps cuando tiene sentido

```
/do "agregar autenticación con Google"

Spec pregunta:
¿En qué apps aplica?
- [x] web
- [x] mobile
- [ ] teams (usa auth de Microsoft)
- [x] macos
```

### 2. Código compartido va a packages/

```typescript
// ❌ MAL - duplicado en cada app
// apps/web/src/utils/formatDate.ts
// apps/mobile/src/utils/formatDate.ts

// ✅ BIEN - una sola vez
// packages/shared/src/utils/formatDate.ts
```

### 3. Types compartidos

```typescript
// packages/shared/src/types/user.ts
export interface User {
  id: string
  email: string
  name: string
}

// apps/web/... 
import { User } from '@proyecto/shared'

// apps/mobile/...
import { User } from '@proyecto/shared'
```

### 4. API client compartido

```typescript
// packages/api-client/src/index.ts
export class ApiClient {
  async getUser(id: string): Promise<User> { }
  async updateUser(id: string, data: Partial<User>): Promise<User> { }
}

// apps/web/...
import { ApiClient } from '@proyecto/api-client'

// apps/mobile/...
import { ApiClient } from '@proyecto/api-client'
```

### 5. Componentes UI compartidos (solo web-like)

```typescript
// packages/ui/src/Button.tsx
// Usado por: web, teams (ambos React)
// NO usado por: mobile (React Native), macos (SwiftUI)
```

## Package.json Root

```json
{
  "name": "proyecto",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "services/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

## turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
```

## pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

## Comandos

```bash
# Desarrollo
pnpm dev                      # Todas las apps
pnpm dev --filter web         # Solo web
pnpm dev --filter mobile      # Solo mobile

# Build
pnpm build                    # Todo
pnpm build --filter web       # Solo web

# Tests
pnpm test                     # Todo
pnpm test --filter shared     # Solo shared

# Agregar dependencia
pnpm add lodash --filter web
pnpm add -D typescript --filter shared
```

## Importaciones entre Packages

```json
// apps/web/package.json
{
  "dependencies": {
    "@proyecto/shared": "workspace:*",
    "@proyecto/ui": "workspace:*",
    "@proyecto/api-client": "workspace:*"
  }
}
```

```typescript
// apps/web/src/...
import { User } from '@proyecto/shared'
import { Button } from '@proyecto/ui'
import { ApiClient } from '@proyecto/api-client'
```

## tsconfig Base

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@proyecto/shared": ["./packages/shared/src"],
      "@proyecto/ui": ["./packages/ui/src"],
      "@proyecto/api-client": ["./packages/api-client/src"]
    }
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "plugins": [{ "name": "next" }]
  },
  "include": ["src", "app"]
}
```

## Specs en Monorepo

```markdown
# specs/user-auth.md

## Feature: Autenticación de Usuario

## Apps
- [x] web
- [x] mobile
- [ ] teams (usa Microsoft auth)
- [x] macos

## Componente Compartido
- packages/api-client: métodos de auth
- packages/shared: tipos User, AuthState

## Implementación por App
- web: NextAuth.js
- mobile: expo-auth-session
- macos: ASWebAuthenticationSession
```

## Checklist

- [ ] Estructura apps/, packages/, services/
- [ ] turbo.json configurado
- [ ] Workspaces configurados (pnpm/npm/yarn)
- [ ] tsconfig.base.json con paths
- [ ] Código compartido en packages/shared
- [ ] Types compartidos
- [ ] API client compartido
- [ ] Cada app tiene su package.json
- [ ] Imports usan @proyecto/...
