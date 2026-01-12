# Pre-commit - React Native

Checks antes de commit para proyectos React Native / Expo.

## Checklist Pre-commit

```bash
# 1. TypeScript - CERO errores
npx tsc --noEmit

# 2. ESLint - CERO warnings
npx eslint . --ext .ts,.tsx --max-warnings=0

# 3. Tests
npm test

# 4. Build check (opcional pero recomendado)
npx expo export --platform ios --output-dir /tmp/build-check
```

## TypeScript Config

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

## ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'build/',
    'android/',
    'ios/',
  ],
}
```

## Prettier Config

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "prepare": "husky install",
    "pre-commit": "npm run typecheck && npm run lint && npm run test"
  }
}
```

## Husky + lint-staged

```bash
# Instalar
npm install -D husky lint-staged

# Configurar husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Jest Config

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/app/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Test
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build-check:
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Export bundle
        run: npx expo export --platform all
```

## EAS Build Config

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Errores Comunes

### 1. Import order

```typescript
// ❌ MAL
import { useTheme } from '@/shared/theme'
import React from 'react'
import { View } from 'react-native'

// ✅ BIEN
import React from 'react'
import { View } from 'react-native'
import { useTheme } from '@/shared/theme'
```

### 2. Unused imports

```typescript
// ❌ MAL
import { useState, useEffect, useCallback } from 'react' // useCallback no usado

// ✅ BIEN
import { useState, useEffect } from 'react'
```

### 3. Any types

```typescript
// ❌ MAL
const handlePress = (data: any) => {}

// ✅ BIEN
interface PressData {
  id: string
  value: number
}
const handlePress = (data: PressData) => {}
```

### 4. Console.log

```typescript
// ❌ MAL
console.log('debug:', data)

// ✅ BIEN - usar __DEV__ o remover
if (__DEV__) {
  console.log('debug:', data)
}
```

### 5. Missing deps en hooks

```typescript
// ❌ MAL - ESLint warning
useEffect(() => {
  fetchData(userId)
}, []) // Missing userId

// ✅ BIEN
useEffect(() => {
  fetchData(userId)
}, [userId])
```

## Script de Pre-commit Manual

```bash
#!/bin/bash
# scripts/pre-commit.sh

set -e

echo "🔍 Running TypeScript check..."
npx tsc --noEmit

echo "🔍 Running ESLint..."
npx eslint . --ext .ts,.tsx --max-warnings=0

echo "🔍 Running Prettier check..."
npx prettier --check "src/**/*.{ts,tsx}"

echo "🧪 Running tests..."
npm test -- --passWithNoTests

echo "✅ All checks passed!"
```

## .gitignore

```gitignore
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Local env files
.env*.local

# TypeScript
*.tsbuildinfo

# Testing
coverage/

# IDE
.idea/
.vscode/

# Build
android/
ios/
```

## Checklist Final

Antes de commit:
- [ ] `npm run typecheck` pasa
- [ ] `npm run lint` pasa sin warnings
- [ ] `npm test` pasa
- [ ] No hay `console.log` (excepto en __DEV__)
- [ ] No hay `any` types
- [ ] Imports ordenados
- [ ] Código formateado con Prettier
