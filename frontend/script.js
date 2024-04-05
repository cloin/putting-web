const socket = io();

// Regular expressions to match topics like 'golfball/golfballN/Velocity' and 'golfball/golfballN/ballState'
const velocityTopicRegex = /^golfball\/golfball\d+\/Velocity$/;
const ballStateTopicRegex = /^golfball\/golfball\d+\/ballState$/;

socket.on('mqtt_data', function(data) {
  console.log('Received data:', data);  // Log all received MQTT data

  // Check if the topic matches the regular expression for velocity
  if (velocityTopicRegex.test(data.topic)) {
    console.log('Processing velocity data...');
    const velocityData = JSON.parse(data.message);
    console.log('Parsed velocity data:', velocityData);
    // Update the velocity in the UI
    const velocityElement = document.getElementById('velocity');
    velocityElement.textContent = `${velocityData.data} ft/s`;
  }
  // Check if the topic matches the regular expression for ballState
  else if (ballStateTopicRegex.test(data.topic)) {
    console.log('Processing ballState data...');
    const ballStateData = JSON.parse(data.message);
    console.log('Parsed ballState data:', ballStateData);

    // Update the ball state in the UI in real-time
    const ballStateElement = document.getElementById('ball-state');
    ballStateElement.textContent = `${ballStateData.data}`;

    // Update the stroke counter only when the ballState is 'ST_PUTT_COMPLETE'
    if (ballStateData.data === 'ST_PUTT_COMPLETE') {
      console.log('Ball State is ST_PUTT_COMPLETE. Updating stroke counter...');
      const strokeCounterElement = document.getElementById('stroke-counter');
      strokeCounterElement.textContent = `${ballStateData.stroke}`;
    }
  }
});
