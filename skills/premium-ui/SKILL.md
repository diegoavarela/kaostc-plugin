---
name: premium-ui
description: Dark premium design system. Colores, tipografía, componentes, efectos hover.
---

# Admin Design System

A dark, premium design system inspired by Vercel, Linear, and GitHub's dark themes.

---

## Color Palette

### Backgrounds

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Background | `#121212` | `hsl(0, 0%, 7%)` | Main app background |
| Sidebar | `#0f0f0f` | `hsl(0, 0%, 6%)` | Sidebar background |
| Card | `#171717` | `hsl(0, 0%, 9%)` | Card backgrounds |
| Elevated | `rgba(255,255,255,0.02)` | - | Subtle elevation |
| Hover | `rgba(255,255,255,0.04)` | - | Hover states |

### Borders

| Name | Value | Usage |
|------|-------|-------|
| Default | `rgba(255,255,255,0.06)` | Card borders, dividers |
| Subtle | `rgba(255,255,255,0.04)` | Table row dividers |
| Hover | `rgba(255,255,255,0.08)` | Border on hover |
| Strong | `rgba(255,255,255,0.15)` | Active/focus borders |

### Text

| Name | Value | Usage |
|------|-------|-------|
| Primary | `#ffffff` | Headings, important text |
| Secondary | `rgba(255,255,255,0.80)` | Body text |
| Muted | `rgba(255,255,255,0.50)` | Secondary info |
| Subtle | `rgba(255,255,255,0.40)` | Labels, captions |
| Faint | `rgba(255,255,255,0.30)` | Placeholders, timestamps |

### Accent Colors

| Color | Background | Text | Border | Usage |
|-------|------------|------|--------|-------|
| Blue | `rgba(59,130,246,0.10-0.20)` | `#60a5fa` | `rgba(59,130,246,0.30)` | Info, links, primary actions |
| Emerald | `rgba(16,185,129,0.10-0.20)` | `#34d399` | `rgba(16,185,129,0.30)` | Success, correct, online |
| Purple | `rgba(139,92,246,0.10-0.20)` | `#a78bfa` | `rgba(139,92,246,0.30)` | Features, premium |
| Amber | `rgba(245,158,11,0.10-0.20)` | `#fbbf24` | `rgba(245,158,11,0.30)` | Warnings, XP, stars |
| Orange | `rgba(249,115,22,0.10-0.20)` | `#fb923c` | `rgba(249,115,22,0.30)` | Streaks, fire |
| Red | `rgba(239,68,68,0.10-0.20)` | `#f87171` | `rgba(239,68,68,0.30)` | Errors, destructive |
| Pink | `rgba(236,72,153,0.10-0.20)` | `#f472b6` | `rgba(236,72,153,0.30)` | Visual, special |
| Cyan | `rgba(6,182,212,0.10-0.20)` | `#22d3ee` | `rgba(6,182,212,0.30)` | Info badges |
| Yellow | `rgba(234,179,8,0.10-0.20)` | `#facc15` | `rgba(234,179,8,0.30)` | Gold, achievements |

---

## Typography

### Font

```css
font-family: 'Geist Sans', system-ui, sans-serif;
font-family: 'Geist Mono', monospace; /* For code/IDs */
```

### Sizes

| Name | Size | Weight | Letter Spacing | Usage |
|------|------|--------|----------------|-------|
| Title | `text-2xl` (24px) | `font-bold` | `tracking-tight` | Page titles |
| Heading | `text-sm` (14px) | `font-semibold` | - | Card headers |
| Label | `text-[11px]` | `font-semibold` | `tracking-widest` | Uppercase labels |
| Body | `text-sm` (14px) | `font-normal` | - | Body text |
| Caption | `text-xs` (12px) | `font-normal` | - | Timestamps, hints |
| Tiny | `text-[10px]` | `font-semibold` | `tracking-widest` | Table headers |

### Number Styling

```css
.tabular-nums {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
```

---

## Components

### Sidebar

