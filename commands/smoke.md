---
name: smoke
description: Smoke tests E2E con Playwright MCP.
---

# /smoke

Tests E2E exploratorios usando Playwright MCP.

## Requisito

Playwright MCP instalado:
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

## Uso

```bash
/smoke               # Smoke test básico
/smoke "login"       # Smoke test de flujo específico
```

## Proceso

### 1. Verificar que la app esté corriendo

```bash
curl -s http://localhost:3000 > /dev/null
```

Si no está corriendo, avisar.

### 2. Tests básicos

Con Playwright MCP:

1. **Navegación**: La app carga
2. **Links**: Los links principales funcionan
3. **Forms**: Los forms se pueden llenar
4. **Errores**: No hay errores en consola

### 3. Si se especifica flujo

```bash
/smoke "login"
```

Testear el flujo completo:
- Ir a /login
- Llenar email
- Llenar password
- Click en submit
- Verificar redirect

## Output

```
🔥 SMOKE TEST

App: http://localhost:3000
Status: ✅ Running

Tests:
✅ Homepage carga
✅ Navegación funciona
✅ [flujo específico]

Errores de consola: 0
Warnings: 2
```

## Si encuentra errores

Reportar:
- URL donde falló
- Qué acción falló
- Error message

NO intenta arreglar automáticamente.
