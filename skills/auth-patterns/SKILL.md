# Auth Patterns

Patrones correctos de autenticación para apps web.

---

## Regla Principal

> **NUNCA** mezclar landing page con funcionalidad de la app en la misma vista.

---

## Flujos según tipo de app

### SaaS / Producto Público

```
Usuario no logueado:
  /           → Landing page (marketing, features, pricing)
  /login      → Pantalla de login
  /register   → Pantalla de registro (si aplica)
  /app/*      → Redirect a /login

Usuario logueado:
  /           → Redirect a /app o /dashboard
  /login      → Redirect a /app
  /app/*      → Contenido de la app
```

**Landing page debe tener:**
- Hero section impactante
- Features/beneficios
- Social proof (testimonials, logos)
- Pricing (si aplica)
- CTA claro a /login o /register
- Footer con links legales

### App Interna / Tool

```
Usuario no logueado:
  /*          → Redirect a /login

Usuario logueado:
  /           → Dashboard o home de la app
  /login      → Redirect a /
```

**NO necesita landing page** - el login ES la primera pantalla.

---

## Pantalla de Login

### Estructura

```tsx
<div className="min-h-screen flex">
  {/* Panel izquierdo - Branding (opcional, desktop only) */}
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700
    items-center justify-center p-12">
    <div className="max-w-md text-white">
      <Logo className="h-10 mb-8" />
      <h1 className="text-3xl font-bold mb-4">Welcome back</h1>
      <p className="text-white/70">Sign in to continue to your dashboard.</p>
    </div>
  </div>
  
  {/* Panel derecho - Form */}
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="w-full max-w-sm">
      {/* Logo mobile */}
      <div className="lg:hidden mb-8 text-center">
        <Logo className="h-8 mx-auto" />
      </div>
      
      {/* Título */}
      <h2 className="text-2xl font-bold text-white mb-2">Sign in</h2>
      <p className="text-white/50 mb-8">Enter your credentials to continue</p>
      
      {/* Social providers */}
      <div className="space-y-3 mb-6">
        <SocialButton provider="google" />
        <SocialButton provider="github" />
        {/* etc */}
      </div>
      
      {/* Divider (si hay email + social) */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#0a0a0a] text-white/40">or continue with</span>
        </div>
      </div>
      
      {/* Email form */}
      <form className="space-y-4">
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <Button type="submit" fullWidth>Sign in</Button>
      </form>
      
      {/* Links */}
      <p className="mt-6 text-center text-sm text-white/40">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-400 hover:text-blue-300">
          Sign up
        </Link>
      </p>
    </div>
  </div>
</div>
```

### Social Buttons

```tsx
// Patrón para botones de providers
function SocialButton({ provider }: { provider: 'google' | 'github' | 'microsoft' | 'apple' }) {
  const config = {
    google: { icon: GoogleIcon, label: 'Continue with Google', bg: 'bg-white text-black' },
    github: { icon: GithubIcon, label: 'Continue with GitHub', bg: 'bg-[#24292e] text-white' },
    microsoft: { icon: MicrosoftIcon, label: 'Continue with Microsoft', bg: 'bg-[#2f2f2f] text-white' },
    apple: { icon: AppleIcon, label: 'Continue with Apple', bg: 'bg-black text-white border border-white/20' },
  }
  
  const { icon: Icon, label, bg } = config[provider]
  
  return (
    <button className={`w-full flex items-center justify-center gap-3 px-4 py-3 
      rounded-xl font-medium transition-all hover:opacity-90 ${bg}`}>
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}
```

---

## Avatar Dropdown (Usuario Logueado)

### Estructura obligatoria

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-2 rounded-full p-1 
      hover:bg-white/5 transition-colors">
      <Avatar>
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
      </Avatar>
      {/* Opcional: mostrar nombre en desktop */}
      <span className="hidden md:block text-sm text-white/80">{user.name}</span>
      <ChevronDown className="h-4 w-4 text-white/40" />
    </button>
  </DropdownMenuTrigger>
  
  <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-white/10">
    {/* Header con info del usuario */}
    <div className="px-3 py-2 border-b border-white/10">
      <p className="text-sm font-medium text-white">{user.name}</p>
      <p className="text-xs text-white/50">{user.email}</p>
    </div>
    
    {/* Items opcionales */}
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    
    {/* Si es SaaS con billing */}
    <DropdownMenuItem>
      <CreditCard className="mr-2 h-4 w-4" />
      Billing
    </DropdownMenuItem>
    
    <DropdownMenuSeparator className="bg-white/10" />
    
    {/* Sign out - SIEMPRE último, con color diferente */}
    <DropdownMenuItem 
      onClick={signOut}
      className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Items del dropdown

| Item | Cuándo incluir |
|------|----------------|
| **Profile** | Siempre si hay página de perfil |
| **Settings** | Siempre si hay configuración de usuario |
| **Billing** | Solo si es SaaS con pagos |
| **Team** | Solo si es multi-tenant |
| **Help** | Opcional |
| **Sign out** | **SIEMPRE** (último, en rojo) |

---

## Providers de Auth

### Email + Password
- Requiere: formulario de registro, validación, hash de passwords
- Opcional: "Forgot password" flow
- Consideraciones: más trabajo de implementación

### Google
- Más común, la mayoría de usuarios lo tienen
- Setup: Google Cloud Console → OAuth credentials

### GitHub
- Ideal para apps developer-focused
- Setup: GitHub Settings → Developer settings → OAuth Apps

### Microsoft
- Ideal para apps enterprise/corporate
- Setup: Azure Portal → App registrations

### Apple
- Requerido si la app va a App Store
- Setup: Apple Developer → Certificates, Identifiers & Profiles

### Magic Link (Passwordless)
- UX moderna, sin passwords
- Requiere: servicio de email (Resend, SendGrid)
- Flujo: email → click link → logueado

---

## Middleware de Protección

```typescript
// middleware.ts
import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register')
  const isPublicPage = req.nextUrl.pathname === '/' ||
                       req.nextUrl.pathname.startsWith('/api/auth')
  const isAppPage = req.nextUrl.pathname.startsWith('/app') ||
                    req.nextUrl.pathname.startsWith('/dashboard')

  // Usuario no logueado intentando acceder a app
  if (!isLoggedIn && isAppPage) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Usuario logueado en página de auth
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Checklist de Auth

- [ ] ¿Flujo correcto según tipo de app (SaaS vs Tool)?
- [ ] ¿Providers configurados según spec?
- [ ] ¿Avatar dropdown tiene sign out?
- [ ] ¿Middleware protege rutas correctamente?
- [ ] ¿Login page tiene buen diseño (no genérico)?
- [ ] ¿Redirect post-login va al lugar correcto?
- [ ] ¿Error states manejados (credenciales inválidas, etc)?
