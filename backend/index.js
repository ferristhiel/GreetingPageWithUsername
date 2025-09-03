require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8081;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());

// --- Express Routen ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/time', (req, res) => {
    const now = new Date();
    res.send(now.toLocaleTimeString());
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

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log('WS Client connected: ' + ip);

    // Start counter for this connection
    let seconds = 0;

    const interval = setInterval(() => {
        seconds++;
        ws.send(seconds);
    }, 1000);

    ws.on('close', () => {
        console.log('WS Client disconnected: ' + ip);
        clearInterval(interval);
    });
});

console.log('WebSocket server running on ws://dev.ferris.home64.de:' + WS_PORT);