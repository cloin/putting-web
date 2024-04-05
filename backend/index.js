const express = require('express');
const MQTT = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use an environment variable, with a fallback to a default value if it's not set
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost';
const port = process.env.PORT || 3000;
const topic = process.env.TOPIC || 'golfball/golfball1/#';

const mqttClient = MQTT.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT Broker at ${mqttBrokerUrl}`);
  mqttClient.subscribe(`${topic}`);
});

mqttClient.on('message', (topic, message) => {
  const data = { topic, message: message.toString() };
  io.emit('mqtt_data', data);
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
