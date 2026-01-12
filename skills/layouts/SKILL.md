# Layouts

Patrones de layout según el tipo de aplicación y estilo elegido.

---

## Tipos de Layout

### 1. Sidebar Layout

Para apps con navegación compleja (dashboards, admin panels, tools).

```
┌─────────────────────────────────────────────────┐
│ ┌──────┐  ┌─────────────────────────────────┐   │
│ │      │  │ Header (breadcrumb, search)     │   │
│ │ Side │  ├─────────────────────────────────┤   │
│ │ bar  │  │                                 │   │
│ │      │  │         Content Area            │   │
│ │      │  │                                 │   │
│ │      │  │                                 │   │
│ └──────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 2. Top Nav Layout

Para apps simples o landing pages.

```
┌─────────────────────────────────────────────────┐
│           Top Navigation Bar                    │
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│               Content Area                      │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                  Footer                         │
└─────────────────────────────────────────────────┘
```

### 3. Hybrid (Landing + App)

Para SaaS: landing sin sidebar, app con sidebar.

```
/ (landing)           /app/* (logged in)
┌───────────────┐    ┌─────────────────────┐
│   Top Nav     │    │ ┌────┐ ┌─────────┐  │
├───────────────┤    │ │Side│ │ Content │  │
│               │    │ │bar │ │         │  │
│   Landing     │    │ │    │ │         │  │
│   Content     │    │ └────┘ └─────────┘  │
│               │    └─────────────────────┘
└───────────────┘
```

---

## Estilos Visuales

### Techie (Vercel/GitHub/Linear style)

**Características:**
- Dark mode obligatorio
- Minimal, mucho whitespace
- Tipografía clean (Inter, Geist)
- Bordes sutiles (white/[0.08])
- Sin sombras pesadas
- Colores accent: blue, purple, green (sutiles)

```tsx
// Techie Layout Base
<div className="min-h-screen bg-[#0a0a0a] text-white">
  {/* Ambient gradients */}
  <div className="fixed inset-0 -z-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
  </div>
  
  {/* Grid pattern opcional */}
  <div className="fixed inset-0 -z-10 
    bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
    bg-[size:64px_64px]" />
  
  {children}
</div>

// Techie Sidebar
<aside className="w-64 border-r border-white/[0.08] bg-black/20 backdrop-blur-xl">
  {/* Logo */}
  <div className="h-16 flex items-center px-6 border-b border-white/[0.08]">
    <Logo />
  </div>
  
  {/* Nav */}
  <nav className="p-4 space-y-1">
    <NavItem icon={Home} label="Dashboard" active />
    <NavItem icon={Users} label="Users" />
    <NavItem icon={Settings} label="Settings" />
  </nav>
</aside>

// Techie Nav Item
<a className={cn(
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
  active 
    ? "bg-white/10 text-white" 
    : "text-white/50 hover:text-white hover:bg-white/5"
)}>
  <Icon className="w-4 h-4" />
  {label}
</a>
```

### Professional Dark

**Características:**
- Dark mode por defecto
- Más estructura visual que Techie
- Cards más definidas
- Puede tener colores brand más fuertes
- Sombras sutiles permitidas

```tsx
// Professional Dark Layout
<div className="min-h-screen bg-[#111111]">
  {children}
</div>

// Professional Dark Sidebar
<aside className="w-64 bg-[#0d0d0d] border-r border-[#222]">
  <div className="h-16 flex items-center px-6 border-b border-[#222]">
    <Logo />
  </div>
  <nav className="p-4">
    {/* Nav items con más estructura */}
  </nav>
</aside>