```jsx
// Container
<div className="flex h-full w-[260px] flex-col border-r border-white/[0.08] bg-[#0f0f0f]">

  {/* Logo section */}
  <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl
      bg-gradient-to-br from-white to-white/80 shadow-lg shadow-white/10">
      <Icon className="h-5 w-5 text-black" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold tracking-tight text-white">App Name</span>
      <span className="text-[10px] font-medium text-white/40">Admin Console</span>
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex-1 space-y-1 px-3 py-4">
    {/* Section label */}
    <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
      Menu
    </p>

    {/* Nav item */}
    <Link className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5
      text-sm font-medium transition-all duration-200
      text-white/50 hover:text-white/80">

      {/* Hover background */}
      <div className="absolute inset-0 rounded-xl bg-white/[0.04] opacity-0
        transition-opacity duration-200 group-hover:opacity-100" />

      {/* Icon container */}
      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg
        bg-transparent group-hover:bg-white/[0.06] transition-all duration-200">
        <Icon className="h-4 w-4 text-white/40 group-hover:text-white/70" />
      </div>

      <span className="relative z-10 flex-1">Dashboard</span>
    </Link>

    {/* Active nav item */}
    <Link className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5
      text-sm font-medium text-white">

      {/* Active background */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r
        from-white/[0.08] to-white/[0.04] border border-white/[0.08]" />

      {/* Icon container - active */}
      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-white" />
      </div>

      <span className="relative z-10 flex-1">Users</span>

      {/* Active indicator dot */}
      <div className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-400
        shadow-lg shadow-emerald-400/50" />
    </Link>
  </nav>

  {/* Footer - Sign out */}
  <div className="border-t border-white/[0.06] p-3">
    <button className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5
      text-sm font-medium text-white/50 hover:text-white/80">

      {/* Red hover background */}
      <div className="absolute inset-0 rounded-xl bg-red-500/[0.08] opacity-0
        transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg
        group-hover:bg-red-500/10 transition-all duration-200">
        <LogOut className="h-4 w-4 text-white/40 group-hover:text-red-400" />
      </div>

      <span className="relative z-10 group-hover:text-red-400">Sign Out</span>
    </button>
  </div>
</div>
```

**Sidebar specs:**
- Width: `260px`
- Background: `#0f0f0f` (slightly darker than main bg)
- Border: `border-r border-white/[0.08]`
- Logo height: `h-16` (64px)
- Nav item padding: `px-3 py-2.5`
- Icon container: `h-8 w-8 rounded-lg`
- Active state: gradient background + green dot indicator
- Sign out: red accent on hover

---

### Card Morphism (Hover Effects)

Los cards tienen un efecto "glass morphism" con transiciones suaves en hover. Estos son los estados:

#### Estado Normal (Sin Hover)

```css
.card {
  /* Fondo con gradiente sutil - da profundidad */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,    /* esquina superior izq: más claro */
    rgba(255, 255, 255, 0.02) 50%,   /* centro: medio */
    rgba(255, 255, 255, 0.01) 100%   /* esquina inferior der: casi invisible */
  );

  /* Borde sutil */
  border: 1px solid rgba(255, 255, 255, 0.08);

  /* Glass effect */
  backdrop-filter: blur(10px);

  /* Bordes redondeados */
  border-radius: 16px;

  /* Posición relativa para el pseudo-elemento */
  position: relative;
  overflow: hidden;

  /* Transición suave para TODAS las propiedades */
  transition: all 300ms ease;
}

/* Línea de highlight en el borde superior */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,   /* Centro más brillante */
    transparent 100%
  );
  transition: all 300ms ease;
}
```

#### Estado Hover

```css
.card:hover {
  /* 1. Borde más visible */
  border-color: rgba(255, 255, 255, 0.15);  /* 0.08 → 0.15 */

  /* 2. Se eleva levemente */
  transform: translateY(-2px);

  /* 3. Sombra profunda + glow sutil */
  box-shadow:
    0 20px 40px -15px rgba(0, 0, 0, 0.5),      /* sombra oscura hacia abajo */
    0 0 30px -10px rgba(255, 255, 255, 0.1);   /* glow blanco sutil */
}

/* La línea del top se intensifica en hover */
.card:hover::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,   /* 0.2 → 0.4 (más brillante) */
    transparent 100%
  );
}
```

#### Resumen Visual del Morphism

| Propiedad | Normal | Hover | Efecto |
|-----------|--------|-------|--------|
| Border opacity | `0.08` | `0.15` | Borde más definido |
| Transform | `none` | `translateY(-2px)` | Se "levanta" |
| Shadow | `none` | Deep shadow + glow | Profundidad |
| Top line | `0.2 opacity` | `0.4 opacity` | Brilla más |

#### Tailwind Implementation

```jsx
// Card con hover morphism completo
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
  {/* Línea de highlight superior */}
  <div className="
    absolute top-0 left-0 right-0 h-px
    bg-gradient-to-r from-transparent via-white/20 to-transparent
    group-hover:via-white/40
    transition-all duration-300
  " />

  {/* Contenido */}
</div>
```

---

### Stat Card (Usando el Morphism)

```css
.stat-card {
  /* Aplica todo el morphism de arriba + */
  padding: 24px; /* p-6 */
}
```

El stat-card usa la clase `.stat-card` definida en `globals.css` que incluye todos los efectos de morphism automáticamente.

