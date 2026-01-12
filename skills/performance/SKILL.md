---
name: performance
description: Constraints para evitar problemas de performance. LEER ANTES DE CODEAR.
---

# Performance Constraints

Reglas obligatorias para no crear código lento.

## Base de Datos

### Queries

- **MUST** usar `take` en TODA query que devuelve lista. Default: 50
- **NEVER** hacer `findMany()` sin límite
- **NEVER** hacer loop con queries adentro (N+1)
- **MUST** usar `select` para traer solo campos necesarios
- **NEVER** traer campos pesados (notes, descriptions, content) si solo necesitás nombre/id
- **MUST** usar `Promise.all` para queries paralelas independientes

```typescript
// ❌ PROHIBIDO
const contacts = await db.contacts.findMany()
const users = await db.users.findMany()
for (const contact of contacts) {
  contact.activities = await db.activities.findMany({ where: { contactId: contact.id }})
}

// ✅ CORRECTO
const [contacts, users] = await Promise.all([
  db.contacts.findMany({ 
    take: 50,
    select: { id: true, name: true, email: true }
  }),
  db.users.findMany({ 
    take: 50,
    select: { id: true, name: true }
  })
])
```

### Dropdowns y Selects

- **MUST** limitar opciones a máximo 50 registros
- **SHOULD** implementar búsqueda server-side si hay más de 50
- **NEVER** cargar todos los registros para un dropdown

```typescript
// ❌ PROHIBIDO - Dropdown que carga todo
const allContacts = await getContacts() // 10,000 registros
<Select options={allContacts.map(c => ({ value: c.id, label: c.name }))} />

// ✅ CORRECTO - Dropdown con límite
const contacts = await getContacts({ take: 50, orderBy: 'name' })
<Select 
  options={contacts} 
  onSearch={async (q) => searchContacts(q, { take: 50 })}
/>
```

### Búsquedas

- **MUST** agregar índice para campos que se buscan frecuentemente
- **NEVER** hacer `OR` con múltiples `contains` sin índices
- **SHOULD** usar full-text search para búsquedas complejas
- **MUST** limitar resultados de búsqueda (máximo 100)

```typescript
// ❌ PROHIBIDO - Full table scan
const results = await db.contacts.findMany({
  where: {
    OR: [
      { firstName: { contains: query } },
      { lastName: { contains: query } },
      { email: { contains: query } },
      { company: { contains: query } },
    ]
  }
})

// ✅ CORRECTO - Con índice y límite
const results = await db.contacts.findMany({
  where: { /* búsqueda */ },
  take: 50,
  select: { id: true, firstName: true, lastName: true, email: true }
})
```

### Índices requeridos

- **MUST** índice en campos de `WHERE` frecuentes
- **MUST** índice en campos de `ORDER BY`
- **MUST** índice en foreign keys
- **SHOULD** índice compuesto para queries con múltiples condiciones

```typescript
// Drizzle - agregar índices
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey(),
  email: varchar('email'),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  companyId: uuid('company_id'),
  createdAt: timestamp('created_at'),
}, (table) => ({
  emailIdx: index('contacts_email_idx').on(table.email),
  companyIdx: index('contacts_company_idx').on(table.companyId),
  createdAtIdx: index('contacts_created_at_idx').on(table.createdAt),
}))
```

### Importaciones/Bulk

- **NEVER** hacer query por cada fila en un loop
- **MUST** usar bulk operations
- **SHOULD** procesar en batches de 100

```typescript
// ❌ PROHIBIDO - 1000 filas = 1000 queries
for (const row of csvRows) {
  const existing = await db.contacts.findFirst({ where: { email: row.email }})
  if (!existing) await db.contacts.create({ data: row })
}

// ✅ CORRECTO - Bulk
const emails = csvRows.map(r => r.email)
const existing = await db.contacts.findMany({
  where: { email: { in: emails }},
  select: { email: true }
})
const existingEmails = new Set(existing.map(e => e.email))
const newRows = csvRows.filter(r => !existingEmails.has(r.email))
await db.contacts.createMany({ data: newRows })
```

## Frontend

### Data Fetching

- **MUST** usar `Promise.all` para fetches independientes
- **NEVER** hacer fetches secuenciales si son independientes
- **SHOULD** usar SWR/React Query para cache client-side

```typescript
// ❌ PROHIBIDO
const countries = await getCountries()
const industries = await getIndustries()

// ✅ CORRECTO
const [countries, industries] = await Promise.all([
  getCountries(),
  getIndustries()
])
```

### Componentes

- **SHOULD** usar `useMemo` para cálculos costosos
- **SHOULD** usar `useCallback` para handlers pasados a children
- **NEVER** crear objetos/arrays nuevos en render sin memoizar
- **MUST** usar `key` estable en listas (nunca index)

### Lazy Loading

- **SHOULD** lazy load componentes pesados (charts, editors, maps)
- **SHOULD** lazy load modales que no se ven al inicio

## API

- **MUST** paginar endpoints que devuelven listas
- **MUST** documentar `take` default y máximo
- **SHOULD** cachear respuestas que no cambian frecuentemente
- **NEVER** devolver campos sensibles o innecesarios

## Checklist pre-commit

- [ ] ¿Todas las queries de lista tienen `take`?
- [ ] ¿Hay algún loop con query adentro?
- [ ] ¿Los dropdowns cargan máximo 50 items?
- [ ] ¿Las búsquedas tienen límite?
- [ ] ¿Los campos buscados tienen índice?
- [ ] ¿Los fetches independientes usan Promise.all?