// Professional Dark Card
<div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6
  hover:border-[#333] transition-colors">
  {children}
</div>
```

### Professional Light

**Características:**
- Light mode
- Limpio y corporate
- Grays neutros
- Sombras suaves
- Colores brand pueden ser más saturados

```tsx
// Professional Light Layout
<div className="min-h-screen bg-gray-50">
  {children}
</div>

// Professional Light Sidebar
<aside className="w-64 bg-white border-r border-gray-200">
  <div className="h-16 flex items-center px-6 border-b border-gray-200">
    <Logo />
  </div>
  <nav className="p-4">
    {/* Nav items */}
  </nav>
</aside>

// Professional Light Card
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm
  hover:shadow-md transition-shadow">
  {children}
</div>

// Professional Light Nav Item
<a className={cn(
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
  active 
    ? "bg-gray-100 text-gray-900 font-medium" 
    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
)}>
  <Icon className="w-4 h-4" />
  {label}
</a>
```

---

## Sidebar Patterns

### Sidebar Fijo

```tsx
// Layout con sidebar fijo
<div className="flex min-h-screen">
  <aside className="w-64 flex-shrink-0">
    <Sidebar />
  </aside>
  <main className="flex-1">
    {children}
  </main>
</div>
```

### Sidebar Colapsable

```tsx
// Con estado de collapse
const [collapsed, setCollapsed] = useState(false)

<div className="flex min-h-screen">
  <aside className={cn(
    "flex-shrink-0 transition-all duration-300",
    collapsed ? "w-16" : "w-64"
  )}>
    <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
  </aside>
  <main className="flex-1">
    {children}
  </main>
</div>

// Sidebar con collapse
<aside className={cn("border-r border-white/[0.08]", collapsed ? "w-16" : "w-64")}>
  {/* Toggle button */}
  <button 
    onClick={onToggle}
    className="absolute -right-3 top-20 w-6 h-6 rounded-full 
      bg-[#1a1a1a] border border-white/10 flex items-center justify-center
      hover:bg-white/10 transition-colors">
    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
  </button>
  
  {/* Nav items que colapsan */}
  <NavItem icon={Home} label="Dashboard" collapsed={collapsed} />
</aside>

// Nav item que soporta collapse
<a className="flex items-center gap-3 px-3 py-2">
  <Icon className="w-4 h-4 flex-shrink-0" />
  {!collapsed && <span>{label}</span>}
</a>
```

### Sidebar Responsive (Drawer en mobile)

```tsx
// Desktop: sidebar fijo, Mobile: drawer
const [mobileOpen, setMobileOpen] = useState(false)

<>
  {/* Mobile overlay */}
  {mobileOpen && (
    <div 
      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      onClick={() => setMobileOpen(false)}
    />
  )}
  
  {/* Sidebar */}
  <aside className={cn(
    "fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform lg:transform-none",
    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  )}>
    <Sidebar />
  </aside>
  
  {/* Main con hamburger en mobile */}
  <main className="flex-1 lg:ml-0">
    <header className="lg:hidden p-4">
      <button onClick={() => setMobileOpen(true)}>
        <Menu className="w-6 h-6" />
      </button>
    </header>
    {children}
  </main>
</>
```

---

## Top Navigation

### Techie Style

```tsx
<nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-8">
      <Logo />
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
        <NavLink href="/docs">Docs</NavLink>
      </div>
    </div>
    
    {/* Right side */}
    <div className="flex items-center gap-4">
      {user ? (
        <UserMenu user={user} />
      ) : (
        <>
          <Button variant="ghost" href="/login">Sign in</Button>
          <Button href="/register">Get Started</Button>
        </>
      )}
    </div>
  </div>
</nav>
```

### Floating Nav (para landings)

```tsx
<nav className="fixed top-4 inset-x-4 z-50">
  <div className="max-w-6xl mx-auto px-6 py-3 rounded-2xl
    bg-black/50 border border-white/[0.08] backdrop-blur-xl">
    {/* Same content as above */}
  </div>
</nav>
```

---

## Cuándo usar cada layout

| Tipo de App | Layout Recomendado | Estilo Sugerido |
|-------------|-------------------|-----------------|
| Dashboard/Admin | Sidebar (colapsable) | Techie o Professional Dark |
| SaaS Tool | Sidebar + Landing | Techie |
| Landing Page | Top Nav | Cualquiera según brand |
| Blog/Content | Top Nav | Professional Light |
| Developer Tool | Sidebar | Techie |
| Enterprise App | Sidebar | Professional (Dark o Light) |
| Mobile-first | Top Nav (hamburger) | Techie o Professional Dark |

---

## Checklist

- [ ] ¿Layout correcto según tipo de app?
- [ ] ¿Sidebar responsive en mobile?
- [ ] ¿Estilo consistente con la spec?
- [ ] ¿Avatar/user menu en lugar correcto?
- [ ] ¿Navegación clara y accesible?
