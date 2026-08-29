import { Subject } from 'rxjs';
import { filter, map, bufferCount, scan } from 'rxjs/operators';
import { DEMO_DEVICES, randomReading } from '../data/demoDevices.js';

/**
 * This file is the BROWSER twin of backend/src/services/streamCompiler.js
 * and backend/src/services/mockGenerator.js. Same node types, same
 * operators, same shape of output — so when you flip DEMO_MODE to false,
 * nothing about your saved rule graphs or UI logic needs to change.
 */

export const telemetry$ = new Subject();

let generatorHandle = null;

export function startDemoGenerator(intervalMs = 1000) {
  if (generatorHandle) return;
  generatorHandle = setInterval(() => {
    DEMO_DEVICES.forEach((device) => {
      const value = randomReading(device);
      telemetry$.next({
        deviceId: device.deviceId,
        deviceType: device.deviceType,
        unit: device.unit,
        value,
        timestamp: new Date(),
      });
    });
  }, intervalMs);
}

export function stopDemoGenerator() {
  clearInterval(generatorHandle);
  generatorHandle = null;
}

// ---- Rule graph compiler (identical semantics to the backend version) ----

let activeSubscriptions = [];

function buildOperatorForNode(node) {
  const { type, data } = node;
  if (type !== 'mathOp') return (s$) => s$;

  const op = data.operation || 'movingAverage';

  if (op === 'movingAverage') {
    const windowSize = Number(data.windowSize) || 5;
    return (s$) =>
      s$.pipe(
        bufferCount(windowSize, 1),
        map((buf) => buf.reduce((a, b) => a + b, 0) / buf.length)
      );
  }
  if (op === 'multiply') {
    const factor = Number(data.factor) || 1;
    return (s$) => s$.pipe(map((v) => v * factor));
  }
  if (op === 'add') {
    const amount = Number(data.amount) || 0;
    return (s$) => s$.pipe(map((v) => v + amount));
  }
  if (op === 'delta') {
    return (s$) =>
      s$.pipe(
        scan((acc, v) => ({ prev: acc.curr, curr: v }), { prev: null, curr: null }),
        filter((acc) => acc.prev !== null),
        map((acc) => acc.curr - acc.prev)
      );
  }
  return (s$) => s$;
}

function conditionMet(condition, threshold, value) {
  switch (condition) {
    case 'gt': return value > threshold;
    case 'gte': return value >= threshold;
    case 'lt': return value < threshold;
    case 'lte': return value <= threshold;
    case 'eq': return value === threshold;
    default: return false;
  }
}

export function stopActiveGraph() {
  activeSubscriptions.forEach((sub) => sub.unsubscribe());
  activeSubscriptions = [];
}

/**
 * Compiles { nodes, edges } into live RxJS pipelines running in the browser.
 * callbacks: { onEdgeActivity(edgeIds), onAlert(alert), onValueUpdate({deviceId, nodeId, value}) }
 */
export function compileAndRun(graph, callbacks = {}) {
  stopActiveGraph();
  const { nodes = [], edges = [] } = graph;
  const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const outgoing = {};
  edges.forEach((e) => {
    if (!outgoing[e.source]) outgoing[e.source] = [];
    outgoing[e.source].push(e.target);
  });

  const sourceNodes = nodes.filter((n) => n.type === 'sensorSource');

  sourceNodes.forEach((sourceNode) => {
    const deviceId = sourceNode.data.deviceId;

    let stream$ = telemetry$.pipe(
      filter((r) => r.deviceId === deviceId),
      map((r) => r.value)
    );

    let currentId = sourceNode.id;
    const visited = new Set();

    while (outgoing[currentId] && outgoing[currentId].length > 0) {
      const nextId = outgoing[currentId][0];
      if (visited.has(nextId)) break;
      visited.add(nextId);

      const nextNode = nodeById[nextId];
      if (!nextNode) break;

      if (nextNode.type === 'mathOp') {
        stream$ = stream$.pipe(buildOperatorForNode(nextNode));
        currentId = nextId;
        continue;
      }

      if (nextNode.type === 'actionTrigger') {
        const { condition, threshold, message, actionType } = nextNode.data;
        const thresholdNum = Number(threshold);

        const sub = stream$.subscribe((value) => {
          callbacks.onEdgeActivity?.(
            edges.filter((e) => e.target === nextNode.id || e.source === sourceNode.id).map((e) => e.id)
          );

          if (conditionMet(condition, thresholdNum, value)) {
            callbacks.onAlert?.({
              deviceId,
              nodeId: nextNode.id,
              message: message || `${deviceId} tripped rule (${condition} ${thresholdNum})`,
              value,
              actionType: actionType || 'sms',
              timestamp: new Date(),
            });
          } else {
            callbacks.onValueUpdate?.({ deviceId, nodeId: nextNode.id, value });
          }
        });

        activeSubscriptions.push(sub);
        currentId = nextId;
        continue;
      }

      break;
    }
  });
}