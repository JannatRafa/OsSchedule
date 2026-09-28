import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runScheduler, validateProcesses, addSegment } from '../js/scheduler.js';

console.log('=== Running Full Verification Suite ===');

// 1. Check index.html points to relative ./js/app.js
const htmlContent = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
assert.ok(htmlContent.includes('./js/app.js'), 'index.html must load ./js/app.js');
assert.ok(!htmlContent.includes('src="/app.js"'), 'index.html should not have root-relative /app.js');
console.log('✓ index.html script tag verified');

// 2. Validate Benchmark Table 6.1
const benchmark = [
  { id: 'P1', at: 0, bt: 5, priority: 2 },
  { id: 'P2', at: 1, bt: 3, priority: 1 },
  { id: 'P3', at: 2, bt: 8, priority: 3 },
  { id: 'P4', at: 4, bt: 2, priority: 2 },
  { id: 'P5', at: 2, bt: 1, priority: 1 },
];

const expectations = {
  fcfs: { avgWt: '7.40', avgTat: '11.20', idle: 0, makespan: 19 },
  sjf: { avgWt: '4.20', avgTat: '8.00', idle: 0, makespan: 19 },
  priority: { avgWt: '4.80', avgTat: '8.60', idle: 0, makespan: 19 },
  rr: { avgWt: '7.20', avgTat: '11.00', idle: 0, makespan: 19, q: 2 },
  srtf: { avgWt: '3.40', avgTat: '7.20', idle: 0, makespan: 19 },
  ljf: { avgWt: '8.60', avgTat: '12.40', idle: 0, makespan: 19 },
};

for (const [algo, exp] of Object.entries(expectations)) {
  const res = runScheduler(benchmark, algo, exp.q || 2);
  assert.equal(res.avgWt.toFixed(2), exp.avgWt, `${algo} avgWt expected ${exp.avgWt}, got ${res.avgWt.toFixed(2)}`);
  assert.equal(res.avgTat.toFixed(2), exp.avgTat, `${algo} avgTat expected ${exp.avgTat}, got ${res.avgTat.toFixed(2)}`);
  assert.equal(res.idle, exp.idle, `${algo} idle expected ${exp.idle}, got ${res.idle}`);
  assert.equal(res.makespan, exp.makespan, `${algo} makespan expected ${exp.makespan}, got ${res.makespan}`);
  console.log(`✓ Benchmark passed for ${algo.toUpperCase()}`);
}

// 3. Segment merging check
const ganttTest = [];
addSegment(ganttTest, 'P1', 0, 1);
addSegment(ganttTest, 'P1', 1, 2);
assert.equal(ganttTest.length, 1, 'Contiguous segments for same process should merge');
assert.equal(ganttTest[0].start, 0);
assert.equal(ganttTest[0].end, 2);
console.log('✓ Segment merging in addSegment verified');

// 4. Test IDLE insertion
const idleWorkload = [
  { id: 'P1', at: 2, bt: 3, priority: 1 },
  { id: 'P2', at: 8, bt: 2, priority: 2 },
];
const idleRes = runScheduler(idleWorkload, 'fcfs');
assert.equal(idleRes.idle, 5, 'Should accumulate 2 + 3 = 5 idle units');
assert.equal(idleRes.gantt[0].id, 'IDLE');
assert.equal(idleRes.gantt[0].end, 2);
console.log('✓ IDLE gap accumulation verified');

// 5. Validation logic check
assert.ok(validateProcesses([]).length > 0, 'Empty list should fail validation');
assert.ok(validateProcesses([{ id: 'P1', at: -1, bt: 2, priority: 1 }]).length > 0, 'Negative AT should fail');
assert.ok(validateProcesses([{ id: 'P1', at: 0, bt: 0, priority: 1 }]).length > 0, 'Zero BT should fail');
assert.ok(validateProcesses([{ id: 'P1', at: 0, bt: 2, priority: 0 }]).length > 0, 'Zero priority should fail');
assert.ok(validateProcesses([{ id: 'P1', at: 0, bt: 2, priority: 1 }, { id: 'P1', at: 1, bt: 3, priority: 1 }]).length > 0, 'Duplicate PID should fail');
console.log('✓ Validation rules verified');

console.log('\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY ===');
