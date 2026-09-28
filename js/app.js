// CPU Scheduling Visualizer - Main Application
// Pure vanilla JS + Tailwind CSS (ES Module)
// Clean professional UI with SVG icons, in-place updates, responsive layout, and modern comparative charts.

import { runScheduler, validateProcesses } from './scheduler.js';

// Professional SVG Vector Icons (Heroicons / Lucide design)
const ICONS = {
  cpu: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>`,
  sparkles: `<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>`,
  clock: `<svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  playCircle: `<svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
  chartBar: `<svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
  trophy: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3h14a2 2 0 012 2v2a4 4 0 01-4 4h-.5a6.002 6.002 0 01-5.5 4.5V18h3a1 1 0 011 1v2H9v-2a1 1 0 011-1h3v-2.5A6.002 6.002 0 017.5 11H7a4 4 0 01-4-4V5a2 2 0 012-2zm0 2v2a2 2 0 002 2h.5V5H5zm14 0h-2.5v4H17a2 2 0 002-2V5z" /></svg>`,
  check: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>`,
  arrowRight: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>`,
  arrowLeft: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>`,
  sun: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
  moon: `<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`,
  play: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>`,
  pause: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
  stepForward: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>`,
  stepBack: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>`,
  refresh: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>`,
  trash: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
  plus: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`,
  alert: `<svg class="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`,
  academic: `<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>`,
  edit: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
};

const ALGORITHMS = {
  fcfs: {
    name: 'First Come First Serve (FCFS)',
    short: 'FCFS',
    type: 'Non-preemptive',
    desc: 'Executes processes strictly in arrival order. Simple and fair arrival ordering, but susceptible to the convoy effect.',
  },
  sjf: {
    name: 'Shortest Job First (SJF)',
    short: 'SJF',
    type: 'Non-preemptive',
    desc: 'Selects the arrived process with the shortest burst time. Minimizes average waiting time for non-preemptive workloads.',
  },
  priority: {
    name: 'Priority Scheduling',
    short: 'Priority',
    type: 'Non-preemptive',
    desc: 'Executes the process with the highest priority (lowest numeric value). Tie-breaks by arrival time and ID.',
  },
  rr: {
    name: 'Round Robin (RR)',
    short: 'Round Robin',
    type: 'Preemptive',
    desc: 'Allocates CPU in cyclic time slices (quantum) using a FIFO ready queue. Responsive for time-sharing systems.',
  },
  srtf: {
    name: 'Shortest Remaining Time First (SRTF)',
    short: 'SRTF',
    type: 'Preemptive',
    desc: 'Preemptive variant of SJF. Re-evaluates ready processes each time unit, switching to the shortest remaining burst.',
  },
  ljf: {
    name: 'Longest Job First (LJF)',
    short: 'LJF',
    type: 'Non-preemptive',
    desc: 'Selects the arrived process with the largest burst time. Useful for demonstrating worst-case scheduling delays.',
  },
};

const PRESETS = {
  report: {
    name: 'Report Benchmark (Table 6.1)',
    processes: [
      { id: 'P1', at: 0, bt: 5, priority: 2 },
      { id: 'P2', at: 1, bt: 3, priority: 1 },
      { id: 'P3', at: 2, bt: 8, priority: 3 },
      { id: 'P4', at: 4, bt: 2, priority: 2 },
      { id: 'P5', at: 2, bt: 1, priority: 1 },
    ],
  },
  simple: {
    name: 'Classic 4-Process',
    processes: [
      { id: 'P1', at: 0, bt: 6, priority: 3 },
      { id: 'P2', at: 1, bt: 3, priority: 1 },
      { id: 'P3', at: 2, bt: 8, priority: 2 },
      { id: 'P4', at: 3, bt: 2, priority: 1 },
    ],
  },
  idle: {
    name: 'With CPU Idle Gaps',
    processes: [
      { id: 'P1', at: 0, bt: 3, priority: 1 },
      { id: 'P2', at: 6, bt: 4, priority: 2 },
      { id: 'P3', at: 8, bt: 2, priority: 3 },
    ],
  },
  convoy: {
    name: 'Convoy Effect Demonstration',
    processes: [
      { id: 'P1', at: 0, bt: 18, priority: 2 },
      { id: 'P2', at: 1, bt: 2, priority: 1 },
      { id: 'P3', at: 2, bt: 2, priority: 1 },
      { id: 'P4', at: 3, bt: 1, priority: 1 },
    ],
  },
};

const STEPS = [
  { id: 'intro', label: 'Overview' },
  { id: 'identity', label: 'Course Info' },
  { id: 'configure', label: '1. Processes' },
  { id: 'algorithm', label: '2. Algorithm' },
  { id: 'review', label: '3. Review' },
  { id: 'compare-setup', label: '4. Setup' },
  { id: 'comparison', label: '5. Compare' },
  { id: 'end', label: 'Complete' },
];

const state = {
  view: 'intro',
  processes: JSON.parse(JSON.stringify(PRESETS.report.processes)),
  selectedAlgo: 'fcfs',
  quantum: 2,
  comparisonAlgos: ['fcfs', 'sjf', 'rr', 'priority', 'srtf', 'ljf'],
  comparisonQuantums: { rr: 2 },
  validationErrors: [],
  darkMode: localStorage.getItem('cpuDarkMode') !== 'false',
  playback: {
    currentTime: 0,
    isPlaying: false,
    speed: 1,
    timerId: null,
  },
};

