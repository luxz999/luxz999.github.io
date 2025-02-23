// Select DOM Elements
const entryScreen = document.getElementById('entry-screen');
const terminalContainer = document.getElementById('terminal-container');
const musicControls = document.getElementById('music-controls');
const outputDiv = document.getElementById('output');
const commandInput = document.getElementById('command-input');

// Select DOM Elements
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeSliderContainer = document.getElementById('volume-slider-container');
const volumeSlider = document.getElementById('volume-slider');
const volumePercentage = document.getElementById('volume-percentage');
const songTitle = document.getElementById('song-title');
const albumCover = document.getElementById('album-cover');
const backgroundMusic = document.getElementById('background-music');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

const terminal = document.getElementById('terminal');

// Music Playlist
const songs = [
  { name: 'Summer Salt - Speaking Sonar', file: 'assets/songs/Speaking Sonar.mp3', cover: 'assets/images/Speaking Sonar_thumbnail.jpg' },
  { name: 'Summer Salt - Swinging for the Fences', file: 'assets/songs/Swinging for the Fences.mp3', cover: 'assets/images/Swinging for the Fences_thumbnail.jpg' },
  { name: 'Summer Salt - Seventeen', file: 'assets/songs/Seventeen.mp3', cover: 'assets/images/Seventeen_thumbnail.jpg' },
  { name: 'Summer Salt - Rockin My Paw', file: 'assets/songs/Rockin My Paw.mp3', cover: 'assets/images/Rockin My Paw_thumbnail.jpg' },
  { name: "Summer Salt - Revvin' My Cj7", file: "assets/songs/Revvin' My Cj7.mp3", cover: "assets/images/Revvin' My Cj7_thumbnail.jpg" },
];
let currentSongIndex = 0;
// Initialize Music Player
function loadSong(index) {
  const song = songs[index];
  backgroundMusic.src = song.file; // Update the audio source
  backgroundMusic.load(); // Reload the audio element
  backgroundMusic.play(); // Play the new song
  playPauseBtn.textContent = '⏸️'; // Update play/pause button
  songTitle.textContent = song.name; // Update song title
  albumCover.src = song.cover; // Update album cover

  // Update Total Time
  backgroundMusic.addEventListener('loadedmetadata', () => {
    const totalMinutes = Math.floor(backgroundMusic.duration / 60);
    const totalSeconds = Math.floor(backgroundMusic.duration % 60);
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
  });
}

// Debugging: Check if the 'ended' event is triggered
backgroundMusic.addEventListener('ended', () => {
  console.log('Song ended'); // Debugging log
  currentSongIndex = (currentSongIndex + 1) % songs.length; // Move to the next song
  console.log('Next Song Index:', currentSongIndex); // Debugging log
  loadSong(currentSongIndex); // Load and play the next song
});


// Event Listeners for Music Controls
playPauseBtn.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    backgroundMusic.pause();
    playPauseBtn.textContent = '▶️';
  }
});

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
});

volumeIcon.addEventListener('click', () => {
  // Toggle visibility of volume slider
  if (volumeSliderContainer.style.display === 'flex') {
    volumeSliderContainer.style.display = 'none'; // Hide the slider
  } else {
    volumeSliderContainer.style.display = 'flex'; // Show the slider
  }
});

volumeSlider.addEventListener('input', () => {
  backgroundMusic.volume = volumeSlider.value;
  const percentage = Math.round(volumeSlider.value * 100);
  volumePercentage.textContent = `${percentage}%`;
  if (volumeSlider.value == 0) {
    volumeIcon.textContent = '🔇'; // Mute icon
  } else {
    volumeIcon.textContent = '🔊'; // Volume icon
  }
});

backgroundMusic.addEventListener('timeupdate', () => {
  const progressPercent = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
  progressBar.value = progressPercent;

  // Update Current Time
  const currentMinutes = Math.floor(backgroundMusic.currentTime / 60);
  const currentSeconds = Math.floor(backgroundMusic.currentTime % 60);
  currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
});

progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * backgroundMusic.duration;
  backgroundMusic.currentTime = seekTime;
})

// Load Themes from JSON
let themes = {};
fetch('themes.json')
  .then(response => response.json())
  .then(data => {
    themes = data;
  })
  .catch(error => console.error('Error loading themes:', error));

// Apply Theme Function
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) {
    outputDiv.innerHTML += `<p>Invalid theme. Available themes: ${Object.keys(themes).join(', ')}</p>`;
    return;
  }

  const root = document.documentElement;
  root.style.setProperty('--bg-color', theme.background);
  root.style.setProperty('--terminal-bg', theme.foreground);
  root.style.setProperty('--text-color', theme.text); // เพิ่ม text-color

  // Add Response
  outputDiv.innerHTML += `<p>Theme changed to ${themeName}!</p>`;
  outputDiv.scrollTop = outputDiv.scrollHeight; // Auto-scroll to bottom
}

