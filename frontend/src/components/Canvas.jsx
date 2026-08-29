import React, { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import SensorNode from './nodes/SensorNode.jsx';
import MathNode from './nodes/MathNode.jsx';
import ActionNode from './nodes/ActionNode.jsx';

let idCounter = 1;
const nextId = () => `node_${idCounter++}_${Date.now().toString(36)}`;

const defaultDataByType = (type, devices) => {
  if (type === 'sensorSource') {
    return { label: 'Turbine Sensor', deviceId: devices[0]?.deviceId || 'turbine-01', devices };
  }
  if (type === 'mathOp') {
    return { operation: 'movingAverage', windowSize: 5 };
  }
  if (type === 'actionTrigger') {
    return { label: 'SMS Alert', condition: 'gt', threshold: 80, message: 'Anomaly detected!' };
  }
  return {};
};

export default function Canvas({ devices, activeEdgeIds, onGraphChange, initialGraph }) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(
    () => ({ sensorSource: SensorNode, mathOp: MathNode, actionTrigger: ActionNode }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph?.edges || []);

  // Give each node's data an onChange callback bound to its own id
  const withHandlers = useCallback(
    (rawNodes) =>
      rawNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onChange: (patch) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === n.id ? { ...node, data: { ...node.data, ...patch } } : node
              )
            );
          },
        },
      })),
    [setNodes]
  );

  const displayNodes = useMemo(() => withHandlers(nodes), [nodes, withHandlers]);

  const displayEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        animated: activeEdgeIds?.has(e.id),
        className: activeEdgeIds?.has(e.id) ? 'nf-edge--glow' : '',
      })),
    [edges, activeEdgeIds]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, id: `edge_${Date.now()}` }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/nexusflow-node');
      if (!type || !reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: nextId(),
        type,
        position,
        data: defaultDataByType(type, devices),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, devices, setNodes]
  );

  // Bubble the serializable graph up whenever it changes
  const emitGraph = useCallback(() => {
    const serializable = {
      nodes: nodes.map(({ id, type, position, data }) => {
        const { onChange, devices: _d, ...rest } = data;
        return { id, type, position, data: rest };
      }),
      edges: edges.map(({ id, source, target }) => ({ id, source, target })),
    };
    onGraphChange(serializable);
  }, [nodes, edges, onGraphChange]);

  // Re-emit on any change (cheap enough at this scale)
  React.useEffect(() => {
    emitGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  return (
    <div className="nf-canvas blueprint-grid" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ style: { stroke: '#4fd1c5', strokeWidth: 1.6 } }}
      >
        <Background color="#232a34" gap={28} />
        <Controls className="nf-flow-controls" />
        <MiniMap
          pannable
          zoomable
          maskColor="rgba(11,14,18,0.85)"
          nodeColor={(n) =>
            n.type === 'sensorSource' ? '#4fd1c5' : n.type === 'actionTrigger' ? '#f0554f' : '#f0a94e'
          }
          style={{ background: '#12161c', border: '1px solid #232a34' }}
        />
      </ReactFlow>
    </div>
  );
}