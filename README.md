# putting-web

# Golf Ball Tracking Web Application

This repository contains the source code for a web application designed to track and display golf ball data, including velocity and ball state, in real-time using MQTT.

## Project Structure

The project is divided into two main parts:

- `frontend/`: Contains the user interface built with HTML, CSS, and JavaScript. It displays real-time data received via WebSockets.
- `backend/`: Houses the Node.js server that interfaces with the MQTT broker to receive golf ball data and serves the frontend files. It also relays data to the frontend via WebSockets.

## Getting Started

To get the project running on your local machine, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the `backend` directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Start the backend server:
   ```
   npm start
   ```

4. Open your browser and go to `http://localhost:3000` to view the application.

For more detailed instructions, refer to the `README.md` files in the `frontend/` and `backend/` directories.
