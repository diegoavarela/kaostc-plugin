---
name: architecture
description: Reglas de arquitectura para no diseñar cosas lentas o difíciles de mantener. LEER EN FASE DE PLAN.
---

# Architecture Constraints

Reglas para tomar buenas decisiones de arquitectura ANTES de codear.

## Data Fetching

### Principio: Cargar solo lo que se ve

- **MUST** paginar toda lista desde el diseño
- **NEVER** diseñar "cargar todo y filtrar en frontend"
- **MUST** definir límites antes de implementar (ej: "máximo 50 por página")
- **NEVER** cargar datos "por si acaso se necesitan"

```
❌ MAL DISEÑO
"El dashboard muestra todas las oportunidades de cada stage"

✅ BUEN DISEÑO  
"El dashboard muestra contadores por stage. 
Al hacer click en un stage, carga las primeras 20 oportunidades paginadas."
```

### Dropdowns y Selects

- **MUST** diseñar con búsqueda server-side si puede haber >50 opciones
- **NEVER** diseñar "cargar todos los X para el dropdown"
- **SHOULD** usar combobox con búsqueda en vez de select tradicional

```
❌ MAL DISEÑO
"El formulario tiene un dropdown con todos los contactos"

✅ BUEN DISEÑO
"El formulario tiene un combobox que busca contactos mientras escribís.
Muestra los primeros 10 resultados. Si no encuentra, puede crear nuevo."
```

### Dashboards y Reportes

- **MUST** usar agregaciones en DB, no calcular en app
- **NEVER** traer registros individuales para contar/sumar
- **MUST** definir qué métricas se muestran antes de implementar

```
❌ MAL DISEÑO
"Traer todas las oportunidades y sumar los valores en el frontend"

✅ BUEN DISEÑO
"Una query con SUM(value) GROUP BY stage"
```

### Relaciones y Datos Anidados

- **MUST** definir qué nivel de profundidad se necesita
- **NEVER** traer relaciones "por las dudas"
- **SHOULD** cargar relaciones on-demand (lazy) cuando no son críticas

```
❌ MAL DISEÑO
"Cargar contacto con todas sus actividades, oportunidades, y notas"

✅ BUEN DISEÑO
"Cargar contacto con datos básicos.
Actividades se cargan cuando el usuario abre la tab de actividades."
```

## API Design

### Endpoints

- **MUST** cada endpoint retorna solo lo necesario para su caso de uso
- **NEVER** un endpoint "que sirve para todo"
- **MUST** documentar límites en el plan (max items, max depth)

```
❌ MAL DISEÑO
GET /contacts → retorna todo de todos los contactos

✅ BUEN DISEÑO
GET /contacts?page=1&limit=20&fields=id,name,email
GET /contacts/:id → retorna contacto completo
GET /contacts/:id/activities?page=1&limit=10
```

### Bulk Operations

- **MUST** diseñar imports/exports como jobs async si >100 registros
- **NEVER** procesar bulk en el request HTTP
- **SHOULD** mostrar progreso al usuario

```
❌ MAL DISEÑO
"POST /import recibe CSV y procesa todo sincrónico"

✅ BUEN DISEÑO
"POST /import sube archivo y retorna jobId
GET /jobs/:id para ver progreso
Procesa en background en batches de 100"
```

## State Management

### Dónde vive cada dato

- **MUST** definir source of truth para cada dato
- **NEVER** duplicar estado entre server y client sin invalidación
- **SHOULD** preferir server state (SWR/React Query) sobre client state

```
❌ MAL DISEÑO
"Guardar lista de contactos en Redux y sincronizar manualmente"

✅ BUEN DISEÑO
"useSWR('/api/contacts') con revalidación automática"
```

### Cache

- **MUST** definir estrategia de cache en el plan
- **MUST** definir qué invalida el cache
- **NEVER** cachear sin plan de invalidación

## Checklist para FASE 2 (Plan)

Antes de aprobar un plan, verificar:

- [ ] ¿Toda lista tiene límite definido?
- [ ] ¿Dropdowns con muchas opciones tienen búsqueda server-side?
- [ ] ¿Dashboard usa agregaciones en DB?
- [ ] ¿Bulk operations son async?
- [ ] ¿Está claro qué datos se cargan en cada pantalla?
- [ ] ¿Hay estrategia de cache definida?

## Preguntas que el agente DEBE hacer

Si el spec no es claro en estos puntos, preguntar:

1. "¿Cuántos [X] puede haber? ¿Cientos, miles, millones?"
2. "¿Necesitás ver todos o solo los más recientes?"
3. "¿Este dropdown puede tener muchas opciones? ¿Necesita búsqueda?"
4. "¿Este reporte necesita datos en tiempo real o puede ser de hace 1 hora?"
