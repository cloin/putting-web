const express = require('express');
const MQTT = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mqttClient = MQTT.connect('mqtt://localhost');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT Broker');
  mqttClient.subscribe('golfball/golfball1/#');
});

mqttClient.on('message', (topic, message) => {
  const data = { topic, message: message.toString() };
  io.emit('mqtt_data', data);
});

app.use(express.static('public')); // Serve your frontend files from here

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
