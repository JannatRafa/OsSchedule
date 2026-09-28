# CPU Scheduling Visualizer - Design Specification

**Date**: 2026-09-29  
**Status**: Approved  
**Course Context**: CSE362 Operating Systems, Section 04  

---

## 1. Overview & Objective
This specification defines the complete architecture, data models, algorithm specifications, and user interface for an enhanced, browser-native CPU Scheduling Visualizer built with **pure vanilla JavaScript (ES modules)** and **Tailwind CSS**.

The visualizer faithfully replicates and improves upon the design documented in `final_v1.pdf` and implemented in `reference/`, eliminating all React/Vite build overhead, adding live playback/step-by-step animation, visual comparative charts, comprehensive workload presets, and robust error validation.

---

## 2. Core Scheduling Engine (`js/scheduler.js`)

### 2.1 Process Model
Each process is represented as an object:
```javascript
{
  id: string,        // e.g. "P1", trimmed, non-empty, unique
  at: number,        // Arrival Time: integer >= 0
  bt: number,        // Burst Time: integer >= 1
  priority: number   // Priority: integer >= 1 (lower number = higher priority)
}
```

### 2.2 Gantt Segment Model & Adjacent Merging
```javascript
{
  id: string,        // Process ID or "IDLE"
  start: number,     // Timeline start timestamp >= 0
  end: number        // Timeline end timestamp > start
}
```
**Segment Merging Rule (`addSegment`)**:
When adding a segment `(id, start, end)`:
If the preceding segment in `gantt` has the exact same `id` and its `end === start`, update the preceding segment's `end = end` rather than creating a fragmented adjacent segment.

### 2.3 Algorithms Specification
All algorithms accept an array of normalized process objects and return `{ gantt: Segment[] }`.

1. **First Come First Serve (FCFS)** - *Non-preemptive*:
   - Sort by arrival time `at` ascending; tie-break by `id.localeCompare()`.
   - CPU executes each process to completion. If timeline `time < process.at`, insert an `IDLE` segment from `time` to `process.at`.

2. **Shortest Job First (SJF)** - *Non-preemptive*:
   - At current `time`, select from arrived unfinished processes (`p.at <= time`) the one with minimum burst time `bt`.
   - Tie-breaking: earliest arrival time `at`, then alphabetical `id`.
   - If no process has arrived, advance `time` to the next arrival with an `IDLE` segment.

3. **Priority Scheduling** - *Non-preemptive*:
   - At current `time`, select arrived unfinished processes with minimum numeric `priority` (1 = highest priority).
   - Tie-breaking: earliest arrival time `at`, then alphabetical `id`.
   - If no process has arrived, advance with an `IDLE` segment.

4. **Longest Job First (LJF)** - *Non-preemptive*:
   - At current `time`, select arrived unfinished processes with maximum burst time `bt`.
   - Tie-breaking: earliest arrival time `at`, then alphabetical `id`.
   - If no process has arrived, advance with an `IDLE` segment.

5. **Round Robin (RR)** - *Preemptive*:
   - Maintains an explicit FIFO `queue` and a `remaining` burst time map.
   - At `time = 0`, all processes with `at <= time` sorted by `at`, then `id` are enqueued.
   - Dequeue front process `P`. Run for duration `d = min(remaining[P.id], quantum)`.
   - Advance `time += d`. Update `remaining[P.id] -= d`.
   - Enqueue newly arrived processes during `[time - d, time]`.
   - If `remaining[P.id] > 0`, re-enqueue `P`; else mark completed.
   - If queue is empty and processes remain, advance timeline to next arrival with an `IDLE` segment.

6. **Shortest Remaining Time First (SRTF)** - *Preemptive*:
   - Ticks 1 unit of time per step.
   - Selects from arrived unfinished processes the one with minimum remaining time.
   - Tie-breaking: earliest arrival time `at`, then alphabetical `id`.
   - Emits 1-unit segments which are automatically merged into contiguous blocks by `addSegment`.

### 2.4 Metrics Calculation (`computeMetrics`)
- **Completion Time ($CT$)**: The `end` time of the last Gantt segment for process $P$.
- **Turnaround Time ($TAT$)**: $TAT = CT - AT$.
- **Waiting Time ($WT$)**: $WT = TAT - BT$.
- **Average WT**: $\frac{\sum WT}{N}$.
- **Average TAT**: $\frac{\sum TAT}{N}$.
- **CPU Idle Time**: Sum of all `(seg.end - seg.start)` for segments where `seg.id === 'IDLE'`.
- **Makespan**: Maximum `end` time among all Gantt segments.

---

## 3. Application State & Flow (`js/app.js`)

### 3.1 State Schema
```javascript
const state = {
  view: 'intro', // 'intro' | 'identity' | 'configure' | 'algorithm' | 'review' | 'compare-setup' | 'comparison' | 'end'
  processes: [...],
  selectedAlgo: 'fcfs',
  quantum: 2,
  comparisonAlgos: ['fcfs', 'sjf', 'rr'],
  quantums: { rr: 2 },
  processOverrides: {}, // algorithm-specific process tweaks if modified
  darkMode: boolean,
  playback: {
    currentTime: 0,
    isPlaying: boolean,
    speed: 1, // 0.5x, 1x, 2x
    timerId: null
  }
}
```

### 3.2 Screens & Views
1. **Intro (`intro`)**: Hero header, feature overview cards, quick actions ("Start Scheduling", "Load Report Workload", "View Course Info").
2. **Course & Identity (`identity`)**: Academic details (CSE362, Sec 04, Tasir Rahman, Azizul Hakim Omor, Saiful Islam Riad) matching report.
3. **Step 1 - Configure Processes (`configure`)**:
   - Table editing PID, AT, BT, Priority.
   - Presets dropdown: Report Workload (Table 6.1: P1-P5), Simple 4-Process, CPU Idle Gap, Convoy Effect, Random Workload.
   - Live validation banner.
4. **Step 2 - Algorithm Selection (`algorithm`)**:
   - 6 algorithm cards with Preemptive/Non-preemptive badges.
   - Quantum input for Round Robin.
   - Comparison algorithm checklist (minimum 2 required).
5. **Step 3 - Review Schedule (`review`)**:
   - Metric summary cards (Avg WT, Avg TAT, CPU Idle Time, Total Makespan).
   - Interactive Gantt chart with hover tooltips and time scale.
   - Step-by-Step Playback Controller (Play, Pause, Step Next, Step Back, Reset, Speed toggle).
   - Per-process detailed metrics table (AT, BT, Priority, CT, TAT, WT).
6. **Step 4 - Comparison Setup (`compare-setup`)**:
   - Configuration table showing parameters for all algorithms selected for comparison (e.g. quantum for RR).
7. **Step 5 - Compare Algorithms (`comparison`)**:
   - Comparative analytics verdict banner: identifies best algorithm for WT, TAT, and Idle time.
   - Consolidated summary table with "Best" badge.
   - Responsive horizontal bar charts comparing Avg WT and Avg TAT.
   - Individual Gantt charts and metric cards for each algorithm.
8. **Complete Screen (`end`)**:
   - Congratulations / conclusion note and "Run Again" action.

---

## 4. Visual Design & User Experience
- Built using **Tailwind CSS** with responsive layout (`max-w-5xl mx-auto`).
- Supports **Light and Dark themes** with persistent preference in `localStorage`.
- Unified top navigation bar with step numbers and click-to-jump navigation.
- Smooth transitions and accessible color coding for processes.
