#!/usr/bin/env bun

/**
 * KaosTC Progress Canvas
 * Muestra progreso del pipeline en panel tmux separado
 */

import { spawn } from "child_process";

interface ProgressState {
  project: string;
  milestone: { current: number; total: number; name: string };
  phase: string;
  status: "running" | "paused" | "done" | "error";
  steps: { name: string; done: boolean }[];
  startTime: Date;
}

const state: ProgressState = {
  project: process.argv[2] || "Unknown",
  milestone: { current: 1, total: 1, name: "Setup" },
  phase: "FASE 0",
  status: "running",
  steps: [],
  startTime: new Date(),
};

function clearScreen() {
  process.stdout.write("\x1B[2J\x1B[0;0H");
}

function elapsed(): string {
  const diff = Date.now() - state.startTime.getTime();
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

function progressBar(current: number, total: number, width: number = 20): string {
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}

function render() {
  clearScreen();
  
  const percent = Math.round((state.milestone.current / state.milestone.total) * 100);
  
  console.log(`
┌─────────────────────────────────────────┐
│  🚀 KAOSTC - Pipeline Progress          │
├─────────────────────────────────────────┤
│  Proyecto: ${state.project.padEnd(28)}│
│  Milestone: ${state.milestone.current}/${state.milestone.total} - ${state.milestone.name.slice(0,20).padEnd(20)}│
│  Fase: ${state.phase.padEnd(32)}│
│  ${progressBar(state.milestone.current, state.milestone.total)} ${percent}%      │
│  Tiempo: ${elapsed().padEnd(30)}│
├─────────────────────────────────────────┤`);

  // Mostrar milestones
  for (let i = 1; i <= state.milestone.total; i++) {
    const icon = i < state.milestone.current ? "✓" : i === state.milestone.current ? "→" : "○";
    const style = i < state.milestone.current ? "done" : i === state.milestone.current ? "current" : "pending";
    console.log(`│  ${icon} M${i}: ${"Milestone " + i}`.padEnd(42) + "│");
  }
  
  console.log(`└─────────────────────────────────────────┘

  Status: ${state.status.toUpperCase()}
  
  Ctrl+C para cerrar este panel
`);
}

// Leer updates desde stdin (pipe desde el pipeline)
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data: string) => {
  try {
    const update = JSON.parse(data.trim());
    Object.assign(state, update);
    render();
  } catch {
    // Ignorar datos no-JSON
  }
});

// Render inicial
render();

// Refresh cada 5 segundos
setInterval(render, 5000);
