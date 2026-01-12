---
name: feature
description: Agregar feature a proyecto existente. Versión más rápida de /do.
---

# /feature

Agrega una feature a un proyecto existente. Asume que ya hay código base.

---

## Uso

```bash
/feature "agregar botón de exportar a CSV"
/feature "cambiar el color del header a azul"
```

---

## Diferencia con /do

| /do | /feature |
|-----|----------|
| Proyecto desde cero | Proyecto existente |
| Spec completa | Mini-spec |
| 8 fases | 5 fases |
| Muchos archivos | Pocos archivos |

---

## Pipeline

```
/feature "cambio"
    │
    ├──▶ FASE 1: ENTENDER
    │    Leer código existente
    │    Mini-spec (3-5 líneas)
    │    ⏸️ Confirmar entendimiento
    │
    ├──▶ FASE 2: DEV
    │    Invocar: dev agent
    │
    ├──▶ FASE 3: VERIFY
    │    pnpm run dev + verificar
    │
    ├──▶ FASE 4: REVIEW (rápido)
    │    Invocar: review agent
    │
    └──▶ FASE 5: COMMIT
         Invocar: devops agent
```

---

## FASE 1: ENTENDER ⏸️

1. Buscar archivos relacionados:
```bash
grep -r "keyword" --include="*.tsx" -l
```

2. Leer archivos relevantes

3. Mini-spec:
```
Cambio: [qué]
Archivos: [cuáles]
Impacto: [qué puede romperse]
```

**Esperar:** "¿Entendí bien?"

---

## FASE 2: DEV

**Invocar dev agent:**
```
Use the dev agent to implement this change: [descripción]
Files to modify: [lista]
```

---

## FASE 3: VERIFY

```bash
pnpm run dev
```

Verificar visualmente que:
- [ ] La app carga
- [ ] El cambio funciona
- [ ] No hay errores en consola

---

## FASE 4: REVIEW (rápido)

**Invocar review agent:**
```
Use the review agent to do a quick review of the changes
Focus on: security, breaking changes
```

Solo busca:
- Vulnerabilidades obvias
- Cambios que rompen cosas

---

## FASE 5: COMMIT

**Invocar devops agent:**
```
Use the devops agent to commit with message: fix/feat(scope): [descripción]
```

---

## Output

```
✅ FEATURE: [descripción]

Archivos modificados:
- path/to/file.tsx

Commit: [hash]

Tiempo: X minutos
```
