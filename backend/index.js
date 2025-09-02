require('dotenv').config();

const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8081;

// --- Express Routen ---
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<body>
<h1>Current Time:</h1>
<div id="time"></div>

<script>
const ws = new WebSocket('ws://dev.ferris.home64.de:8081');

ws.onmessage = (event) => {
    document.getElementById('time').innerText = event.data;
};
</script>
</body>
</html>`);
});

app.get('/time', (req, res) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    console.log(timeString);
    res.send(timeString);
});

app.get('/greet/:name', (req, res) => {
    const clientName = req.params.name;
    res.send('Hello ' + clientName);
});

// Start Express Server
app.listen(PORT, () => {
    console.log('Express server running on http://dev.ferris.home64.de:' + PORT);
});

// --- WebSocket Server ---
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    const interval = setInterval(() => {
        const now = new Date();
        ws.send(now.toLocaleTimeString());
    }, 1000);

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        clearInterval(interval);
    });
});

console.log('WebSocket server running on ws://dev.ferris.home64.de:' + WS_PORT);