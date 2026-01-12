# Database Rules

Reglas absolutas para manejo de base de datos. Aplican a todos los agentes.

**⚠️ Para reglas de performance (paginación, N+1, índices), ver `skills/performance/SKILL.md`**
**⚠️ Para deploy en Vercel con Prisma/Drizzle, ver `skills/vercel-deploy/SKILL.md`**

## Reglas Inquebrantables

### 1. SIEMPRE usar ORM
- Next.js/Vercel: Drizzle o Prisma
- SwiftUI: Core Data o SwiftData
- NUNCA queries SQL raw
- NUNCA string interpolation en queries

### 2. SIEMPRE generar migraciones
- Cada cambio de schema = migración
- Migraciones versionadas y trackeables
- Schema y migración se commitean juntos

### 3. NUNCA modificar DB directamente
- No usar cliente de DB para cambios manuales
- No scripts SQL sueltos
- Todo cambio pasa por ORM + migración

### 4. NUNCA secrets de DB en código
- Connection strings en .env
- .env en .gitignore
- Usar variables de entorno

## Proceso para cambios de schema

```
1. Modificar schema en código (schema.ts / models)
        ↓
2. Generar migración
   - Drizzle: npx drizzle-kit generate
   - Prisma: npx prisma migrate dev
        ↓
3. Revisar migración generada
        ↓
4. Aplicar en dev
   - Drizzle: npx drizzle-kit migrate
   - Prisma: npx prisma migrate deploy
        ↓
5. Testear que funcione
        ↓
6. Commitear: schema + migración juntos
```

## Patterns permitidos

```typescript
// ✅ CORRECTO - Usando ORM
const users = await db.select().from(usersTable).where(eq(usersTable.id, id));

// ✅ CORRECTO - Insert con ORM
await db.insert(usersTable).values({ name, email });

// ✅ CORRECTO - Transaction con ORM
await db.transaction(async (tx) => {
  await tx.insert(ordersTable).values(order);
  await tx.update(inventoryTable).set({ stock: sql`stock - 1` });
});
```

## Patterns PROHIBIDOS

```typescript
// ❌ PROHIBIDO - SQL raw
await db.execute(`SELECT * FROM users WHERE id = ${id}`);

// ❌ PROHIBIDO - String interpolation (SQL injection)
const query = `SELECT * FROM users WHERE name = '${name}'`;

// ❌ PROHIBIDO - Cambio de schema sin migración
// Modificar tabla directamente en DB client

// ❌ PROHIBIDO - Secrets hardcodeados
const db = new Database("postgresql://user:password@localhost:5432/db");
```

## El Review Agent RECHAZA si:

- [ ] Hay SQL raw sin justificación documentada
- [ ] Schema cambió pero no hay migración
- [ ] Hay migración pero no coincide con schema
- [ ] Connection string hardcodeada
- [ ] Falta validación de input antes de query

## Excepciones (requieren aprobación explícita)

En casos extremos donde el ORM no puede hacer algo:
1. Documentar POR QUÉ el ORM no alcanza
2. Usar prepared statements con parámetros
3. Agregar comentario `// RAW_SQL_JUSTIFIED: [razón]`
4. El review agent lo flaggea para revisión manual

## Por stack

### Drizzle (Next.js)
```typescript
// Schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
});

// Migración: npx drizzle-kit generate
// Aplicar: npx drizzle-kit migrate
```

### Prisma (Next.js)
```prisma
// schema.prisma
model User {
  id   Int    @id @default(autoincrement())
  name String
}

// Migración: npx prisma migrate dev --name add_users
```

### SwiftData (iOS)
```swift
@Model
class User {
    var id: UUID
    var name: String
    
    init(name: String) {
        self.id = UUID()
        self.name = name
    }
}

// Migraciones automáticas con VersionedSchema
```

### Core Data (iOS legacy)
```swift
// Usar NSManagedObject subclasses
// Migraciones con mapping models
// NUNCA ejecutar SQL directo en SQLite subyacente
```