// Terminal Logic
commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const command = commandInput.value.trim();
    outputDiv.innerHTML += `<p><span style="color: var(--text-color);">luxz@fakeshit:~$</span> ${command}</p>`;
    handleCommand(command);
    commandInput.value = '';
  }
});

function handleCommand(command) {
  const [cmd, arg] = command.split(' ');
  switch (cmd.toLowerCase()) {
    case 'help':
      outputDiv.innerHTML += `
        <p>Available commands:</p>
        <p>- about: About me</p>
        <p>- skills: My skills</p>
        <p>- contact: Contact info</p>
        <p>- theme [name]: Change terminal theme</p>
        <p>- clear: Clear the terminal screen</p>
        <p>- weather: Get current weather based on your location</p>
        <p>- date: Get current date based on your location</p>
        <p>- time: Get current time based on your location</p>
        <p>- info: Get system and location information</p>
        <p>- mywork: List all GitHub repositories of luxz999 (My Github)</p>
      `;
      break;
    case 'about':
      outputDiv.innerHTML += `
      <p>Name : Tae</p>
      <p>Age : 15</p>
      <p>Gender : Sigma</p>
      <p>Live in : Somewhere in Thailand</p>
      <p>And yep i hate coding</p>
      <p><strong>"It won't be like this forever"</strong></p>
      `;
      break;
    case 'skills':
      outputDiv.innerHTML += `
      <p><strong>Languages</strong></p>
      <p>Python : ███████░░░ 70%</p>
      <p>JavaScript : █████░░░░░ 50%</p>
      <p>Lua : █░░░░░░░░░ 10%</p>
      <p>Html : ██░░░░░░ 25%</p>
      <p>Css : ██░░░░░░ 25%</p>
      <p><strong>Frameworks</strong></p>
      <p>Fastapi : ████░░░░░░ 40%</p>
      <p>Flask : ████░░░░░░ 40%</p>
      <p>Express : ████░░░░░░ 40%</p>
      <p><strong>Tools</strong></p>
      <p>NodeJS : ███░░░░░░░ 30%</p>
      <p>MongoDB : ███░░░░░░░ 30%</p>
      <p>Selenium  : █████░░░░░ 50%</p>
      `;
      break;
    case 'contact':
      outputDiv.innerHTML += `
      <p>IG : <a href="https://www.instagram.com/it.twxrz" target="_blank" style="color: cyan;">it.twxrz</a><p>
      <p>Discord : <a href="https://discordapp.com/users/799669121771634748" target="_blank" style="color: cyan;">@loqrdluxz</a><p>
      <p>Telegram : <a href="http://t.me/loqrdluxz" target="_blank" style="color: cyan;">loqrdluxz</a><p>
      `;
      break;
    case 'theme':
      applyTheme(arg);
      break;
    case 'clear':
      outputDiv.innerHTML = '';
      break;
    case 'weather':
      getWeather(); // Fetch and display weather
      break;
    case 'date':
      const today = new Date().toLocaleDateString();
      outputDiv.innerHTML += `<p>Today's date is: ${today}</p>`;
      break;
    
    case 'time':
      const currentTime = new Date().toLocaleTimeString();
      outputDiv.innerHTML += `<p>Current time is: ${currentTime}</p>`;
      break;
    
    case 'info':
      getSystemInfo(); // Fetch and display system and location info
      break;

    case 'mywork':
      getGitHubRepositories(); // Fetch and display GitHub repositories
      break;
    default:
      outputDiv.innerHTML += `<p>Unknown command. Type 'help' for available commands.</p>`;
  }
  outputDiv.scrollTop = outputDiv.scrollHeight;
  terminal.scrollTop = terminal.scrollHeight;
}

async function getGitHubRepositories() {
  try {
    const username = 'luxz999'; // GitHub username
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    // Fetch repositories from GitHub API
    const response = await fetch(apiUrl);
    const repositories = await response.json();

    if (repositories.message) {
      // Handle errors (e.g., user not found or rate limit exceeded)
      outputDiv.innerHTML += `<p>Error: ${repositories.message}</p>`;
      return;
    }

    // Display repositories in the terminal
    if (repositories.length === 0) {
      outputDiv.innerHTML += `<p>No repositories found for user ${username}.</p>`;
    } else {
      outputDiv.innerHTML += `<p><strong>GitHub Repositories for ${username}:</strong></p>`;
      repositories.forEach(repo => {
        outputDiv.innerHTML += `
        <p>
          - <strong>${repo.name}</strong>: ${repo.description || 'No description'}
          <br>
          Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count} | Language: ${repo.language || 'Unknown'}
          <br>
          <a href="${repo.html_url}" target="_blank" style="color: cyan;">${repo.html_url}</a>
        </p>
      `;
      });
    }
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    outputDiv.innerHTML += `<p>Failed to fetch GitHub repositories. Please try again later.</p>`;
  }
}

