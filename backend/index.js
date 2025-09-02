require('dotenv').config();

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 8081 });

const express = require('express');
const app = express();

const PORT = process.env.EXPRESS_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/time', (req, res) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    console.log(`${hours}:${minutes}:${seconds}`);
    res.send(`${hours}:${minutes}:${seconds}`);
});

app.get('/greet/:name', (req, res) => {
    ClientName = req.params.name;
    res.send('Hello ' + ClientName);
});

app.listen(PORT, () => {
    console.log('Server is running on http://dev.ferris.home64.de:' + PORT);
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send the current time every second
  const interval = setInterval(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    ws.send(timeString);
  }, 1000);

  // Clear interval if client disconnects
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server running on ws://localhost:8080');