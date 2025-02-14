const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 10000 });

let clients = {}; // Store connected clients

wss.on("connection", (ws) => {
    let deviceName = null;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "register") {
                deviceName = data.name;
                clients[deviceName] = ws;
                broadcastConnectedDevices();
            } else if (data.type === "offer" || data.type === "answer" || data.type === "candidate") {
                if (clients[data.receiver]) {
                    clients[data.receiver].send(JSON.stringify(data));
                }
            }
        } catch (error) {
            console.error("Invalid JSON received:", error);
        }
    });

    ws.on("close", () => {
        if (deviceName) {
            delete clients[deviceName];
            broadcastConnectedDevices();
        }
    });
});

function broadcastConnectedDevices() {
    const deviceList = Object.keys(clients);
    for (let device in clients) {
        clients[device].send(JSON.stringify({ type: "deviceList", devices: deviceList }));
    }
}

console.log("WebSocket server running on port 10000");