// Function to Get System and Location Information
async function getSystemInfo() {
  try {
    // Step 1: Get IPv4 Address
    const ipv4Response = await fetch('https://api.ipify.org?format=json');
    const ipv4Data = await ipv4Response.json();
    const ipv4 = ipv4Data.ip || 'N/A';

    // Step 2: Get Location Data
    const ipResponse = await fetch(`https://ipapi.co/json/`);
    const ipData = await ipResponse.json();

    const ipv6 = ipData.ip || 'N/A';

    // Extract relevant information
    const country = ipData.country_name || 'Unknown Country';
    const city = ipData.city || 'Unknown City'
    const org = ipData.org || 'Unknown Organization';
    const timezone = ipData.timezone || 'Unknown Timezone';

    // Step 3: Get Operating System
    const os = getOperatingSystem();

    // Step 4: Display information in the terminal
    outputDiv.innerHTML += `
      <p><strong>IPv4:</strong> ${ipv4}</p>
      <p><strong>IPv6:</strong> ${ipv6}</p>
      <p><strong>Operating System:</strong> ${os}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Organization (ISP):</strong> ${org}</p>
      <p><strong>Timezone:</strong> ${timezone}</p>
    `;
  } catch (error) {
    console.error('Error fetching system info:', error);
    outputDiv.innerHTML += `<p>Failed to fetch system information. Please try again later.</p>`;
  }
}

const userAgent = navigator.userAgent
// Function to get the operating system name based on user agent
function getOperatingSystem() {

  if (userAgent.match(/Windows/)) {
    return getWindowsVersion();
  } else if (userAgent.match(/Macintosh/)) {
    return getMacOSVersion();
  } else if (userAgent.match(/Linux/)) {
    return "Linux";
  } else if (userAgent.match(/Android/)) {
    return getAndroidVersion();
  } else if (userAgent.match(/iPhone|iPad|iPod/)) {
    return getiOSVersion();
  } else {
    return "Unknown";
  }
}

// Function to map Windows version numbers to their corresponding releases
function getWindowsVersion() {
  var version = userAgent.match(/Windows NT ([\d.]+)/);
  if (version) {
    version = version[1];
    switch (version) {
      case "5.1":
        return "Windows XP";
      case "6.0":
        return "Windows Vista";
      case "6.1":
        return "Windows 7";
      case "6.2":
        return "Windows 8";
      case "6.3":
        return "Windows 8.1";
      case "10.0":
        return "Windows 10 or Windows 11"; // Windows 10 and 11 share the same version number
      default:
        return "Windows";
    }
  } else {
    return "Windows";
  }
}

// Function to get the macOS version
function getMacOSVersion() {
  var version = userAgent.match(/Mac OS X ([\d_]+)/);
  if (version) {
    version = version[1].replace(/_/g, '.');
    return "macOS " + version;
  } else {
    return "macOS";
  }
}

// Function to get the Android version
function getAndroidVersion() {
  var version = userAgent.match(/Android ([\d.]+)/);
  if (version) {
    return "Android " + version[1];
  } else {
    return "Android";
  }
}

// Function to get the iOS version
function getiOSVersion() {
  var version = userAgent.match(/OS ([\d_]+)/);
  if (version) {
    version = version[1].replace(/_/g, '.');
    return "iOS " + version;
  } else {
    return "iOS";
  }
}

// Function to Get Weather Based on User's Location
async function getWeather() {
  try {
    // Step 1: Get user's IP address and location
    const ipResponse = await fetch('https://ipapi.co/json/');
    const ipData = await ipResponse.json();
    const city = ipData.city || 'Unknown City';

    // Step 2: Fetch weather data from wttr.in
    const weatherResponse = await fetch(`https://wttr.in/${city}?ATm`);
    const weatherText = await weatherResponse.text();

    // Step 3: Display weather in the terminal
    outputDiv.innerHTML += `<pre>${weatherText}</pre>`;
  } catch (error) {
    console.error('Error fetching weather:', error);
    outputDiv.innerHTML += `<p>Failed to fetch weather data. Please try again later.</p>`;
  }
}

// Entry Screen Logic
document.addEventListener('click', () => {
  if (entryScreen.style.display !== 'none') {
    entryScreen.style.display = 'none'; // ซ่อนหน้าแรก
    terminalContainer.style.display = 'flex'; // แสดง Terminal
    musicControls.style.display = 'flex'; // แสดงตัวควบคุมเพลง
    loadSong(currentSongIndex); // เริ่มเล่นเพลง
  }
});
