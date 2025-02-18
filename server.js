const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

let clients = new Set();

server.on('connection', (ws) => {
    console.log('New device connected');
    clients.add(ws);

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        for (let client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on('close', () => {
        console.log('Device disconnected');
        clients.delete(ws);
    });
});

console.log("WebSocket server running on port 3000");
