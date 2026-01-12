# Admin Design System

Dark, premium design system inspirado en Vercel, Linear, y GitHub dark themes.

**OBLIGATORIO**: Todo componente UI debe seguir estas reglas exactas.

---

## Colores

### Backgrounds
| Token | Valor | Uso |
|-------|-------|-----|
| `bg-main` | `#121212` | Fondo principal |
| `bg-sidebar` | `#0f0f0f` | Sidebar |
| `bg-card` | `#171717` | Cards |
| `bg-elevated` | `rgba(255,255,255,0.02)` | Elevación sutil |
| `bg-hover` | `rgba(255,255,255,0.04)` | Hover states |

### Borders
| Token | Valor | Uso |
|-------|-------|-----|
| `border-default` | `rgba(255,255,255,0.06)` | Bordes de cards |
| `border-subtle` | `rgba(255,255,255,0.04)` | Divisores de tabla |
| `border-hover` | `rgba(255,255,255,0.08)` | Bordes en hover |
| `border-strong` | `rgba(255,255,255,0.15)` | Active/focus |

### Text
| Token | Valor | Uso |
|-------|-------|-----|
| `text-primary` | `#ffffff` | Headings |
| `text-secondary` | `rgba(255,255,255,0.80)` | Body text |
| `text-muted` | `rgba(255,255,255,0.50)` | Info secundaria |
| `text-subtle` | `rgba(255,255,255,0.40)` | Labels |
| `text-faint` | `rgba(255,255,255,0.30)` | Placeholders |

### Accent Colors
| Color | Background | Text | Border |
|-------|------------|------|--------|
| Blue | `rgba(59,130,246,0.10-0.20)` | `#60a5fa` | `rgba(59,130,246,0.30)` |
| Emerald | `rgba(16,185,129,0.10-0.20)` | `#34d399` | `rgba(16,185,129,0.30)` |
| Purple | `rgba(139,92,246,0.10-0.20)` | `#a78bfa` | `rgba(139,92,246,0.30)` |
| Amber | `rgba(245,158,11,0.10-0.20)` | `#fbbf24` | `rgba(245,158,11,0.30)` |
| Red | `rgba(239,68,68,0.10-0.20)` | `#f87171` | `rgba(239,68,68,0.30)` |

---

## Tipografía

### Font Family
```css
font-family: 'Geist Sans', system-ui, sans-serif;
font-family: 'Geist Mono', monospace; /* código/IDs */
```

### Sizes
| Tipo | Tailwind | Uso |
|------|----------|-----|
| Title | `text-2xl font-bold tracking-tight` | Page titles |
| Heading | `text-sm font-semibold` | Card headers |
| Label | `text-[11px] font-semibold uppercase tracking-widest` | Labels |
| Body | `text-sm font-normal` | Body text |
| Caption | `text-xs font-normal` | Timestamps |
| Tiny | `text-[10px] font-semibold uppercase tracking-widest` | Table headers |

### Números
```jsx
<span className="tabular-nums">1,234</span>
```

---

## Componentes

### Card Base

```jsx
<div className="
  relative overflow-hidden rounded-2xl p-6
  bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.01]
  border border-white/[0.08]
  backdrop-blur-xl
  transition-all duration-300
  hover:border-white/[0.15]
  hover:-translate-y-0.5
  hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),0_0_30px_-10px_rgba(255,255,255,0.1)]
">
  {/* Línea highlight superior */}
  <div className="
    absolute top-0 left-0 right-0 h-px
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    transition-all duration-300
    group-hover:via-white/40
  " />
  
  {/* Contenido */}
</div>
```

### Stat Card

```jsx
<div className="stat-card group">
  <div className="flex items-center justify-between">
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Total Users
      </p>
      <p className="text-3xl font-bold text-white tabular-nums">
        1,234
      </p>
    </div>
    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center
      group-hover:scale-110 transition-transform duration-300">
      <Users className="h-5 w-5 text-blue-400" />
    </div>
  </div>
</div>
```

### Badge

