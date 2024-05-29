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
const subscriptionTopic = process.env.TOPIC || 'ansible-golfs/golfball/#';

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
    const topic = 'ansible-golfs/command'; // Ensure this is exactly the same as used in mosquitto_pub
    const message = { command: 'reset' }; // Ensure this matches the structure expected
    console.log(`Publishing to topic ${topic} with message ${JSON.stringify(message)}`);
    mqttClient.publish(topic, JSON.stringify(message));
  });
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
