import React, { useCallback, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
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

const Canvas = forwardRef(function Canvas({ devices, activeEdgeIds, onGraphChange, initialGraph }, ref) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const nodeTypes = useMemo(
    () => ({ sensorSource: SensorNode, mathOp: MathNode, actionTrigger: ActionNode }),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph?.edges || []);

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

  const addNode = useCallback(
    (type, screenPos) => {
      let position = { x: 120 + Math.random() * 60, y: 120 + Math.random() * 200 };

      if (reactFlowInstance) {
        if (screenPos && reactFlowWrapper.current) {
          const bounds = reactFlowWrapper.current.getBoundingClientRect();
          position = reactFlowInstance.project({
            x: screenPos.x - bounds.left,
            y: screenPos.y - bounds.top,
          });
        } else {
          const bounds = reactFlowWrapper.current?.getBoundingClientRect();
          if (bounds) {
            position = reactFlowInstance.project({
              x: bounds.width / 2 + (nodes.length % 5) * 40,
              y: bounds.height / 3 + (nodes.length % 5) * 60,
            });
          }
        }
      }

      const newNode = {
        id: nextId(),
        type,
        position,
        data: defaultDataByType(type, devices),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, devices, setNodes, nodes.length]
  );

  useImperativeHandle(ref, () => ({ addNode }), [addNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/nexusflow-node');
      if (!type) return;
      addNode(type, { x: event.clientX, y: event.clientY });
    },
    [addNode]
  );

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

  React.useEffect(() => {
    emitGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  return (
    <div className="nf-canvas blueprint-grid" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      {nodes.length === 0 && (
        <div className="nf-canvas__empty mono">
          Canvas is empty — drag a node from the left panel, or click a node in the
          panel to drop it here automatically.
        </div>
      )}
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
});

export default Canvas;