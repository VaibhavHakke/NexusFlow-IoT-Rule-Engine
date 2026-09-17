const WebSocket = require('ws');
const { setBroadcastFn } = require('./services/streamCompiler');

function attachWebSocketServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer, path: '/ws' });

  wss.on('connection', (socket) => {
    console.log('[WS] Client connected. Total clients:', wss.clients.size);
    socket.send(JSON.stringify({ type: 'connected', payload: { message: 'NexusFlow live feed connected' } }));

    socket.on('close', () => {
      console.log('[WS] Client disconnected. Total clients:', wss.clients.size);
    });
  });

  function broadcast(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  setBroadcastFn(broadcast);

  return { wss, broadcast };
}

module.exports = attachWebSocketServer;