---
name: ux
description: Auditoría UX del proyecto.
---

# /ux

Audita la experiencia de usuario y genera reporte en español.

---

## Uso

```bash
/ux                  # Auditar todo
/ux "dashboard"      # Auditar componente específico
/ux --fix            # Auditar + aplicar mejoras
```

---

## Proceso

### 1. Leer skills

```
Read .claude/skills/premium-ui/SKILL.md
```

### 2. Identificar archivos

```bash
# Si hay target
grep -r "$TARGET" --include="*.tsx" -l

# Si no, buscar páginas
find . -path "*/app/**/page.tsx"
```

### 3. Auditar cada archivo

Revisar:

**Accesibilidad**
- [ ] Botones de ícono tienen aria-label
- [ ] Imágenes tienen alt
- [ ] Contraste suficiente
- [ ] Focus visible

**Usabilidad**
- [ ] Estados loading claros (skeletons)
- [ ] Estados error junto al problema
- [ ] Estados empty con acción clara
- [ ] Confirmación antes de borrar

**Layout**
- [ ] Usa h-dvh (no h-screen)
- [ ] Respeta safe-area en fixed
- [ ] Z-index con escala fija

**Performance**
- [ ] Animaciones solo en transform/opacity
- [ ] No blur en surfaces grandes
- [ ] Duraciones ≤200ms

### 4. Generar reporte

```
REPORTE DE UX
═══════════════════════════════════════════════════════════════

Resumen
───────────────────────────────────────────────────────────────
Archivos revisados: 8
Problemas graves: 2 🔴
Mejoras sugeridas: 5 ⚠️
Puntaje: 70/100

Problemas Graves
───────────────────────────────────────────────────────────────
🔴 Se puede borrar sin querer
   Dónde: Botón "Eliminar" en contactos
   Impacto: Un click accidental borra todo sin confirmación
   
🔴 Usuarios ciegos no pueden usar el menú
   Dónde: Botones de navegación
   Impacto: Lectores de pantalla no saben qué hace cada botón

Mejoras Sugeridas
───────────────────────────────────────────────────────────────
⚠️ Lista vacía sin acción clara
   El usuario no sabe qué hacer cuando no hay datos
   
⚠️ Animación del sidebar es pesada
   Puede trabar en celulares viejos

¿Por dónde empezar?
───────────────────────────────────────────────────────────────
1. Hoy: Agregar confirmación antes de borrar
2. Esta semana: Agregar aria-labels
3. Cuando puedas: Mejorar estados vacíos

═══════════════════════════════════════════════════════════════
```

### 5. Si --fix

Preguntar qué arreglar:
```
¿Qué querés que arregle?
1. Solo graves (2)
2. Graves + sugeridos (7)
3. Elegir específicos
```

Aplicar mejoras usando skills de UI.
