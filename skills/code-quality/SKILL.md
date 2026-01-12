# Code Quality

Reglas de calidad de código que el review agent verifica como gate.

## Reglas Absolutas

Estas son **blockers**. Si el código viola alguna, el review falla.

### No SQL raw
```typescript
// ❌ BLOCKER
db.execute(`SELECT * FROM users WHERE id = ${id}`);
await prisma.$queryRaw`SELECT * FROM users`;

// ✅ OK
await db.select().from(users).where(eq(users.id, id));
```

### No secrets hardcodeados
```typescript
// ❌ BLOCKER
const API_KEY = "sk-1234567890";
const stripe = new Stripe("sk_live_xxx");

// ✅ OK
const API_KEY = process.env.API_KEY;
```

### No catch vacíos
```typescript
// ❌ BLOCKER
try { ... } catch (e) {}
try { ... } catch (e) { console.log(e); }

// ✅ OK
try { ... } catch (e) {
  if (e instanceof ValidationError) {
    return { error: e.message };
  }
  throw e;
}
```

### No any en TypeScript
```typescript
// ❌ BLOCKER
function process(data: any) { ... }
const result = response as any;

// ✅ OK
function process(data: UserInput) { ... }
const result = response as ApiResponse;
```

### Input siempre validado
```typescript
// ❌ BLOCKER
export async function POST(req: Request) {
  const body = await req.json();
  await db.users.create({ data: body });  // Sin validar
}

// ✅ OK
export async function POST(req: Request) {
  const body = await req.json();
  const data = userSchema.parse(body);  // Validado
  await db.users.create({ data });
}
```

### Queries paginadas
```typescript
// ❌ BLOCKER (en listas públicas)
const users = await db.users.findMany();

// ✅ OK
const users = await db.users.findMany({ take: 20, skip: offset });
```

## Warnings

Estas no bloquean pero se reportan:

### Console.log en código final
```typescript
// ⚠️ WARNING
console.log("debug:", data);
```

### TODO/FIXME sin ticket
```typescript
// ⚠️ WARNING
// TODO: fix this later

// ✅ OK
// TODO(#123): fix race condition
```

### Funciones muy largas
```typescript
// ⚠️ WARNING - función > 50 líneas
function doEverything() {
  // 80 líneas de código
}
```

### Comentarios obvios
```typescript
// ⚠️ WARNING
// Increment counter
counter++;
```

## Checklist para Review

### Blockers (falla el review)
- [ ] SQL raw sin ORM
- [ ] Secrets en código
- [ ] Catch vacío o solo console.log
- [ ] `any` en TypeScript
- [ ] Input sin validar
- [ ] Listas sin paginación
- [ ] dangerouslySetInnerHTML con user input

### Warnings (se reportan pero no bloquean)
- [ ] console.log
- [ ] TODO sin ticket
- [ ] Funciones > 50 líneas
- [ ] Comentarios obvios
- [ ] Magic numbers sin constante

## Excepciones

Si algo parece violación pero tiene razón válida:
1. Debe tener comentario explicando por qué
2. El comentario debe referenciar decisión o ticket
3. Ejemplo: `// RAW_SQL: Using window function not supported by ORM (#456)`
