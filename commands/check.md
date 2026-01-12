---
name: check
description: Validar código contra reglas de negocio.
---

# /check

Valida que el código cumpla las reglas de negocio definidas.

---

## Uso

```bash
/check                   # Validar todo contra todas las reglas
/check "usuarios"        # Validar solo reglas de usuarios
/check "app/api/"        # Validar solo ese directorio
```

---

## Requisitos

Archivo de reglas: `.claude/rules/business.md`

```markdown
# Reglas de Negocio

## Usuarios
- Usuario máximo 3 workspaces en plan free
- Email único en todo el sistema
- Contraseña mínimo 8 caracteres

## Pagos
- Precios siempre en centavos
- Solo Stripe como procesador
- Nunca guardar números de tarjeta
```

Si no existe → pedir que lo cree o usar `/rules add`.

---

## Proceso

### 1. Leer reglas

```
Read .claude/rules/business.md
```

### 2. Parsear reglas

Extraer cada regla como validación:
```
REGLA: Usuario máximo 3 workspaces en plan free
BUSCAR: Código que crea workspaces
VALIDAR: Hay check de límite antes de crear
```

### 3. Buscar código relevante

```bash
# Para cada regla, buscar código relacionado
grep -r "workspace" --include="*.ts" -l
grep -r "createWorkspace" --include="*.ts" -l
```

### 4. Validar

Para cada regla:
1. Encontrar dónde aplica
2. Verificar si se cumple
3. Reportar resultado

### 5. Generar reporte

```
VALIDACIÓN DE REGLAS DE NEGOCIO
═══════════════════════════════════════════════════════════════

Reglas validadas: 8
Cumplidas: 6 ✅
Violaciones: 2 ❌

Usuarios
───────────────────────────────────────────────────────────────
✅ Email único en todo el sistema
   Verificado: unique constraint en schema + validación en API
   
❌ Usuario máximo 3 workspaces en plan free
   Archivo: app/api/workspaces/route.ts
   Problema: No hay validación de límite antes de crear
   Línea 45: await db.insert(workspaces).values(data)
   
   Sugerencia:
   const count = await db.select().from(workspaces).where(eq(userId, user.id))
   if (user.plan === 'free' && count >= 3) throw new Error('Límite alcanzado')

✅ Contraseña mínimo 8 caracteres
   Verificado: Zod schema con .min(8)

Pagos
───────────────────────────────────────────────────────────────
✅ Precios siempre en centavos
   Verificado: Tipo "price" es integer en schema
   
❌ Nunca guardar números de tarjeta
   Archivo: lib/db/schema.ts
   Problema: Campo "cardNumber" en tabla payments
   
   Sugerencia: Eliminar campo, usar Stripe token en su lugar

✅ Solo Stripe como procesador
   Verificado: Solo importa @stripe/stripe-js

═══════════════════════════════════════════════════════════════

¿Querés que arregle las violaciones? (s/n)
```

---

## Notas

- Las reglas deben ser específicas y verificables
- Si una regla es ambigua, Claude pregunta cómo interpretarla
- Puede sugerir agregar nuevas reglas basadas en el código
