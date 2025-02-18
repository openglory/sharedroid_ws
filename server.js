const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const server = new WebSocket.Server({ port: PORT });

let clients = new Set();

server.on("connection", (ws) => {
    clients.add(ws);
    console.log("New client connected. Total clients:", clients.size);

    ws.on("message", (message) => {
        console.log("Received:", message);

        // Broadcast to all clients
        for (let client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("Client disconnected. Total clients:", clients.size);
    });
});

console.log(`WebSocket server running on port ${PORT}`);
