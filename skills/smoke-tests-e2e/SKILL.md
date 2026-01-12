# Smoke Tests E2E

Tests end-to-end de flujos críticos usando Playwright MCP.

**Solo para proyectos web** (Next.js, React, etc.). No aplica para React Native ni Swift.

## Requisito

Playwright MCP instalado:
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

## Qué Testear

Leer la spec del proyecto (`/specs/*.md`) y testear los flujos principales que describe.

**No asumir paths ni estructura** - usar Playwright MCP para explorar la app y encontrar:
- Dónde está el login/register (si tiene auth)
- Dónde están las listas/formularios (si tiene CRUD)
- Dónde está el dashboard (si tiene)

## Cómo Ejecutar

```
Usa Playwright MCP para hacer smoke test:

1. Abrí la app (buscá el puerto en package.json o probá puertos comunes)
2. Explorá la UI para entender la estructura
3. Basándote en la spec, probá los flujos principales
4. Reportá cada paso con ✅ o ❌
5. Si algo falla, describí exactamente qué esperabas vs qué pasó
```

## Output Esperado

```
SMOKE TEST
═══════════════════════════════════════════════

Flujo: Autenticación
✅ Encontré registro en /auth/signup
✅ Completé formulario
✅ Usuario creado
❌ Login falla - queda en la misma página sin error visible

Flujo: Contactos
✅ Lista carga en /contacts
✅ Pude crear contacto nuevo
✅ Pude editar
✅ Pude eliminar

═══════════════════════════════════════════════
RESULTADO: 1 flujo con problemas
```

## En el Pipeline (FASE 6.5)

Si este skill se usa en el pipeline y falla:
1. Reportar qué flujo falló y en qué paso
2. Volver a FASE 5 (Fix Loop) para arreglar
3. Re-ejecutar smoke test hasta que pase
