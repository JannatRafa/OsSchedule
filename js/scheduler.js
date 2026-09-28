// CPU Scheduling Algorithms Engine
// Reference implementation based on the supplied project report (final_v1.pdf).

export function addSegment(gantt, id, start, end) {
  if (end <= start) return;
  const last = gantt[gantt.length - 1];
  if (last && last.id === id && last.end === start) {
    last.end = end;
    return;
  }
  gantt.push({ id, start, end });
}

export function validateProcesses(processes) {
  const errors = [];
  if (!processes || processes.length === 0) {
    errors.push('At least one process is required.');
    return errors;
  }
  const ids = new Set();
  processes.forEach((p, i) => {
    const pid = String(p.id || '').trim();
    if (!pid) {
      errors.push(`Process at row ${i + 1} is missing a Process ID.`);
    } else if (ids.has(pid)) {
      errors.push(`Duplicate Process ID: "${pid}".`);
    }
    ids.add(pid);
    if (Number(p.at) < 0 || isNaN(Number(p.at))) {
      errors.push(`"${pid || `Row ${i + 1}`}": Arrival Time must be 0 or greater.`);
    }
    if (Number(p.bt) < 1 || isNaN(Number(p.bt))) {
      errors.push(`"${pid || `Row ${i + 1}`}": Burst Time must be 1 or greater.`);
    }
    if (Number(p.priority) < 1 || isNaN(Number(p.priority))) {
      errors.push(`"${pid || `Row ${i + 1}`}": Priority must be 1 or greater.`);
    }
  });
  return errors;
}

// FCFS - Non-preemptive; earliest arrived process runs to completion.
export function fcfs(input) {
  const processes = [...input].sort(
    (a, b) => a.at - b.at || a.id.localeCompare(b.id),
  );
  const gantt = [];
  let time = 0;
  processes.forEach((process) => {
    if (time < process.at) {
      addSegment(gantt, 'IDLE', time, process.at);
      time = process.at;
    }
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
  });
  return { gantt };
}

// SJF - Non-preemptive; shortest burst among arrived processes.
export function sjf(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;
  while (completed.size < processes.length) {
    const available = processes
      .filter((p) => !completed.has(p.id) && p.at <= time)
      .sort((a, b) => a.bt - b.bt || a.at - b.at || a.id.localeCompare(b.id));
    if (!available.length) {
      const next = processes
        .filter((p) => !completed.has(p.id))
        .sort((a, b) => a.at - b.at)[0];
      addSegment(gantt, 'IDLE', time, next.at);
      time = next.at;
      continue;
    }
    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }
  return { gantt };
}

// Priority - Non-preemptive; lowest numeric priority value is highest priority.
export function priorityScheduling(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;
  while (completed.size < processes.length) {
    const available = processes
      .filter((p) => !completed.has(p.id) && p.at <= time)
      .sort(
        (a, b) =>
          a.priority - b.priority || a.at - b.at || a.id.localeCompare(b.id),
      );
    if (!available.length) {
      const next = processes
        .filter((p) => !completed.has(p.id))
        .sort((a, b) => a.at - b.at)[0];
      addSegment(gantt, 'IDLE', time, next.at);
      time = next.at;
      continue;
    }
    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }
  return { gantt };
}

// LJF - Non-preemptive; largest burst among arrived processes.
export function ljf(input) {
  const processes = [...input];
  const completed = new Set();
  const gantt = [];
  let time = 0;
  while (completed.size < processes.length) {
    const available = processes
      .filter((p) => !completed.has(p.id) && p.at <= time)
      .sort((a, b) => b.bt - a.bt || a.at - b.at || a.id.localeCompare(b.id));
    if (!available.length) {
      const next = processes
        .filter((p) => !completed.has(p.id))
        .sort((a, b) => a.at - b.at)[0];
      addSegment(gantt, 'IDLE', time, next.at);
      time = next.at;
      continue;
    }
    const process = available[0];
    addSegment(gantt, process.id, time, time + process.bt);
    time += process.bt;
    completed.add(process.id);
  }
  return { gantt };
}

