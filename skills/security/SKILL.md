# Security Rules

Reglas de seguridad no negociables para todo el código.

## Secrets

### NUNCA en código
```typescript
// ❌ PROHIBIDO
const API_KEY = "sk-1234567890";
const DB_URL = "postgresql://user:pass@host:5432/db";

// ✅ CORRECTO
const API_KEY = process.env.API_KEY;
const DB_URL = process.env.DATABASE_URL;
```

### .env y .gitignore
```bash
# .gitignore DEBE incluir:
.env
.env.local
.env.*.local
*.pem
*.key
```

### Validar que existen
```typescript
// ✅ CORRECTO - Fail fast si falta
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}
```

## Input Validation

### NUNCA confiar en input del usuario
```typescript
// ✅ CORRECTO - Validar con Zod
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

const result = userSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error);
}

// ❌ PROHIBIDO - Usar input directo
const user = await db.users.create({ data: req.body });
```

### Sanitizar output
```typescript
// ✅ CORRECTO - Escapar HTML
import { escape } from 'html-escaper';
const safeContent = escape(userInput);

// En React, jsx ya escapa por default
// PERO cuidado con dangerouslySetInnerHTML
```

## SQL Injection

Ver skill `database-rules`. Resumen:
- SIEMPRE usar ORM
- NUNCA string interpolation en queries
- NUNCA SQL raw sin prepared statements

## XSS (Cross-Site Scripting)

```typescript
// ❌ PROHIBIDO
element.innerHTML = userInput;
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECTO
element.textContent = userInput;
<div>{userInput}</div>  // React escapa automáticamente
```

## CSRF

Para Server Actions y API routes:
```typescript
// Next.js Server Actions tienen protección CSRF built-in
// Para API routes custom, validar origin:

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin !== process.env.ALLOWED_ORIGIN) {
    return new Response('Forbidden', { status: 403 });
  }
  // ...
}
```

## Authentication

```typescript
// ✅ CORRECTO - Verificar auth en cada request protegida
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ...
}

// ❌ PROHIBIDO - Asumir que el usuario está autenticado
export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id'); // Cualquiera puede mandarlo
  // ...
}
```

## Authorization

```typescript
// ✅ CORRECTO - Verificar permisos
async function getDocument(docId: string, userId: string) {
  const doc = await db.documents.findUnique({ where: { id: docId } });
  
  if (!doc) {
    throw new NotFoundError();
  }
  
  if (doc.ownerId !== userId && !doc.sharedWith.includes(userId)) {
    throw new ForbiddenError();  // No solo 404, sino 403
  }
  
  return doc;
}

// ❌ PROHIBIDO - Solo verificar existencia
async function getDocument(docId: string) {
  return db.documents.findUnique({ where: { id: docId } });
  // Cualquier usuario puede ver cualquier documento
}
```

## Passwords

```typescript
// ✅ CORRECTO - Usar bcrypt/argon2
import { hash, compare } from 'bcrypt';

const hashedPassword = await hash(password, 12);
const isValid = await compare(inputPassword, hashedPassword);

// ❌ PROHIBIDO
const hashedPassword = md5(password);  // MD5 es inseguro
const hashedPassword = sha256(password);  // Sin salt es inseguro
if (password === storedPassword)  // Nunca guardar plain text
```

## Rate Limiting

```typescript
// Para APIs públicas, siempre rate limit
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  // ...
}
```

## Headers de Seguridad

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];
```

## Review Agent RECHAZA si:

- [ ] Secrets hardcodeados
- [ ] .env no está en .gitignore
- [ ] Input del usuario sin validar
- [ ] SQL raw con interpolation
- [ ] dangerouslySetInnerHTML con user input
- [ ] Rutas protegidas sin auth check
- [ ] Passwords sin hash
- [ ] APIs públicas sin rate limit
