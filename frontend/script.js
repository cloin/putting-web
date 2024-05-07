const socket = io();

// Regular expressions to match topics
const velocityTopicRegex = /^golfball\/golfball\d+\/Velocity$/;
const ballStateTopicRegex = /^golfball\/golfball\d+\/ballState$/;
const readyTopicRegex = /^golfball\/golfball\d+\/Ready$/;

// List of GIFs to randomly select from
const gifUrls = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW5rOXY2OTF2Y2ZmM3VmOTBkZzg2MnAwMjZseHlheDFkbnZqcWdqOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OzcY9C5Oi8qKAnhh2d/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2s2d2VtcjBhZng5cTZkcjI0eWx2aG5lYWNsNHVxbmQydXU5amRpZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ideq4B8bKsWiDeDzQb/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2s2d2VtcjBhZng5cTZkcjI0eWx2aG5lYWNsNHVxbmQydXU5amRpZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ideq4B8bKsWiDeDzQb/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZnbmRmaDZsY2tzaHdwYjRuZ3hyZXVoMzkwZTIzMG1kZ3I5M3UzayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEduKVQdG4c0JVPSo/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHNhN2k0YW05MmU2MmdyYXl4Z3ZwN2gyc2hyeDhtampxNDRnem5ybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cqPKypQge4oqk/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODN4cXNxbGNpbjEwcDhjY2RpbW5leWg5cXRmNWo1eWR5ZWd6bHRmaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/O2kFK6fdz217a/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODdrOGpqNjU5dWJ6Z2NvbjFwdmJlc3U0MDYwd2RscW9hOXJ2ZW91aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9VAJbrqvFmSib0mdWp/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXY3bG9tZnBvaXF0bTB5dXhyYmcxamRueDMwamw0azVvcWQ2NW0zcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IdiUQ5Ff47tV3Buebj/giphy.gif'
];

socket.on('mqtt_data', function(data) {
  console.log('Received data:', data); // Log all received MQTT data

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

    // Check for hole in one
    if (ballStateData.data === 'ST_MAGNET_STOP' && ballStateData.stroke === 1) {
      showGifPopup();
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

// Function to show hole in one GIF popup
function showGifPopup() {
  // Pick a random GIF from the list
  const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
  const gifImage = document.getElementById('gif-image');
  gifImage.src = randomGif;

  // Ensure the GIF is loaded before showing it
  gifImage.onload = () => {
    const gifPopup = document.getElementById('gif-popup');
    gifPopup.classList.add('show');
  };

  gifImage.onerror = () => {
    console.error(`Error loading GIF: ${randomGif}`);
    gifImage.src = ''; // Reset the image if there's an error
  };

  // Hide the popup after 8 seconds
  setTimeout(() => {
    const gifPopup = document.getElementById('gif-popup');
    gifPopup.classList.remove('show');
  }, 8000);
}


// Function to highlight tiles when data updates
function highlightTile(tileElement) {
  tileElement.classList.add('highlight');
  setTimeout(() => {
    tileElement.classList.remove('highlight');
  }, 1000); // Highlight duration
}

// Event listener for new player command
document.addEventListener('DOMContentLoaded', function() {
  const newPlayerButton = document.getElementById('new-player-btn');
  const newPlayerTooltip = document.getElementById('new-player-tooltip');
  const strokeCounterElement = document.getElementById('stroke-counter');
  strokeCounterElement.textContent = 0;

  newPlayerButton.addEventListener('click', function() {
    socket.emit('mqtt_command', { topic: 'golfball/golfball1/command', command: 'new_player' });
    newPlayerTooltip.classList.add('show');
    newPlayerButton.disabled = true;

    setTimeout(() => {
      newPlayerTooltip.classList.remove('show');
      newPlayerButton.disabled = false;
    }, 2000);
  });
});
