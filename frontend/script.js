const socket = io();

socket.on('mqtt_data', function(data) {
  // Check if the topic is the one we're interested in
  if (data.topic === 'golfball/golfball1/Velocity') {
    // Parse the message to JSON
    const velocityData = JSON.parse(data.message);
    // Log the data to verify we're receiving it correctly
    console.log('Received velocity data:', velocityData);
    
    // Update the velocity in the UI
    const velocityElement = document.getElementById('velocity');
    velocityElement.textContent = `Velocity: ${velocityData.data} m/s, Stroke: ${velocityData.stroke}`;
  }
});
