require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');

const connectDB = require('./src/config/db');
const attachWebSocketServer = require('./src/websocket');
const { startMockGenerator } = require('./src/services/mockGenerator');

const graphRoutes = require('./src/routes/graphRoutes');
const telemetryRoutes = require('./src/routes/telemetryRoutes');
const alertRoutes = require('./src/routes/alertRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NexusFlow backend' });
});

app.use('/api/graphs', graphRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);

const server = http.createServer(app);
attachWebSocketServer(server);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 NexusFlow backend running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket live feed on ws://localhost:${PORT}/ws\n`);
  });

  const mockEnabled = (process.env.MOCK_DATA_ENABLED || 'true') === 'true';
  if (mockEnabled) {
    const interval = Number(process.env.MOCK_INTERVAL_MS) || 1000;
    startMockGenerator(interval);
  }
}

start();