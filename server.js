const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const server = new WebSocket.Server({ port: PORT });

let clients = new Map();

server.on("connection", (ws) => {
    ws.on("message", (message) => {
        let data = JSON.parse(message);

        if (data.type === "setName") {
            if ([...clients.values()].includes(data.name)) {
                ws.send(JSON.stringify({ type: "nameError" }));
            } else {
                clients.set(ws, data.name);
                updateClients();
                ws.send(JSON.stringify({ type: "nameConfirmed", name: data.name }));
            }
        } else if (data.type === "message") {
            for (let [client, name] of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "message", name: data.name, message: data.message }));
                }
            }
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
        updateClients();
    });
});

function updateClients() {
    const deviceNames = [...clients.values()];
    for (let client of clients.keys()) {
        client.send(JSON.stringify({ type: "updateDevices", devices: deviceNames }));
    }
}

console.log(`WebSocket server running on port ${PORT}`);
