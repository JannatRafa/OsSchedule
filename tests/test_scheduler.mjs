import assert from 'node:assert/strict';
import { runScheduler, validateProcesses } from '../js/scheduler.js';

const testWorkload = [
  { id: 'P1', at: 0, bt: 5, priority: 2 },
  { id: 'P2', at: 1, bt: 3, priority: 1 },
  { id: 'P3', at: 2, bt: 8, priority: 3 },
  { id: 'P4', at: 4, bt: 2, priority: 2 },
  { id: 'P5', at: 2, bt: 1, priority: 1 },
];

console.log('--- Testing CPU Scheduling Engine against final_v1.pdf benchmarks ---');

// 1. Validation test
const valErrors = validateProcesses(testWorkload);
assert.equal(valErrors.length, 0, 'Test workload should be valid');

// 2. FCFS
const fcfsRes = runScheduler(testWorkload, 'fcfs');
assert.equal(fcfsRes.avgWt.toFixed(2), '7.40', 'FCFS Avg WT mismatch');
assert.equal(fcfsRes.avgTat.toFixed(2), '11.20', 'FCFS Avg TAT mismatch');
assert.equal(fcfsRes.idle, 0, 'FCFS Idle mismatch');
console.log('✓ FCFS passed (WT: 7.40, TAT: 11.20, Idle: 0)');

// 3. SJF
const sjfRes = runScheduler(testWorkload, 'sjf');
assert.equal(sjfRes.avgWt.toFixed(2), '4.20', 'SJF Avg WT mismatch');
assert.equal(sjfRes.avgTat.toFixed(2), '8.00', 'SJF Avg TAT mismatch');
assert.equal(sjfRes.idle, 0, 'SJF Idle mismatch');
console.log('✓ SJF passed (WT: 4.20, TAT: 8.00, Idle: 0)');

// 4. Priority
const prioRes = runScheduler(testWorkload, 'priority');
assert.equal(prioRes.avgWt.toFixed(2), '4.80', 'Priority Avg WT mismatch');
assert.equal(prioRes.avgTat.toFixed(2), '8.60', 'Priority Avg TAT mismatch');
assert.equal(prioRes.idle, 0, 'Priority Idle mismatch');
console.log('✓ Priority passed (WT: 4.80, TAT: 8.60, Idle: 0)');

// 5. Round Robin (q=2)
const rrRes = runScheduler(testWorkload, 'rr', 2);
assert.equal(rrRes.avgWt.toFixed(2), '7.20', 'RR Avg WT mismatch');
assert.equal(rrRes.avgTat.toFixed(2), '11.00', 'RR Avg TAT mismatch');
assert.equal(rrRes.idle, 0, 'RR Idle mismatch');
console.log('✓ Round Robin (q=2) passed (WT: 7.20, TAT: 11.00, Idle: 0)');

// 6. SRTF
const srtfRes = runScheduler(testWorkload, 'srtf');
assert.equal(srtfRes.avgWt.toFixed(2), '3.40', 'SRTF Avg WT mismatch');
assert.equal(srtfRes.avgTat.toFixed(2), '7.20', 'SRTF Avg TAT mismatch');
assert.equal(srtfRes.idle, 0, 'SRTF Idle mismatch');
console.log('✓ SRTF passed (WT: 3.40, TAT: 7.20, Idle: 0)');

// 7. LJF
const ljfRes = runScheduler(testWorkload, 'ljf');
assert.equal(ljfRes.avgWt.toFixed(2), '8.60', 'LJF Avg WT mismatch');
assert.equal(ljfRes.avgTat.toFixed(2), '12.40', 'LJF Avg TAT mismatch');
assert.equal(ljfRes.idle, 0, 'LJF Idle mismatch');
console.log('✓ LJF passed (WT: 8.60, TAT: 12.40, Idle: 0)');

console.log('All 6 algorithms match final_v1.pdf benchmarks perfectly!');