// Round Robin - Preemptive; FIFO ready queue, runs up to one quantum.
export function roundRobin(input, quantum = 2) {
  const q = Math.max(1, Number(quantum) || 2);
  const processes = [...input].sort(
    (a, b) => a.at - b.at || a.id.localeCompare(b.id),
  );
  const remaining = new Map(
    processes.map((p) => [p.id, p.bt]),
  );
  const gantt = [];
  const queue = [];
  let time = 0;
  let index = 0;
  let completed = 0;
  while (completed < processes.length) {
    while (index < processes.length && processes[index].at <= time) {
      queue.push(processes[index]);
      index += 1;
    }
    if (!queue.length && index < processes.length) {
      addSegment(gantt, 'IDLE', time, processes[index].at);
      time = processes[index].at;
      continue;
    }
    const process = queue.shift();
    const left = remaining.get(process.id);
    const execution = Math.min(left, q);
    addSegment(gantt, process.id, time, time + execution);
    time += execution;
    remaining.set(process.id, left - execution);
    while (index < processes.length && processes[index].at <= time) {
      queue.push(processes[index]);
      index += 1;
    }
    if (remaining.get(process.id) > 0) {
      queue.push(process);
    } else {
      completed += 1;
    }
  }
  return { gantt };
}

// SRTF - Preemptive; re-evaluates each time unit, picks shortest remaining.
export function srtf(input) {
  const processes = [...input];
  const remaining = new Map(
    processes.map((p) => [p.id, p.bt]),
  );
  const gantt = [];
  let time = 0;
  let completed = 0;
  while (completed < processes.length) {
    const available = processes
      .filter((p) => p.at <= time && remaining.get(p.id) > 0)
      .sort(
        (a, b) =>
          remaining.get(a.id) - remaining.get(b.id) ||
          a.at - b.at ||
          a.id.localeCompare(b.id),
      );
    if (!available.length) {
      const future = processes
        .filter((p) => remaining.get(p.id) > 0)
        .sort((a, b) => a.at - b.at)[0];
      addSegment(gantt, 'IDLE', time, future.at);
      time = future.at;
      continue;
    }
    const process = available[0];
    addSegment(gantt, process.id, time, time + 1);
    remaining.set(process.id, remaining.get(process.id) - 1);
    time += 1;
    if (remaining.get(process.id) === 0) {
      completed += 1;
    }
  }
  return { gantt };
}

// Compute CT, TAT, WT, averages, and idle time from a gantt chart.
export function computeMetrics(processes, gantt) {
  const ct = new Map();
  gantt.forEach((seg) => {
    if (seg.id !== 'IDLE') {
      ct.set(seg.id, seg.end);
    }
  });
  let totalTat = 0;
  let totalWt = 0;
  const rows = processes.map((p) => {
    const completion = ct.get(p.id) || 0;
    const tat = Math.max(0, completion - p.at);
    const wt = Math.max(0, tat - p.bt);
    totalTat += tat;
    totalWt += wt;
    return { ...p, ct: completion, tat, wt };
  });
  const n = processes.length;
  const idle = gantt
    .filter((seg) => seg.id === 'IDLE')
    .reduce((sum, seg) => sum + (seg.end - seg.start), 0);
  return {
    rows,
    avgWt: n > 0 ? totalWt / n : 0,
    avgTat: n > 0 ? totalTat / n : 0,
    idle,
    makespan: gantt.length ? gantt[gantt.length - 1].end : 0,
  };
}

export function runScheduler(processes, algorithm, quantum = 2) {
  const normalized = processes.map((p, i) => ({
    id: String(p.id || `P${i + 1}`).trim(),
    at: Math.max(0, Number(p.at) || 0),
    bt: Math.max(1, Number(p.bt) || 1),
    priority: Math.max(1, Number(p.priority) || 1),
  }));

  const algoKey = String(algorithm).toLowerCase();
  let result;
  switch (algoKey) {
    case 'fcfs':
      result = fcfs(normalized);
      break;
    case 'sjf':
      result = sjf(normalized);
      break;
    case 'priority':
      result = priorityScheduling(normalized);
      break;
    case 'ljf':
      result = ljf(normalized);
      break;
    case 'rr':
      result = roundRobin(normalized, quantum);
      break;
    case 'srtf':
      result = srtf(normalized);
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
  const metrics = computeMetrics(normalized, result.gantt);
  return { gantt: result.gantt, ...metrics };
}