```jsx
// Uso simple
<div className="stat-card">
  {/* El hover ya está incluido */}
</div>
```

### Data Card

```css
.data-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px; /* rounded-2xl */
  overflow: hidden;
  transition: all 200ms ease;
}

.data-card:hover {
  border-color: rgba(255, 255, 255, 0.10);
}
```

El data-card es más sutil - solo cambia el borde en hover, sin elevación.

### Icon Container

```jsx
// Neutral
<div className="h-9 w-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
  <Icon className="h-4 w-4 text-white/40" />
</div>

// Colored (e.g., blue)
<div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
  <Icon className="h-4 w-4 text-blue-400" />
</div>
```

### Badges

```jsx
// Role/Status Badge
<span className="inline-flex items-center rounded-lg border bg-gradient-to-r
  from-emerald-500/20 to-emerald-500/10
  text-emerald-400 border-emerald-500/30
  px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
  STUDENT
</span>

// Pill Badge (Live indicator)
<span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
  text-[11px] font-medium
  bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
  <span className="relative flex h-1.5 w-1.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
  </span>
  Live
</span>
```

### Avatar

```jsx
// Gradient avatar based on name
const colors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-pink-500 to-pink-600",
];
const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

<div className={`flex h-9 w-9 items-center justify-center rounded-xl
  bg-gradient-to-br ${colors[colorIndex]}
  text-xs font-bold text-white shadow-lg`}>
  {name?.charAt(0).toUpperCase()}
</div>
```

### Input Fields

```jsx
<input className="w-full h-11 rounded-xl
  border border-white/[0.08] bg-white/[0.02]
  pl-11 pr-4 text-sm text-white
  placeholder:text-white/30
  focus:border-white/15 focus:outline-none focus:ring-2 focus:ring-white/10
  transition-all duration-200"
/>
```

### Buttons

```jsx
// Primary (white)
<button className="h-12 rounded-xl bg-gradient-to-r from-white to-white/90
  font-semibold text-black text-sm
  transition-all duration-300
  hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02]">
  Sign In
</button>

// Ghost
<button className="h-10 rounded-xl px-4
  text-white/50 hover:text-white hover:bg-white/[0.05]
  transition-all duration-200">
  Cancel
</button>
```

---

## Tables

Las tablas usan un contenedor `data-card` con hover en las filas.

### Estructura Completa

```jsx
{/* Contenedor - usa data-card */}
<div className="data-card">
  <table className="w-full">

    {/* Header */}
    <thead>
      <tr className="border-b border-white/[0.06]">
        <th className="px-5 py-4 text-left text-[10px] font-semibold
          text-white/40 uppercase tracking-widest">
          Nombre
        </th>
        <th className="px-5 py-4 text-center text-[10px] font-semibold
          text-white/40 uppercase tracking-widest">
          Estado
        </th>
        <th className="px-5 py-4 text-right text-[10px] font-semibold
          text-white/40 uppercase tracking-widest">
          Acciones
        </th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="divide-y divide-white/[0.04]">
      <tr className="group hover:bg-white/[0.02] transition-all duration-200">
        <td className="px-5 py-4">...</td>
        <td className="px-5 py-4 text-center">...</td>
        <td className="px-5 py-4 text-right">...</td>
      </tr>
    </tbody>

  </table>
</div>
```

### Header Styling

```css
th {
  padding: 16px 20px;              /* px-5 py-4 */
  font-size: 10px;                 /* text-[10px] */
  font-weight: 600;                /* font-semibold */
  text-transform: uppercase;
  letter-spacing: 0.1em;           /* tracking-widest */
  color: rgba(255,255,255,0.4);    /* text-white/40 */
}
```

### Row Hover Effect

```css
tr {
  transition: all 200ms ease;
}

tr:hover {
  background: rgba(255,255,255,0.02);  /* hover:bg-white/[0.02] */
}
```

### Filas Clickeables

Para hacer toda la fila clickeable (ej: ir al detalle):

```jsx
<tr className="group relative hover:bg-white/[0.02] transition-all duration-200">
  {/* Link invisible que cubre toda la fila */}
  <td className="absolute inset-0 p-0">
    <Link href={`/items/${id}`} className="absolute inset-0" />
  </td>

  {/* Contenido normal de las celdas */}
  <td className="px-5 py-4 relative">...</td>
  <td className="px-5 py-4 relative">...</td>

  {/* Indicador de "clickeable" - aparece en hover */}
  <td className="px-5 py-4 text-right relative">
    <ChevronRight className="h-4 w-4 text-white/20
      opacity-0 group-hover:opacity-100
      transition-all duration-200
      group-hover:translate-x-0.5" />
  </td>
</tr>
```

### Tipos de Contenido en Celdas

#### Avatar + Nombre

