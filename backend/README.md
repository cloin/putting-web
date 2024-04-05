# Backend for Golf Ball Tracking Web Application

This directory contains the Node.js backend server for the golf ball tracking web application. It subscribes to MQTT topics to receive golf ball data and relays it to the frontend via WebSockets.

## Setup and Running

1. Ensure you have Node.js and npm installed.

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

The server will start and begin listening for MQTT messages on the topics specified in `index.js`. It will also serve the frontend files and establish WebSocket connections with clients.

## Environment Variables

The server uses the following environment variables, which can be set in a `.env` file or through your deployment environment:

- `MQTT_BROKER_URL`: The URL of the MQTT broker.
- `PORT`: The port on which the server will listen (defaults to 3000).

## Deployment

For deployment instructions, including how to set up the server with Docker or Kubernetes, see the deployment section.