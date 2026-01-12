---
name: ui
description: Mejorar o auditar UI contra el design system.
---

# /ui

Mejora o audita la UI usando el design system definido en `premium-ui`.

## Uso

```bash
/ui check            # Auditar UI contra design system
/ui check "sidebar"  # Auditar componente específico
/ui "login"          # Mejorar página de login
/ui "cards"          # Mejorar cards
```

---

## /ui check - Auditoría

Valida que el código siga el design system.

**Proceso:**

1. Leer skill `premium-ui` (DESIGN_SYSTEM.md)
2. Escanear archivos de UI
3. Comparar contra las specs
4. Reportar diferencias

**Checklist:**

### Colores
- [ ] Background principal es `#121212`
- [ ] Sidebar es `#0f0f0f`
- [ ] Cards usan `#171717` o gradiente `from-white/[0.05]`
- [ ] Borders usan `border-white/[0.06]` o `border-white/[0.08]`
- [ ] Texto primario `text-white`, secundario `text-white/80`, muted `text-white/50`

### Cards
- [ ] Tienen `rounded-2xl` (16px)
- [ ] Tienen gradiente de fondo (`from-white/[0.05] via-white/[0.02] to-white/[0.01]`)
- [ ] Tienen `backdrop-blur-xl`
- [ ] Hover cambia border a `border-white/[0.15]`
- [ ] Hover tiene `translateY(-2px)` o `-translate-y-0.5`

### Sidebar
- [ ] Width es `w-[260px]`
- [ ] Background es `bg-[#0f0f0f]`
- [ ] Items activos tienen gradiente + dot verde
- [ ] Items hover tienen `bg-white/[0.04]`

### Tipografía
- [ ] Headers usan `text-[10px] font-semibold uppercase tracking-widest`
- [ ] Títulos usan `text-2xl font-bold tracking-tight`
- [ ] Números usan `tabular-nums`

### Estados
- [ ] Loading usa skeletons
- [ ] Empty states tienen acción clara
- [ ] Errores se muestran inline

**Output:**

```
🔍 UI AUDIT

Archivos escaneados: X

✅ Correcto:
- Sidebar width 260px
- Background #121212

❌ Diferencias:
- Cards: Falta backdrop-blur-xl
  Archivo: components/Card.tsx:15
  Actual: bg-zinc-900
  Esperado: bg-gradient-to-br from-white/[0.05]...

- Borders: Opacidad incorrecta  
  Archivo: components/Sidebar.tsx:8
  Actual: border-gray-700
  Esperado: border-white/[0.08]

Score: 6/10
```

---

## /ui "target" - Mejorar

Mejora un componente aplicando el design system.

**Proceso:**

1. Leer skills: `premium-ui`, `layouts`
2. Identificar archivos del target
3. Aplicar estilos del design system
4. Verificar que no rompió funcionalidad

**Qué mejora:**
- Colores según paleta
- Gradientes y glass morphism
- Hover effects
- Spacing y border radius
- Tipografía y tracking
- Estados (loading, error, empty)

**Qué NO toca:**
- Lógica de negocio
- Llamadas a API
- Estado (useState, etc)

**Output:**

```
🎨 UI: [target]

Cambios:
- [archivo] - [qué cambió]

¿Aplicar?
```
