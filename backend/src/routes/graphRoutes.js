const express = require('express');
const router = express.Router();
const Graph = require('../models/Graph');
const { compileAndRun, stopActiveGraph } = require('../services/streamCompiler');

let memoryGraphs = [];
let memoryIdCounter = 1;

function mongoIsUp() {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
}

router.get('/', async (req, res) => {
  if (mongoIsUp()) {
    const graphs = await Graph.find().sort({ updatedAt: -1 });
    return res.json(graphs);
  }
  res.json(memoryGraphs);
});

router.post('/', async (req, res) => {
  const { name, nodes, edges } = req.body;
  if (!nodes || !edges) {
    return res.status(400).json({ error: 'nodes and edges are required' });
  }

  if (mongoIsUp()) {
    const graph = await Graph.create({ name: name || 'Untitled Rule Graph', nodes, edges });
    return res.status(201).json(graph);
  }

  const graph = { _id: `mem-${memoryIdCounter++}`, name, nodes, edges, isActive: false };
  memoryGraphs.unshift(graph);
  res.status(201).json(graph);
});

router.put('/:id', async (req, res) => {
  const { name, nodes, edges } = req.body;

  if (mongoIsUp()) {
    const graph = await Graph.findByIdAndUpdate(req.params.id, { name, nodes, edges }, { new: true });
    if (!graph) return res.status(404).json({ error: 'Graph not found' });
    return res.json(graph);
  }

  const idx = memoryGraphs.findIndex((g) => g._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Graph not found' });
  memoryGraphs[idx] = { ...memoryGraphs[idx], name, nodes, edges };
  res.json(memoryGraphs[idx]);
});

router.post('/:id/activate', async (req, res) => {
  let graph;

  if (mongoIsUp()) {
    graph = await Graph.findById(req.params.id);
    if (!graph) return res.status(404).json({ error: 'Graph not found' });
    await Graph.updateMany({}, { isActive: false });
    graph.isActive = true;
    await graph.save();
  } else {
    graph = memoryGraphs.find((g) => g._id === req.params.id);
    if (!graph) return res.status(404).json({ error: 'Graph not found' });
    memoryGraphs.forEach((g) => (g.isActive = false));
    graph.isActive = true;
  }

  compileAndRun(graph);
  res.json({ message: 'Graph compiled and running', graph });
});

router.post('/deactivate', async (req, res) => {
  stopActiveGraph();
  res.json({ message: 'Active rule graph stopped' });
});

module.exports = router;