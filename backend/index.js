const express = require('express');
const MQTT = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Environment variables with fallbacks
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost';
const port = process.env.PORT || 3000;
const subscriptionTopic = process.env.TOPIC || 'golfball/golfball1/#';

// Connect to the MQTT broker
const mqttClient = MQTT.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT Broker at ${mqttBrokerUrl}`);
  mqttClient.subscribe(subscriptionTopic);
});

// Handle incoming MQTT messages
mqttClient.on('message', (topic, message) => {
  const data = { topic, message: message.toString() };
  io.emit('mqtt_data', data);
});

// Handle incoming commands from the frontend
io.on('connection', (socket) => {
  console.log('Client connected via socket.io');

  socket.on('mqtt_command', (cmd) => {
    console.log(`Received command to publish to topic ${cmd.topic}`);
    // Construqt and send mqtt message
    const mqttMessage = JSON.stringify({ command: cmd.command });
    mqttClient.publish(cmd.topic, mqttMessage);
  });
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