```jsx
// Success
<span className="inline-flex items-center rounded-lg
  bg-gradient-to-r from-emerald-500/20 to-emerald-500/10
  border border-emerald-500/30 text-emerald-400
  px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
  Active
</span>

// Error
<span className="inline-flex items-center rounded-lg
  bg-gradient-to-r from-red-500/20 to-red-500/10
  border border-red-500/30 text-red-400
  px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
  Error
</span>
```

### Avatar

```jsx
<div className="flex h-9 w-9 items-center justify-center rounded-xl
  bg-gradient-to-br from-blue-500 to-blue-600
  text-xs font-bold text-white shadow-lg">
  J
</div>
```

### Nav Item (Sidebar)

```jsx
// Inactive
<Link className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5
  text-sm font-medium text-white/50 hover:text-white/80">
  <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0
    transition-opacity duration-200 group-hover:opacity-100" />
  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg
    bg-transparent group-hover:bg-white/[0.06] transition-all duration-200">
    <Icon className="h-4 w-4 text-white/40 group-hover:text-white/70" />
  </div>
  <span className="relative z-10">Label</span>
</Link>

// Active
<Link className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5
  text-sm font-medium text-white">
  <div className="absolute inset-0 rounded-xl bg-gradient-to-r
    from-white/[0.08] to-white/[0.04] border border-white/[0.08]" />
  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
    <Icon className="h-4 w-4 text-white" />
  </div>
  <span className="relative z-10">Label</span>
  <div className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-400
    shadow-lg shadow-emerald-400/50" />
</Link>
```

### Table

```jsx
<div className="overflow-hidden rounded-2xl border border-white/[0.06]">
  <table className="w-full">
    <thead>
      <tr className="border-b border-white/[0.06]">
        <th className="px-5 py-4 text-left text-[10px] font-semibold 
          uppercase tracking-widest text-white/40">
          Name
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/[0.04]">
      <tr className="hover:bg-white/[0.02] transition-all duration-200">
        <td className="px-5 py-4 text-sm text-white/80">
          Content
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Spacing

| Uso | Valor |
|-----|-------|
| Card padding | `p-5` o `p-6` |
| Section gap | `space-y-6` o `space-y-8` |
| Grid gap | `gap-5` o `gap-6` |
| Table cell | `px-5 py-4` |

---

## Border Radius

| Tamaño | Clase | Uso |
|--------|-------|-----|
| Small | `rounded-lg` (8px) | Badges |
| Medium | `rounded-xl` (12px) | Inputs, buttons |
| Large | `rounded-2xl` (16px) | Cards, modals |

---

## Transitions

```css
transition-all duration-200  /* Fast: hovers, focus */
transition-all duration-300  /* Medium: transforms */
```

---

## Animations

### Pulse (Live indicator)
```jsx
<span className="relative flex h-2 w-2">
  <span className="absolute inline-flex h-full w-full animate-ping
    rounded-full bg-emerald-400 opacity-75" />
  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
</span>
```

### Hover Scale
```jsx
<div className="group-hover:scale-110 transition-transform duration-300">
```

---

## Reglas Absolutas

1. **NUNCA** hardcodear colores - usar tokens
2. **SIEMPRE** usar opacidades bajas para backgrounds (0.02-0.10)
3. **SIEMPRE** transitions de 200-300ms en elementos interactivos
4. **SIEMPRE** hover feedback (scale, glow, o color change)
5. **SIEMPRE** `backdrop-blur-xl` en cards glass
6. **SIEMPRE** gradient en badges de colores (from-X/20 to-X/10)
7. **SIEMPRE** `tabular-nums` en números
8. **SIEMPRE** uppercase + tracking-widest en labels pequeños

---

## Tailwind Quick Reference

### Background
- `bg-[#121212]` - Main
- `bg-white/[0.02]` - Elevated
- `bg-white/[0.05]` - Icon containers
- `bg-emerald-500/10` - Colored bg

### Text
- `text-white` - Primary
- `text-white/80` - Secondary
- `text-white/50` - Muted
- `text-white/40` - Subtle
- `text-emerald-400` - Colored

### Border
- `border-white/[0.04]` - Very subtle
- `border-white/[0.06]` - Default
- `border-white/[0.08]` - Visible
- `border-emerald-500/30` - Colored
