const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 10000 });

let clients = new Set();

wss.on('connection', (ws) => {
    console.log("New client connected");
    clients.add(ws);

    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log("Client disconnected");
    });
});

console.log("WebSocket server running on port 10000");
