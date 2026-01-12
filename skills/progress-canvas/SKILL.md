# Progress Canvas

Muestra progreso del pipeline en un panel tmux separado.

## Requisitos

- tmux (estar corriendo dentro de tmux)
- Bun (`brew install bun`)

## Iniciar Canvas

Al comenzar el pipeline, crear panel de progreso:

```bash
# Verificar que estamos en tmux
if [ -n "$TMUX" ]; then
  # Crear panel a la derecha (30% del ancho)
  tmux split-window -h -p 30 "bun run .claude/tools/progress-canvas/show-progress.ts '$PROJECT_NAME'"
  PROGRESS_PANE=$(tmux display-message -p '#{pane_id}')
fi
```

## Enviar Actualizaciones

Durante el pipeline, enviar updates al panel:

```bash
# Función helper
update_progress() {
  if [ -n "$PROGRESS_PANE" ]; then
    echo "$1" | tmux send-keys -t "$PROGRESS_PANE" "$1" Enter
  fi
}

# Ejemplos de uso
update_progress '{"phase": "FASE 1: Spec", "milestone": {"current": 1, "total": 5, "name": "Foundation"}}'
update_progress '{"phase": "FASE 3: Dev", "status": "running"}'
update_progress '{"milestone": {"current": 2, "total": 5, "name": "Pipeline"}}'
```

## Estructura del Update

```typescript
interface ProgressUpdate {
  project?: string;
  milestone?: {
    current: number;
    total: number;
    name: string;
  };
  phase?: string;
  status?: "running" | "paused" | "done" | "error";
  steps?: { name: string; done: boolean }[];
}
```

## Integración con do.md

### FASE 0 - Iniciar canvas
```bash
# Al detectar proyecto
if [ -n "$TMUX" ]; then
  tmux split-window -h -p 30 "bun run .claude/tools/progress-canvas/show-progress.ts '$PROJECT_NAME'"
fi
```

### Cada cambio de fase
```bash
update_progress '{"phase": "FASE 3: Dev"}'
```

### Cada milestone completado
```bash
update_progress '{"milestone": {"current": 2, "total": 5, "name": "Pipeline"}}'
```

### Al terminar
```bash
update_progress '{"status": "done"}'
# Cerrar panel después de 10 segundos
sleep 10 && tmux kill-pane -t "$PROGRESS_PANE"
```

## Sin tmux

Si no está en tmux, el pipeline funciona normal sin panel de progreso.
El skill detecta `$TMUX` y solo activa el canvas si existe.

## Visualización

```
┌─────────────────────────────────────────┐
│  🚀 KAOSTC - Pipeline Progress          │
├─────────────────────────────────────────┤
│  Proyecto: CRM                          │
│  Milestone: 3/5 - Leads                 │
│  Fase: FASE 3: Dev                      │
│  ████████████░░░░░░░░ 60%               │
│  Tiempo: 45m 23s                        │
├─────────────────────────────────────────┤
│  ✓ M1: Foundation                       │
│  ✓ M2: Pipeline                         │
│  → M3: Leads                            │
│  ○ M4: Email                            │
│  ○ M5: Dashboard                        │
└─────────────────────────────────────────┘
```
