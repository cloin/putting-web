const socket = io();

// Regular expressions to match topics
const velocityTopicRegex = /^golfball\/golfball\d+\/Velocity$/;
const ballStateTopicRegex = /^golfball\/golfball\d+\/ballState$/;
const readyTopicRegex = /^golfball\/golfball\d+\/Ready$/;  // Regex for "Ready" topic

socket.on('mqtt_data', function(data) {
  console.log('Received data:', data);  // Log all received MQTT data

  // Velocity updates
  if (velocityTopicRegex.test(data.topic)) {
    console.log('Processing velocity data...');
    const velocityData = JSON.parse(data.message);
    console.log('Parsed velocity data:', velocityData);
    const velocityElement = document.getElementById('velocity');
    velocityElement.textContent = `${velocityData.data} ft/s`;
    highlightTile(velocityElement.parentElement);
  }

  // Ball state updates
  else if (ballStateTopicRegex.test(data.topic)) {
    console.log('Processing ballState data...');
    const ballStateData = JSON.parse(data.message);
    console.log('Parsed ballState data:', ballStateData);
    const ballStateElement = document.getElementById('ball-state');
    ballStateElement.textContent = `${ballStateData.data}`;
    highlightTile(ballStateElement.parentElement);

    // Update stroke counter if the ballState is 'ST_PUTT_COMPLETE'
    if (ballStateData.data === 'ST_PUTT_COMPLETE') {
      console.log('Ball State is ST_PUTT_COMPLETE. Updating stroke counter...');
      const strokeCounterElement = document.getElementById('stroke-counter');
      strokeCounterElement.textContent = `${ballStateData.stroke}`;
      highlightTile(strokeCounterElement.parentElement);
    }
  }

  // "Ready" status updates
  else if (readyTopicRegex.test(data.topic)) {
    console.log('Processing Ready data...');
    const readyData = JSON.parse(data.message);
    console.log('Parsed Ready data:', readyData);
    const readyBanner = document.getElementById('ready-banner');

    // Update banner based on "Ready" status
    if (readyData.data === 1) {
      readyBanner.textContent = 'Golfball Ready!';
      readyBanner.className = 'ready-banner green';
    } else {
      readyBanner.textContent = 'Golfball Not Ready';
      readyBanner.className = 'ready-banner red';
    }
  }
});

// Function to highlight tiles when data updates
function highlightTile(tileElement) {
  tileElement.classList.add('highlight');
  setTimeout(() => {
    tileElement.classList.remove('highlight');
  }, 1000);  // Highlight duration
}
