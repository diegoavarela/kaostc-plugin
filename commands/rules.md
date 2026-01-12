---
name: rules
description: Gestionar y validar reglas de negocio.
---

# /rules

Administra las reglas de negocio del proyecto y valida el código contra ellas.

## Archivos

Lee de DOS fuentes (si existen):
1. `.claude/skills/business-rules/SKILL.md` - skill con patrones y reglas
2. `.claude/rules/business.md` - reglas específicas del proyecto

Al agregar/editar reglas, actualiza AMBOS archivos.

---

## Uso

```bash
/rules                      # Ver todas las reglas
/rules add "regla"          # Agregar regla
/rules remove N             # Eliminar regla #N
/rules edit N "nueva"       # Editar regla #N
/rules check                # Validar código contra todas las reglas
/rules check "usuarios"     # Validar solo una categoría
```

---

## Archivo

Las reglas se guardan en `.claude/rules/business.md`

```markdown
# Reglas de Negocio

## Usuarios
1. Usuario máximo 3 workspaces en plan free
2. Email único en todo el sistema

## Pagos
3. Precios siempre en centavos
4. Nunca guardar números de tarjeta
```

---

## /rules (ver todas)

```
REGLAS DE NEGOCIO
═══════════════════════════════════════════════════════════════

Usuarios
───────────────────────────────────────────────────────────────
1. Usuario máximo 3 workspaces en plan free
2. Email único en todo el sistema

Pagos
───────────────────────────────────────────────────────────────
3. Precios siempre en centavos
4. Nunca guardar números de tarjeta

═══════════════════════════════════════════════════════════════
Total: 4 reglas
```

---

## /rules add "regla"

```
¿En qué categoría va esta regla?
1. Usuarios
2. Pagos
3. Nueva categoría...
> 1

✅ Regla agregada:
   #5: [tu regla]
   Categoría: Usuarios
```

Si el archivo no existe, crearlo primero.

---

## /rules remove N

```
¿Eliminar regla #3?
   "Precios siempre en centavos"
   
Confirmar (s/n): s

✅ Regla #3 eliminada
```

---

## /rules edit N "nueva regla"

```
Editando regla #2:
   Antes: "Email único en todo el sistema"
   Ahora: "Email único, validado con regex"

✅ Regla #2 actualizada
```

---

## /rules check

Valida que el código cumpla las reglas definidas.

**Leer:**
```
Read .claude/skills/business-rules/SKILL.md
```

### Proceso

1. Leer `.claude/rules/business.md`

2. Para cada regla, buscar código relacionado:
```bash
grep -r "workspace" --include="*.ts" -l
grep -r "createWorkspace" --include="*.ts" -l
```

3. Verificar si la validación existe

4. Generar reporte:

```
VALIDACIÓN DE REGLAS
═══════════════════════════════════════════════════════════════

Reglas: 4 | ✅ 3 cumplidas | ❌ 1 violación

Usuarios
───────────────────────────────────────────────────────────────
✅ Email único en todo el sistema
   → unique constraint en schema + validación en API
   
❌ Usuario máximo 3 workspaces en plan free
   → app/api/workspaces/route.ts:45
   → No hay validación de límite antes de crear
   
   Sugerencia:
   const count = await db.workspaces.count({ where: { userId } })
   if (user.plan === 'free' && count >= 3) {
     throw new Error('Límite alcanzado')
   }

Pagos
───────────────────────────────────────────────────────────────
✅ Precios siempre en centavos
   → Tipo integer en schema
   
✅ Nunca guardar números de tarjeta
   → Solo stripe token en DB

═══════════════════════════════════════════════════════════════

¿Arreglar la violación? (s/n)
```

---

## /rules check "categoría"

Validar solo reglas de una categoría:

```bash
/rules check "usuarios"
/rules check "pagos"
```

---

## Template inicial

Si no existe `.claude/rules/business.md`:

```markdown
# Reglas de Negocio

## General
<!-- Reglas que aplican a todo el proyecto -->

## Usuarios
<!-- Reglas sobre usuarios, auth, permisos -->

## Datos
<!-- Reglas sobre manejo de datos, validaciones -->

## Pagos
<!-- Reglas sobre pagos, precios, suscripciones -->
```

---

## Integración

- `/do` y `/feature` leen las reglas antes de implementar
- `/review` considera las reglas en code review