function applyTheme() {
  if (state.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function fmt(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

const PALETTE = [
  '#4f46e5', // indigo
  '#0284c7', // sky
  '#059669', // emerald
  '#d97706', // amber
  '#e11d48', // rose
  '#7c3aed', // violet
  '#0891b2', // cyan
  '#65a30d', // lime
  '#c026d3', // fuchsia
];

function colorForId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

// Gantt Chart Renderer
function renderGantt(gantt, options = {}) {
  const { compact = false, maxTime = null, highlightTime = null } = options;
  if (!gantt || !gantt.length) {
    return '<p class="text-slate-400 dark:text-slate-500 text-sm italic py-4 text-center">No execution segments recorded.</p>';
  }

  const totalEnd = maxTime || gantt[gantt.length - 1].end;
  if (totalEnd === 0) return '';

  const segmentsHtml = gantt.map((seg) => {
    const isIdle = seg.id === 'IDLE';
    const dur = seg.end - seg.start;
    const pctStart = (seg.start / totalEnd) * 100;
    const pctWidth = (dur / totalEnd) * 100;
    const color = isIdle ? '#64748b' : colorForId(seg.id);
    const isCurrent = highlightTime !== null && highlightTime >= seg.start && highlightTime < seg.end;

    return `
      <div data-start="${seg.start}" data-end="${seg.end}"
           class="gantt-bar group absolute top-0 bottom-0 flex flex-col justify-center items-center ${isCurrent ? 'ring-2 ring-amber-400 z-10' : ''}"
           style="left: ${pctStart}%; width: ${pctWidth}%; background-color: ${color}; ${isIdle ? 'background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 6px, transparent 6px 12px);' : ''}">
        
        <!-- Tooltip -->
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-mono px-2 py-0.5 rounded shadow pointer-events-none z-30 whitespace-nowrap">
          ${isIdle ? 'CPU IDLE' : escapeHtml(seg.id)}: [${seg.start} → ${seg.end}] (${dur}u)
        </div>

        <!-- Label -->
        <span class="text-xs font-bold text-white drop-shadow-sm truncate px-1 pointer-events-none">
          ${isIdle ? 'IDLE' : escapeHtml(seg.id)}
        </span>
        ${!compact && dur > 1 ? `<span class="text-[10px] text-white/80 font-mono pointer-events-none">(${dur})</span>` : ''}
      </div>
    `;
  }).join('');

  // Timeline scale ticks
  const tickCount = Math.min(12, totalEnd);
  const step = Math.max(1, Math.round(totalEnd / tickCount));
  const tickSet = new Set([0, totalEnd]);
  for (let t = 0; t <= totalEnd; t += step) tickSet.add(t);
  const sortedTicks = Array.from(tickSet).sort((a, b) => a - b);

  const ticksHtml = sortedTicks.map((t) => {
    const leftPct = (t / totalEnd) * 100;
    return `
      <div class="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none" style="left: ${leftPct}%;">
        <span class="h-1.5 w-px bg-slate-300 dark:bg-slate-700"></span>
        <span class="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">${t}</span>
      </div>
    `;
  }).join('');

  // Current playback time cursor
  const cursorHtml = highlightTime !== null ? `
    <div id="timelineCursor" class="cursor-timeline absolute top-0 bottom-0 w-0.5 bg-amber-500 z-20 pointer-events-none" style="left: ${(highlightTime / totalEnd) * 100}%">
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45 shadow"></div>
      <div id="cursorLabel" class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold px-1 rounded shadow whitespace-nowrap">t=${highlightTime}</div>
    </div>
  ` : '';

  return `
    <div class="relative w-full pt-1 pb-6 select-none overflow-x-auto" id="ganttChartContainer" data-total-end="${totalEnd}">
      <div class="relative ${compact ? 'h-10' : 'h-16'} rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-inner min-w-[280px]">
        ${segmentsHtml}
        ${cursorHtml}
      </div>
      <div class="relative w-full h-4 mt-1 min-w-[280px]">
        ${ticksHtml}
      </div>
    </div>
  `;
}

// Navigation Header
function headerView() {
  const currentIdx = STEPS.findIndex((s) => s.id === state.view);

  const pills = STEPS.map((s, idx) => {
    const isActive = s.id === state.view;
    const isCompleted = idx < currentIdx;
    return `
      <button onclick="app.goTo('${s.id}')"
        class="btn-action flex-shrink-0 flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
          isActive
            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
            : isCompleted
            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }">
        <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
          isActive
            ? 'bg-white text-indigo-600 font-bold'
            : isCompleted
            ? 'bg-emerald-600 text-white font-bold'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }">
          ${isCompleted ? ICONS.check : idx}
        </span>
        <span class="hidden md:inline">${escapeHtml(s.label)}</span>
      </button>
    `;
  }).join('');

  return `
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
        <div class="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            ${ICONS.cpu}
          </div>
          <div>
            <h1 class="text-xs sm:text-sm font-bold leading-tight text-slate-900 dark:text-white">CPU Scheduling Visualizer</h1>
            <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">CSE362 Lab Project</p>
          </div>
        </div>

        <nav class="flex items-center gap-1 overflow-x-auto py-1 scroll-smooth">
          ${pills}
        </nav>

        <button id="themeToggleBtn" onclick="app.toggleDark()"
          class="theme-toggle-btn p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
          title="Toggle Dark / Light Mode">
          ${state.darkMode ? ICONS.moon : ICONS.sun}
        </button>
      </div>
    </header>
  `;
}

// 0. Intro Screen
function introView() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div class="text-center mb-8 sm:mb-12">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200/50 dark:border-indigo-800/50">
          ${ICONS.sparkles}
          <span>Operating Systems Lab Project</span>
        </div>
        
        <!-- Properly styled title with no descender clipping -->
        <h2 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.25] pb-2">
          CPU Scheduling <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent inline-block pb-1">Visualizer</span>
        </h2>
        
        <p class="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Interactive simulation and comprehensive comparison of six foundational CPU scheduling algorithms:
          <span class="font-semibold text-indigo-600 dark:text-indigo-400">FCFS, SJF, Priority, Round Robin, SRTF, and LJF</span>.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <div class="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center mb-4">
            ${ICONS.clock}
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white mb-1">6 Core Algorithms</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Covers both preemptive and non-preemptive algorithms with precise tie-breaking and timeline idle detection.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center mb-4">
            ${ICONS.playCircle}
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white mb-1">Interactive Gantt Playback</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Step forward/backward unit by unit or animate the CPU clock to observe context switches in real time.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center mb-4">
            ${ICONS.chartBar}
          </div>
          <h3 class="font-bold text-slate-900 dark:text-white mb-1">Side-by-Side Comparison</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Compare Average Waiting Time, Turnaround Time, and CPU Idle Time across algorithms on identical workloads.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <button onclick="app.goTo('identity')" class="btn-action w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
          <span>Start Simulation</span>
          ${ICONS.arrowRight}
        </button>
        <button onclick="app.loadPresetAndReview('report')" class="btn-action w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 text-center">
          Load Report Benchmark (Table 6.1)
        </button>
        <button onclick="app.goTo('identity')" class="btn-action w-full sm:w-auto px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm flex items-center justify-center gap-1.5">
          ${ICONS.academic}
          <span>Course Details</span>
        </button>
      </div>
    </div>
  `;
}

// 1. Identity Screen (Course & Group Details)
function identityView() {
  return `
    <div class="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Project Identity</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Course & Group Details</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic context and project contributors from the reference report.</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-5 sm:p-6 mb-6 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-xs uppercase font-semibold text-slate-400">Course Code</span>
            <p class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">CSE362 (Operating Systems)</p>
          </div>
          <div>
            <span class="text-xs uppercase font-semibold text-slate-400">Section</span>
            <p class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">04</p>
          </div>
          <div class="sm:col-span-2">
            <span class="text-xs uppercase font-semibold text-slate-400">Project Title</span>
            <p class="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
              Designing algorithm visualizer for CPU scheduling algorithms
            </p>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Group Members</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p class="font-bold text-slate-900 dark:text-white text-sm">Jannat Hossain</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: 202300000020</p>
              <span class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">Batch 64</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p class="font-bold text-slate-900 dark:text-white text-sm">Attini Aziz Ditiya</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: 2023000000164</p>
              <span class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">Batch 64</span>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p class="font-bold text-slate-900 dark:text-white text-sm">Kazi Abu Rahid</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: 2023000000146</p>
              <span class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">Batch 63</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('intro')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.goTo('configure')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Step 1: Configure Processes</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// Render the process rows for the configure table
function renderProcessRows() {
  return state.processes.map((p, i) => `
    <tr data-process-idx="${i}" class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td class="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
        <input type="text" value="${escapeHtml(p.id)}" onchange="app.updateProcess(${i}, 'id', this.value)"
          class="w-20 px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-indigo-500 font-mono font-semibold outline-none text-sm">
      </td>
      <td class="px-4 py-3">
        <input type="number" min="0" value="${p.at}" onchange="app.updateProcess(${i}, 'at', this.value)"
          class="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
      </td>
      <td class="px-4 py-3">
        <input type="number" min="1" value="${p.bt}" onchange="app.updateProcess(${i}, 'bt', this.value)"
          class="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
      </td>
      <td class="px-4 py-3">
        <input type="number" min="1" value="${p.priority}" onchange="app.updateProcess(${i}, 'priority', this.value)"
          class="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none">
      </td>
      <td class="px-4 py-3 text-right">
        <button onclick="app.removeProcess(${i})" class="btn-action text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-flex items-center justify-center" title="Delete Process">
          ${ICONS.trash}
        </button>
      </td>
    </tr>
  `).join('');
}

// 2. Step 1: Configure Processes
function configureView() {
  const errorsHtml = state.validationErrors.length ? `
    <div id="validationContainer" class="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-1">
      <div class="font-bold flex items-center gap-1.5 text-sm">
        ${ICONS.alert}
        <span>Please fix the following configuration errors:</span>
      </div>
      <ul class="list-disc list-inside">
        ${state.validationErrors.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}
      </ul>
    </div>
  ` : '<div id="validationContainer"></div>';

  return `
    <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 1 of 5</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Configure Processes</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set Arrival Time (AT &ge; 0), Burst Time (BT &ge; 1), and Priority (&ge; 1, lower number = higher priority).
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <select onchange="app.loadPreset(this.value)" class="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="">Load Preset Workload...</option>
            ${Object.entries(PRESETS).map(([k, v]) => `<option value="${k}">${escapeHtml(v.name)}</option>`).join('')}
          </select>
          <button onclick="app.addProcess()" class="btn-action px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm">
            ${ICONS.plus}
            <span>Add Process</span>
          </button>
        </div>
      </div>

      ${errorsHtml}

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[520px]">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th class="px-4 py-3">Process ID</th>
                <th class="px-4 py-3">Arrival Time (AT)</th>
                <th class="px-4 py-3">Burst Time (BT)</th>
                <th class="px-4 py-3">Priority</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="processTableBody" class="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-sm">
              ${renderProcessRows()}
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('identity')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.validateAndContinue('algorithm')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Step 2: Choose Algorithm</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 3. Step 2: Choose Algorithm & Comparison Setup
function algorithmView() {
  const algoCards = Object.entries(ALGORITHMS).map(([key, a]) => {
    const isSelected = state.selectedAlgo === key;
    const isPreemptive = a.type === 'Preemptive';

    return `
      <div id="algo-card-${key}" onclick="app.selectAlgo('${key}')"
        class="card-interactive cursor-pointer p-4 sm:p-5 rounded-2xl border-2 ${
          isSelected
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
        }">
        <div class="flex items-center justify-between gap-2 mb-2">
          <h3 class="font-bold text-slate-900 dark:text-white text-base">${escapeHtml(a.name)}</h3>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isPreemptive
              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
          }">
            ${a.type}
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${escapeHtml(a.desc)}</p>
      </div>
    `;
  }).join('');

  // Comparison checkboxes
  const compCheckboxes = Object.entries(ALGORITHMS).map(([key, a]) => {
    const isChecked = state.comparisonAlgos.includes(key);
    return `
      <label id="comp-label-${key}" class="card-interactive flex items-center gap-2.5 p-3 rounded-xl border ${
        isChecked ? 'border-indigo-500/60 bg-indigo-50/30 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
      } cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60">
        <input type="checkbox" id="comp-check-${key}" ${isChecked ? 'checked' : ''} onchange="app.toggleComparisonAlgo('${key}')"
          class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500">
        <div class="text-xs">
          <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHtml(a.short)}</span>
          <span class="text-[10px] text-slate-400 block">${a.type}</span>
        </div>
      </label>
    `;
  }).join('');

  const isRR = state.selectedAlgo === 'rr' || state.comparisonAlgos.includes('rr');

  return `
    <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 2 of 5</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Choose An Algorithm</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Pick the primary algorithm to visualize now, and choose which algorithms to compare in Step 5.</p>
      </div>

      <div class="mb-8">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Primary Algorithm to Visualize</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="algoCardsGrid">
          ${algoCards}
        </div>
      </div>

      <div id="rrQuantumContainer" class="${isRR ? 'block' : 'hidden'} bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white text-sm">Round Robin Time Quantum (q)</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Maximum CPU time allocated per process per round.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Quantum:</span>
            <input type="number" min="1" id="quantumMainInput" value="${state.quantum}" onchange="app.setQuantum(this.value)"
              class="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 mb-8">
        <div class="flex items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-sm">Select Algorithms for Comparison</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose at least two algorithms to evaluate side by side.</p>
          </div>
          <button onclick="app.selectAllComparisonAlgos()" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Select All
          </button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="comparisonCheckGrid">
          ${compCheckboxes}
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('configure')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.validateAndContinue('review')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Step 3: Review The Schedule</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 4. Step 3: Review Schedule & Interactive Playback
function reviewView() {
  const result = runScheduler(state.processes, state.selectedAlgo, state.quantum);
  const totalMakespan = result.makespan;
  const currentT = state.playback.currentTime;

  // Active process at currentT
  const activeSeg = result.gantt.find((s) => currentT >= s.start && currentT < s.end);
  const activeLabel = activeSeg ? (activeSeg.id === 'IDLE' ? 'CPU IDLE' : activeSeg.id) : (currentT >= totalMakespan ? 'Execution Completed' : 'Waiting');

  // Metrics Table Rows
  const tableRows = result.rows.map((row) => {
    const color = colorForId(row.id);
    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors font-mono text-sm">
        <td class="px-4 py-3 font-bold flex items-center gap-2">
          <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${color}"></span>
          <span class="text-slate-900 dark:text-white">${escapeHtml(row.id)}</span>
        </td>
        <td class="px-4 py-3">${row.at}</td>
        <td class="px-4 py-3 font-semibold">${row.bt}</td>
        <td class="px-4 py-3">${row.priority}</td>
        <td class="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">${row.ct}</td>
        <td class="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">${row.tat}</td>
        <td class="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">${row.wt}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 3 of 5</span>
          <div class="flex items-center gap-3 mt-1 flex-wrap">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Review The Schedule</h2>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ${escapeHtml(ALGORITHMS[state.selectedAlgo].name)}
            </span>
          </div>
        </div>

        <button onclick="app.resetPlayback()" class="btn-action w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.refresh}
          <span>Reset Playback</span>
        </button>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Waiting Time</span>
          <p class="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">${fmt(result.avgWt)}</p>
          <span class="text-[10px] text-slate-400 font-mono">avg WT = &Sigma;WT / N</span>
        </div>
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Turnaround</span>
          <p class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">${fmt(result.avgTat)}</p>
          <span class="text-[10px] text-slate-400 font-mono">avg TAT = &Sigma;TAT / N</span>
        </div>
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Makespan</span>
          <p class="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">${result.makespan}</p>
          <span class="text-[10px] text-slate-400 font-mono">completion of last job</span>
        </div>
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">CPU Idle Time</span>
          <p class="text-2xl sm:text-3xl font-extrabold text-slate-600 dark:text-slate-300 mt-1">${fmt(result.idle)}</p>
          <span class="text-[10px] text-slate-400 font-mono">unallocated CPU cycles</span>
        </div>
      </div>

      <!-- Gantt Chart Section -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm mb-6">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 class="font-bold text-slate-900 dark:text-white text-base">Gantt Chart Timeline</h3>
          <span class="text-xs font-mono text-slate-400">Total duration: ${totalMakespan} time units</span>
        </div>

        ${renderGantt(result.gantt, { highlightTime: currentT })}

        <!-- Interactive Playback Toolbar -->
        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="app.stepBack()" class="btn-action p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" title="Step Back (t-1)">
              ${ICONS.stepBack}
            </button>
            <button id="playbackPlayBtn" onclick="app.togglePlay()" class="btn-action px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5">
              ${state.playback.isPlaying ? ICONS.pause : ICONS.play}
              <span id="playbackPlayBtnText">${state.playback.isPlaying ? 'Pause' : 'Play Animation'}</span>
            </button>
            <button onclick="app.stepForward()" class="btn-action p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" title="Step Forward (t+1)">
              ${ICONS.stepForward}
            </button>
            <button onclick="app.resetPlayback()" class="btn-action text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1">
              Reset
            </button>
          </div>

          <!-- Playback Speed -->
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-400 font-medium">Speed:</span>
            ${[0.5, 1, 2].map((s) => `
              <button onclick="app.setPlaybackSpeed(${s})"
                class="btn-action px-2 py-1 rounded text-xs font-semibold ${
                  state.playback.speed === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }">
                ${s}x
              </button>
            `).join('')}
          </div>

          <!-- Current Clock State -->
          <div class="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs flex items-center gap-3">
            <div>Clock: <span id="playbackClockDisplay" class="font-bold text-indigo-600 dark:text-indigo-400">t = ${currentT} / ${totalMakespan}</span></div>
            <div>Active: <span id="playbackActiveDisplay" class="font-bold text-emerald-600 dark:text-emerald-400">${activeLabel}</span></div>
          </div>
        </div>
      </div>

      <!-- Detailed Process Metrics Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-6">
        <div class="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 class="font-bold text-slate-900 dark:text-white text-sm">Detailed Metrics by Process</h3>
          <span class="text-xs text-slate-500 font-mono">TAT = CT - AT | WT = TAT - BT</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th class="px-4 py-3">Process</th>
                <th class="px-4 py-3">Arrival (AT)</th>
                <th class="px-4 py-3">Burst (BT)</th>
                <th class="px-4 py-3">Priority</th>
                <th class="px-4 py-3">Completion (CT)</th>
                <th class="px-4 py-3">Turnaround (TAT)</th>
                <th class="px-4 py-3">Waiting (WT)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Calculation Breakdown -->
      <div class="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-xs text-slate-700 dark:text-slate-300 mb-8 space-y-2">
        <h4 class="font-bold text-slate-900 dark:text-white text-sm">Formula Calculation Breakdown</h4>
        <div class="font-mono text-xs space-y-1">
          <p>• Total Waiting Time = ${result.rows.map((r) => r.wt).join(' + ')} = ${result.rows.reduce((sum, r) => sum + r.wt, 0)}</p>
          <p>• Average Waiting Time = ${result.rows.reduce((sum, r) => sum + r.wt, 0)} / ${result.rows.length} = <strong class="text-amber-600 dark:text-amber-400">${fmt(result.avgWt)}</strong></p>
          <p>• Total Turnaround Time = ${result.rows.map((r) => r.tat).join(' + ')} = ${result.rows.reduce((sum, r) => sum + r.tat, 0)}</p>
          <p>• Average Turnaround Time = ${result.rows.reduce((sum, r) => sum + r.tat, 0)} / ${result.rows.length} = <strong class="text-emerald-600 dark:text-emerald-400">${fmt(result.avgTat)}</strong></p>
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('algorithm')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.goTo('compare-setup')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Step 4: Configure Comparison</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 5. Step 4: Configure Comparison Inputs
function compareSetupView() {
  const hasRR = state.comparisonAlgos.includes('rr');

  return `
    <div class="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 4 of 5</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Configure Comparison Inputs</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Each selected algorithm evaluates against your configured process workload. Adjust specific parameters below prior to running the comparative benchmark.
        </p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm mb-6 space-y-6">
        <div>
          <h3 class="font-bold text-slate-900 dark:text-white text-sm mb-3">Algorithms Included in Comparison (${state.comparisonAlgos.length})</h3>
          <div class="flex flex-wrap gap-2">
            ${state.comparisonAlgos.map((k) => `
              <span class="px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                ${escapeHtml(ALGORITHMS[k].name)}
              </span>
            `).join('')}
          </div>
        </div>

        ${hasRR ? `
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white text-sm">Round Robin Quantum (q)</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Specify the time slice for Round Robin during comparative evaluation.</p>
            </div>
            <input type="number" min="1" value="${state.comparisonQuantums.rr || 2}" onchange="app.setComparisonQuantum('rr', this.value)"
              class="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
          </div>
        ` : ''}

        <div class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          In the next step, all selected algorithms will run on identical arrival times, burst times, and priorities to identify the optimal scheduling strategy.
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('review')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.goTo('comparison')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Step 5: Compare Algorithms</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 6. Step 5: Compare Algorithms
function comparisonView() {
  const results = state.comparisonAlgos.map((algoKey) => {
    const q = algoKey === 'rr' ? (state.comparisonQuantums.rr || state.quantum) : state.quantum;
    const res = runScheduler(state.processes, algoKey, q);
    return {
      key: algoKey,
      algo: ALGORITHMS[algoKey],
      q,
      ...res,
    };
  });

  if (!results.length) {
    return `<div class="p-8 text-center"><p>No algorithms selected for comparison.</p><button onclick="app.goTo('algorithm')" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Select Algorithms</button></div>`;
  }

  // Find best metrics (lowest is best)
  const minWt = Math.min(...results.map((r) => r.avgWt));
  const minTat = Math.min(...results.map((r) => r.avgTat));
  const minIdle = Math.min(...results.map((r) => r.idle));

  const bestWtAlgo = results.find((r) => r.avgWt === minWt);
  const bestTatAlgo = results.find((r) => r.avgTat === minTat);
  const bestIdleAlgo = results.find((r) => r.idle === minIdle);

  // Maximum values for relative bar chart
  const maxBarWt = Math.max(...results.map((r) => r.avgWt), 1);
  const maxBarTat = Math.max(...results.map((r) => r.avgTat), 1);

  // Table rows
  const tableRows = results.map((r) => {
    const isBestWt = r.avgWt === minWt;
    const isBestTat = r.avgTat === minTat;
    const isBestIdle = r.idle === minIdle;

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors font-mono text-sm">
        <td class="px-4 py-3.5 font-bold font-sans">
          <div class="text-slate-900 dark:text-white font-semibold">${escapeHtml(r.algo.name)}</div>
          <div class="text-xs text-slate-400 font-mono">${r.algo.type}${r.key === 'rr' ? ` (q=${r.q})` : ''}</div>
        </td>
        <td class="px-4 py-3.5">
          <span class="font-bold ${isBestWt ? 'text-emerald-600 dark:text-emerald-400' : ''}">${fmt(r.avgWt)}</span>
          ${isBestWt ? '<span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">Best</span>' : ''}
        </td>
        <td class="px-4 py-3.5">
          <span class="font-bold ${isBestTat ? 'text-emerald-600 dark:text-emerald-400' : ''}">${fmt(r.avgTat)}</span>
          ${isBestTat ? '<span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">Best</span>' : ''}
        </td>
        <td class="px-4 py-3.5">
          <span class="font-bold ${isBestIdle ? 'text-emerald-600 dark:text-emerald-400' : ''}">${fmt(r.idle)}</span>
          ${isBestIdle ? '<span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">Best</span>' : ''}
        </td>
        <td class="px-4 py-3.5">${r.makespan}</td>
      </tr>
    `;
  }).join('');

  // Sort by performance (Avg WT ascending) to provide rank numbers
  const sortedByRank = [...results].sort((a, b) => a.avgWt - b.avgWt || a.avgTat - b.avgTat);

  // Modern Eye-Catching Bar Charts
  const modernBarChartsHtml = sortedByRank.map((r, rankIdx) => {
    const wtPct = Math.min(100, Math.max(12, (r.avgWt / maxBarWt) * 100));
    const tatPct = Math.min(100, Math.max(12, (r.avgTat / maxBarTat) * 100));
    const isTopWinner = rankIdx === 0;
    const diffWt = (r.avgWt - minWt).toFixed(2);
    const diffTat = (r.avgTat - minTat).toFixed(2);

    const rankBadgeClass = rankIdx === 0
      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
      : rankIdx === 1
      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-400/50'
      : rankIdx === 2
      ? 'bg-amber-900/10 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 ring-1 ring-amber-600/30'
      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500';

    return `
      <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border ${
        isTopWinner
          ? 'border-indigo-500 dark:border-indigo-500/80 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/20'
          : 'border-slate-200 dark:border-slate-800'
      } flex flex-col justify-between gap-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rankBadgeClass}">
              #${rankIdx + 1}
            </span>
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                ${escapeHtml(r.algo.name)}
              </h4>
              <span class="text-xs text-slate-400 font-mono">${r.algo.type}${r.key === 'rr' ? ` (q=${r.q})` : ''}</span>
            </div>
          </div>
          ${isTopWinner ? '<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm flex items-center gap-1">★ Best</span>' : ''}
        </div>

        <!-- Metric Bars -->
        <div class="space-y-3 pt-1">
          <!-- Waiting Time Bar -->
          <div>
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></span>
                <span>Avg Waiting Time</span>
              </span>
              <div class="font-mono text-xs flex items-center gap-2">
                <span class="font-extrabold text-amber-600 dark:text-amber-400">${fmt(r.avgWt)}</span>
                <span class="text-[10px] text-slate-400">(${diffWt === '0.00' ? 'Optimal' : `+${diffWt}`})</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
              <div class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm" style="width: ${wtPct}%;"></div>
            </div>
          </div>

          <!-- Turnaround Time Bar -->
          <div>
            <div class="flex justify-between items-center text-xs mb-1">
              <span class="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></span>
                <span>Avg Turnaround Time</span>
              </span>
              <div class="font-mono text-xs flex items-center gap-2">
                <span class="font-extrabold text-emerald-600 dark:text-emerald-400">${fmt(r.avgTat)}</span>
                <span class="text-[10px] text-slate-400">(${diffTat === '0.00' ? 'Optimal' : `+${diffTat}`})</span>
              </div>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
              <div class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm" style="width: ${tatPct}%;"></div>
            </div>
          </div>
        </div>

      </div>
    `;
  }).join('');

  // Side-by-side Gantt cards
  const ganttCards = results.map((r) => `
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h4 class="font-bold text-slate-900 dark:text-white text-sm">${escapeHtml(r.algo.name)}</h4>
          <span class="text-xs text-slate-400 font-mono">${r.algo.type}${r.key === 'rr' ? ` (q=${r.q})` : ''}</span>
        </div>
        <div class="flex gap-2 text-xs font-mono flex-wrap">
          <span class="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">Avg WT: ${fmt(r.avgWt)}</span>
          <span class="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">Avg TAT: ${fmt(r.avgTat)}</span>
        </div>
      </div>
      ${renderGantt(r.gantt, { compact: true })}
    </div>
  `).join('');

  return `
    <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Step 5 of 5</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Compare Algorithms</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive side-by-side performance review for your configured workload.</p>
      </div>

      <!-- Verdict Banner -->
      <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-800 mb-6">
        <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-1">
          ${ICONS.trophy}
          <span>Scheduling Verdict</span>
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong class="text-indigo-600 dark:text-indigo-400">${escapeHtml(bestWtAlgo.algo.name)}</strong> yielded the lowest average waiting time (<span class="font-mono font-bold">${fmt(minWt)}</span>),
          <strong class="text-indigo-600 dark:text-indigo-400">${escapeHtml(bestTatAlgo.algo.name)}</strong> achieved the lowest average turnaround time (<span class="font-mono font-bold">${fmt(minTat)}</span>),
          and <strong class="text-indigo-600 dark:text-indigo-400">${escapeHtml(bestIdleAlgo.algo.name)}</strong> minimized CPU idle time (<span class="font-mono font-bold">${fmt(minIdle)}</span>).
        </p>
      </div>

      <!-- Visual Metric Comparison Section -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-base">Comparative Performance Matrix & Charts</h3>
            <p class="text-xs text-slate-400 mt-0.5">Ranked from best overall to lowest performing on this workload.</p>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></span>
              Waiting Time
            </span>
            <span class="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span class="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></span>
              Turnaround Time
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${modernBarChartsHtml}
        </div>
      </div>

      <!-- Comparison Summary Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-6">
        <div class="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-slate-900 dark:text-white text-sm">Detailed Comparison Table</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th class="px-4 py-3">Algorithm</th>
                <th class="px-4 py-3">Avg WT</th>
                <th class="px-4 py-3">Avg TAT</th>
                <th class="px-4 py-3">Idle Time</th>
                <th class="px-4 py-3">Makespan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Individual Gantt Timelines -->
      <div class="space-y-4 mb-8">
        <h3 class="font-bold text-slate-900 dark:text-white text-sm">Gantt Charts Side-by-Side</h3>
        <div class="grid gap-4">
          ${ganttCards}
        </div>
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <button onclick="app.goTo('compare-setup')" class="btn-action w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5">
          ${ICONS.arrowLeft}
          <span>Back</span>
        </button>
        <button onclick="app.goTo('end')" class="btn-action w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5">
          <span>Finish Simulation</span>
          ${ICONS.arrowRight}
        </button>
      </div>
    </div>
  `;
}

// 7. Complete Screen (The End)
function endView() {
  return `
    <div class="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center">
      <div class="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6">
        ${ICONS.check}
      </div>
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Simulation Complete</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">All Algorithms Evaluated</h2>
      <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
        You have successfully explored process input configuration, algorithm scheduling, interactive Gantt playback, and side-by-side comparative analytics.
      </p>

      <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <button onclick="app.resetAll()" class="btn-action w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
          ${ICONS.refresh}
          <span>Run Again (Reset Benchmark)</span>
        </button>
        <button onclick="app.goTo('configure')" class="btn-action w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
          ${ICONS.edit}
          <span>Modify Current Processes</span>
        </button>
      </div>
    </div>
  `;
}

// Footer
function footerView() {
  return `
    <footer class="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50">
      <div class="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Built with Pure Vanilla JS + Tailwind CSS · Reference project based on Operating Systems (CSE362) Lab Report</p>
      </div>
    </footer>
  `;
}

// Main Render Function
function renderApp() {
  applyTheme();
  const root = document.getElementById('app');
  if (!root) return;

  let viewHtml = '';
  switch (state.view) {
    case 'intro':
      viewHtml = introView();
      break;
    case 'identity':
      viewHtml = identityView();
      break;
    case 'configure':
      viewHtml = configureView();
      break;
    case 'algorithm':
      viewHtml = algorithmView();
      break;
    case 'review':
      viewHtml = reviewView();
      break;
    case 'compare-setup':
      viewHtml = compareSetupView();
      break;
    case 'comparison':
      viewHtml = comparisonView();
      break;
    case 'end':
      viewHtml = endView();
      break;
    default:
      viewHtml = introView();
  }

  root.innerHTML = `
    ${headerView()}
    <main class="flex-1">
      ${viewHtml}
    </main>
    ${footerView()}
  `;
}

// Selective re-render of configure table to avoid whole-page flashes
function renderConfigureTableOnly() {
  const tbody = document.getElementById('processTableBody');
  if (tbody) {
    tbody.innerHTML = renderProcessRows();
  } else {
    renderApp();
  }
}

// Smooth playback display updater without recreating DOM trees
function updatePlaybackTick() {
  const res = runScheduler(state.processes, state.selectedAlgo, state.quantum);
  const currentT = state.playback.currentTime;
  const totalMakespan = res.makespan;
  const activeSeg = res.gantt.find((s) => currentT >= s.start && currentT < s.end);
  const activeLabel = activeSeg ? (activeSeg.id === 'IDLE' ? 'CPU IDLE' : activeSeg.id) : (currentT >= totalMakespan ? 'Execution Completed' : 'Waiting');

  const cursorEl = document.getElementById('timelineCursor');
  if (cursorEl) {
    cursorEl.style.left = `${(currentT / totalMakespan) * 100}%`;
  }
  const cursorLabel = document.getElementById('cursorLabel');
  if (cursorLabel) {
    cursorLabel.textContent = `t=${currentT}`;
  }
  const clockEl = document.getElementById('playbackClockDisplay');
  if (clockEl) {
    clockEl.textContent = `t = ${currentT} / ${totalMakespan}`;
  }
  const activeEl = document.getElementById('playbackActiveDisplay');
  if (activeEl) {
    activeEl.textContent = activeLabel;
  }
  const playBtn = document.getElementById('playbackPlayBtn');
  if (playBtn) {
    playBtn.innerHTML = `
      ${state.playback.isPlaying ? ICONS.pause : ICONS.play}
      <span id="playbackPlayBtnText">${state.playback.isPlaying ? 'Pause' : 'Play Animation'}</span>
    `;
  }

  // Highlight active gantt segment
  document.querySelectorAll('.gantt-bar').forEach((bar) => {
    const sStart = Number(bar.dataset.start);
    const sEnd = Number(bar.dataset.end);
    if (currentT >= sStart && currentT < sEnd) {
      bar.classList.add('ring-2', 'ring-amber-400', 'z-10');
    } else {
      bar.classList.remove('ring-2', 'ring-amber-400', 'z-10');
    }
  });
}

// Global Application Controller Object
window.app = {
  goTo(viewName) {
    app.stopPlaybackTimer();
    state.view = viewName;
    state.validationErrors = [];
    renderApp();
    window.scrollTo({ top: 0, behavior: 'auto' });
  },

  toggleDark() {
    state.darkMode = !state.darkMode;
    localStorage.setItem('cpuDarkMode', String(state.darkMode));
    document.documentElement.classList.add('theme-transition');
    applyTheme();

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerHTML = state.darkMode ? ICONS.moon : ICONS.sun;
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 280);
  },

  loadPreset(key) {
    if (!key || !PRESETS[key]) return;
    state.processes = JSON.parse(JSON.stringify(PRESETS[key].processes));
    state.validationErrors = [];
    renderConfigureTableOnly();
  },

  loadPresetAndReview(key) {
    if (key && PRESETS[key]) {
      state.processes = JSON.parse(JSON.stringify(PRESETS[key].processes));
      state.validationErrors = [];
    }
    app.goTo('review');
  },

  addProcess() {
    const nextIdx = state.processes.length + 1;
    let newId = `P${nextIdx}`;
    let counter = nextIdx;
    while (state.processes.some((p) => p.id === newId)) {
      counter++;
      newId = `P${counter}`;
    }
    state.processes.push({ id: newId, at: 0, bt: 4, priority: 2 });
    state.validationErrors = [];
    renderConfigureTableOnly();
  },

  removeProcess(idx) {
    if (state.processes.length <= 1) {
      state.validationErrors = ['At least one process is required in the schedule.'];
      const valContainer = document.getElementById('validationContainer');
      if (valContainer) {
        valContainer.innerHTML = `
          <div class="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-sm">
              ${ICONS.alert}
              <span>Please fix the following configuration errors:</span>
            </div>
            <ul class="list-disc list-inside">
              <li>At least one process is required in the schedule.</li>
            </ul>
          </div>
        `;
      }
      return;
    }

    state.processes.splice(idx, 1);
    state.validationErrors = [];
    renderConfigureTableOnly();
  },

  updateProcess(idx, field, value) {
    if (!state.processes[idx]) return;
    if (field === 'id') {
      state.processes[idx].id = String(value).trim();
    } else {
      state.processes[idx][field] = Number(value);
    }
    state.validationErrors = validateProcesses(state.processes);
    const valContainer = document.getElementById('validationContainer');
    if (valContainer) {
      if (state.validationErrors.length > 0) {
        valContainer.innerHTML = `
          <div class="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-1">
            <div class="font-bold flex items-center gap-1.5 text-sm">
              ${ICONS.alert}
              <span>Please fix the following configuration errors:</span>
            </div>
            <ul class="list-disc list-inside">
              ${state.validationErrors.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}
            </ul>
          </div>
        `;
      } else {
        valContainer.innerHTML = '';
      }
    }
  },

  validateAndContinue(targetView) {
    const errs = validateProcesses(state.processes);
    if (errs.length > 0) {
      state.validationErrors = errs;
      renderApp();
      return;
    }
    state.validationErrors = [];
    app.goTo(targetView);
  },

  // In-place algorithm selection without page re-render or shaking
  selectAlgo(key) {
    if (!ALGORITHMS[key]) return;
    state.selectedAlgo = key;

    // Update algorithm cards visually in-place
    Object.keys(ALGORITHMS).forEach((k) => {
      const card = document.getElementById(`algo-card-${k}`);
      if (card) {
        if (k === key) {
          card.className = 'card-interactive cursor-pointer p-4 sm:p-5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-2 ring-indigo-500/20';
        } else {
          card.className = 'card-interactive cursor-pointer p-4 sm:p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700';
        }
      }
    });

    // Toggle RR quantum input visibility in-place
    const isRR = state.selectedAlgo === 'rr' || state.comparisonAlgos.includes('rr');
    const rrContainer = document.getElementById('rrQuantumContainer');
    if (rrContainer) {
      if (isRR) {
        rrContainer.classList.remove('hidden');
        rrContainer.classList.add('block');
      } else {
        rrContainer.classList.add('hidden');
        rrContainer.classList.remove('block');
      }
    }
  },

  setQuantum(val) {
    state.quantum = Math.max(1, parseInt(val, 10) || 1);
  },

  setComparisonQuantum(algo, val) {
    state.comparisonQuantums[algo] = Math.max(1, parseInt(val, 10) || 1);
  },

  // In-place comparison algorithm toggle without page re-render or shaking
  toggleComparisonAlgo(key) {
    const idx = state.comparisonAlgos.indexOf(key);
    const checkbox = document.getElementById(`comp-check-${key}`);
    const label = document.getElementById(`comp-label-${key}`);

    if (idx >= 0) {
      if (state.comparisonAlgos.length <= 2) {
        alert('At least two algorithms must be selected for comparison.');
        if (checkbox) checkbox.checked = true;
        return;
      }
      state.comparisonAlgos.splice(idx, 1);
      if (label) {
        label.className = 'card-interactive flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60';
      }
    } else {
      state.comparisonAlgos.push(key);
      if (label) {
        label.className = 'card-interactive flex items-center gap-2.5 p-3 rounded-xl border border-indigo-500/60 bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60';
      }
    }

    // Toggle RR quantum container visibility if RR changed
    const isRR = state.selectedAlgo === 'rr' || state.comparisonAlgos.includes('rr');
    const rrContainer = document.getElementById('rrQuantumContainer');
    if (rrContainer) {
      if (isRR) {
        rrContainer.classList.remove('hidden');
        rrContainer.classList.add('block');
      } else {
        rrContainer.classList.add('hidden');
        rrContainer.classList.remove('block');
      }
    }
  },

  selectAllComparisonAlgos() {
    state.comparisonAlgos = Object.keys(ALGORITHMS);
    Object.keys(ALGORITHMS).forEach((k) => {
      const checkbox = document.getElementById(`comp-check-${k}`);
      if (checkbox) checkbox.checked = true;
      const label = document.getElementById(`comp-label-${k}`);
      if (label) {
        label.className = 'card-interactive flex items-center gap-2.5 p-3 rounded-xl border border-indigo-500/60 bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60';
      }
    });

    const isRR = state.selectedAlgo === 'rr' || state.comparisonAlgos.includes('rr');
    const rrContainer = document.getElementById('rrQuantumContainer');
    if (rrContainer && isRR) {
      rrContainer.classList.remove('hidden');
      rrContainer.classList.add('block');
    }
  },

  // Timeline Playback Methods
  togglePlay() {
    if (state.playback.isPlaying) {
      app.stopPlaybackTimer();
      updatePlaybackTick();
    } else {
      const res = runScheduler(state.processes, state.selectedAlgo, state.quantum);
      if (state.playback.currentTime >= res.makespan) {
        state.playback.currentTime = 0;
      }
      state.playback.isPlaying = true;
      updatePlaybackTick();

      const interval = 1000 / state.playback.speed;
      state.playback.timerId = setInterval(() => {
        const nextT = state.playback.currentTime + 1;
        if (nextT > res.makespan) {
          app.stopPlaybackTimer();
          updatePlaybackTick();
        } else {
          state.playback.currentTime = nextT;
          updatePlaybackTick();
        }
      }, interval);
    }
  },

  stepForward() {
    app.stopPlaybackTimer();
    const res = runScheduler(state.processes, state.selectedAlgo, state.quantum);
    if (state.playback.currentTime < res.makespan) {
      state.playback.currentTime += 1;
      updatePlaybackTick();
    }
  },

  stepBack() {
    app.stopPlaybackTimer();
    if (state.playback.currentTime > 0) {
      state.playback.currentTime -= 1;
      updatePlaybackTick();
    }
  },

  resetPlayback() {
    app.stopPlaybackTimer();
    state.playback.currentTime = 0;
    updatePlaybackTick();
  },

  setPlaybackSpeed(speed) {
    state.playback.speed = speed;
    if (state.playback.isPlaying) {
      app.stopPlaybackTimer();
      app.togglePlay();
    } else {
      renderApp();
    }
  },

  stopPlaybackTimer() {
    if (state.playback.timerId) {
      clearInterval(state.playback.timerId);
      state.playback.timerId = null;
    }
    state.playback.isPlaying = false;
  },

  resetAll() {
    app.stopPlaybackTimer();
    state.processes = JSON.parse(JSON.stringify(PRESETS.report.processes));
    state.selectedAlgo = 'fcfs';
    state.quantum = 2;
    state.comparisonAlgos = ['fcfs', 'sjf', 'rr', 'priority', 'srtf', 'ljf'];
    state.comparisonQuantums = { rr: 2 };
    state.validationErrors = [];
    state.playback.currentTime = 0;
    app.goTo('configure');
  },
};

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  renderApp();
}