```jsx
<td className="px-5 py-4">
  <div className="flex items-center gap-3">
    {/* Avatar con gradiente */}
    <div className="flex h-9 w-9 items-center justify-center rounded-xl
      bg-gradient-to-br from-blue-500 to-blue-600
      text-xs font-bold text-white shadow-lg">
      J
    </div>
    <div>
      <p className="text-sm font-medium text-white">Juan Pérez</p>
      <p className="text-xs text-white/40">juan@email.com</p>
    </div>
  </div>
</td>
```

#### Badge de Estado

```jsx
<td className="px-5 py-4 text-center">
  <span className="inline-flex items-center rounded-lg
    bg-gradient-to-r from-emerald-500/20 to-emerald-500/10
    border border-emerald-500/30 text-emerald-400
    px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
    Activo
  </span>
</td>
```

#### Número/Valor

```jsx
<td className="px-5 py-4 text-right">
  <span className="text-sm font-medium text-white tabular-nums">
    1,234
  </span>
</td>
```

#### Fecha/Timestamp

```jsx
<td className="px-5 py-4">
  <span className="text-xs text-white/40">
    Hace 2 horas
  </span>
</td>
```

### Resumen de Estilos

| Elemento | Clases |
|----------|--------|
| Container | `data-card` |
| Header border | `border-b border-white/[0.06]` |
| Header text | `text-[10px] font-semibold uppercase tracking-widest text-white/40` |
| Row dividers | `divide-y divide-white/[0.04]` |
| Row hover | `hover:bg-white/[0.02] transition-all duration-200` |
| Cell padding | `px-5 py-4` |
| Cell text | `text-sm text-white/80` |
| Align left | `text-left` (default) |
| Align center | `text-center` |
| Align right | `text-right` |

---

## Spacing

| Name | Value | Usage |
|------|-------|-------|
| Card padding | `p-5` or `p-6` | Inside cards |
| Section gap | `space-y-6` or `space-y-8` | Between sections |
| Grid gap | `gap-5` or `gap-6` | Grid layouts |
| Table cell | `px-5 py-4` | Table cells |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| Small | `rounded-lg` (8px) | Badges, small elements |
| Medium | `rounded-xl` (12px) | Inputs, buttons, icons |
| Large | `rounded-2xl` (16px) | Cards, modals |

---

## Shadows

```css
/* Card hover */
box-shadow:
  0 20px 40px -15px rgba(0, 0, 0, 0.5),
  0 0 30px -10px rgba(255, 255, 255, 0.1);

/* Avatar/Logo */
box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.1);

/* Colored glow */
box-shadow: 0 0 30px -5px rgba(16, 185, 129, 0.3); /* emerald */
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

```css
.group-hover:scale-110 {
  transition: transform 300ms;
}
```

### Transitions

```css
transition-all duration-200  /* Fast - hovers, focus */
transition-all duration-300  /* Medium - transforms, complex */
```

---

## Background Effects

### Subtle gradient overlay

```css
body {
  background-color: #121212;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(74, 144, 226, 0.03) 0%, transparent 50%);
}
```

### Grid pattern

```css
background-image:
  linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
background-size: 3rem 3rem;
```

---

## Tailwind Classes Quick Reference

### Background

- `bg-[#121212]` - Main background
- `bg-white/[0.02]` - Subtle elevation
- `bg-white/[0.05]` - Icon containers
- `bg-emerald-500/10` - Colored backgrounds

### Text

- `text-white` - Primary
- `text-white/80` - Secondary
- `text-white/50` - Muted
- `text-white/40` - Subtle
- `text-white/30` - Faint
- `text-emerald-400` - Colored

### Border

- `border-white/[0.04]` - Very subtle
- `border-white/[0.06]` - Default
- `border-white/[0.08]` - Visible
- `border-emerald-500/30` - Colored

### Typography

- `text-[10px] font-semibold uppercase tracking-widest` - Table headers
- `text-[11px] font-semibold uppercase tracking-widest` - Labels
- `text-2xl font-bold tracking-tight` - Page titles
- `tabular-nums` - Numbers

---

## Usage Example

```jsx
// Complete stat card
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

---

## Key Principles

1. **Subtlety** - Use low opacity values (0.02-0.10 for backgrounds, 0.04-0.08 for borders)
2. **Hierarchy** - Clear visual hierarchy with text opacity levels
3. **Color accents** - Colored elements use gradient backgrounds with matching text/border
4. **Smooth transitions** - 200-300ms transitions on all interactive elements
5. **Consistent spacing** - Use Tailwind spacing scale consistently
6. **Glass effect** - Subtle backdrop blur and transparency
7. **Hover feedback** - Scale, glow, or color change on hover
