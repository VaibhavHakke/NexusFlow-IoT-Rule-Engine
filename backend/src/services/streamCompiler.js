const { Subject } = require('rxjs');
const { filter, map, bufferCount, scan } = require('rxjs/operators');
const Alert = require('../models/Alert');

const telemetry$ = new Subject();

let activeSubscriptions = [];
let broadcastFn = () => {};

function setBroadcastFn(fn) {
  broadcastFn = fn;
}

function pushTelemetry(reading) {
  telemetry$.next(reading);
}

function stopActiveGraph() {
  activeSubscriptions.forEach((sub) => sub.unsubscribe());
  activeSubscriptions = [];
}

function buildOperatorForNode(node) {
  const { type, data } = node;

  if (type === 'mathOp') {
    const op = data.operation || 'movingAverage';

    if (op === 'movingAverage') {
      const windowSize = Number(data.windowSize) || 5;
      return (source$) =>
        source$.pipe(
          bufferCount(windowSize, 1),
          map((buf) => buf.reduce((a, b) => a + b, 0) / buf.length)
        );
    }

    if (op === 'multiply') {
      const factor = Number(data.factor) || 1;
      return (source$) => source$.pipe(map((v) => v * factor));
    }

    if (op === 'add') {
      const amount = Number(data.amount) || 0;
      return (source$) => source$.pipe(map((v) => v + amount));
    }

    if (op === 'delta') {
      return (source$) =>
        source$.pipe(
          scan((acc, v) => ({ prev: acc.curr, curr: v }), { prev: null, curr: null }),
          filter((acc) => acc.prev !== null),
          map((acc) => acc.curr - acc.prev)
        );
    }
  }

  return (source$) => source$;
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

function compileAndRun(graph) {
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
          broadcastFn({
            type: 'edge_activity',
            edgeIds: edges
              .filter((e) => e.target === nextNode.id || e.source === sourceNode.id)
              .map((e) => e.id),
          });

          if (conditionMet(condition, thresholdNum, value)) {
            const alertDoc = {
              graphId: graph._id,
              nodeId: nextNode.id,
              deviceId,
              message: message || `${deviceId} tripped rule (${condition} ${thresholdNum})`,
              value,
              timestamp: new Date(),
            };

            Alert.create(alertDoc).catch(() => {});

            broadcastFn({
              type: 'alert',
              payload: { ...alertDoc, actionType: actionType || 'sms' },
            });
          } else {
            broadcastFn({
              type: 'value_update',
              payload: { deviceId, nodeId: nextNode.id, value },
            });
          }
        });

        activeSubscriptions.push(sub);
        currentId = nextId;
        continue;
      }

      break;
    }
  });

  console.log(`[StreamCompiler] Compiled graph "${graph.name || graph._id}" — ${sourceNodes.length} source pipeline(s) active.`);
}

module.exports = {
  telemetry$,
  pushTelemetry,
  compileAndRun,
  stopActiveGraph,
  setBroadcastFn,
};