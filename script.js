// Get DOM elements
const vinyl = document.getElementById('vinyl');
const toneArm = document.getElementById('toneArm');
const stickers = document.querySelectorAll('.sticker');
const stopBtn = document.getElementById('stopBtn');
const nowPlaying = document.getElementById('nowPlaying');
const trackInfo = document.querySelector('.track-info');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const lyricsDisplay = document.getElementById('lyricsDisplay');

// State
let currentAudio = null;
let currentSticker = null;
let progressInterval = null;

// Track names
const trackNames = {
    1: '🎸 Rock Vibes',
    2: '🎹 Jazz Mood',
    3: '🎺 Blues Soul',
    4: '🎵 Pop Hits',
    5: '🎼 Classical Beauty'
};

// Lyrics for each song
const lyrics = {
    1: [
        "Feel the rhythm",
        "Feel the vibe",
        "Electric hearts",
        "Neon lights",
        "Rock all night"
    ],
    2: [
        "Smooth jazz",
        "Under moonlight",
        "Piano keys dance",
        "Pure delight",
        "Swing to the beat"
    ],
    3: [
        "Blues in my soul",
        "Music makes whole",
        "Trumpet cries out",
        "Feel the groove",
        "Let it move you"
    ],
    4: [
        "Feel the beat",
        "City street dance",
        "Catchy melodies",
        "Sweetest sound",
        "Pop all night"
    ],
    5: [
        "Classical beauty",
        "Orchestra plays",
        "Timeless music",
        "Ancient song",
        "Pure perfection"
    ]
};

// Initialize
function init() {
    // Add click listeners to stickers
    stickers.forEach(sticker => {
        sticker.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = sticker.dataset.song;
            playMusic(songId, sticker);
        });
    });

    // Stop button
    stopBtn.addEventListener('click', stopMusic);

    // Vinyl click to stop
    vinyl.addEventListener('click', (e) => {
        if (e.target === vinyl || e.target.classList.contains('grooves')) {
            stopMusic();
        }
    });
}

// Play music
function playMusic(songId, stickerEl) {
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Remove active class from previous sticker
    if (currentSticker) {
        currentSticker.classList.remove('active');
    }

    // Get new audio element
    const audio = document.getElementById(`audio${songId}`);
    
    if (!audio) {
        console.error('Audio element not found');
        return;
    }

    // Set current audio and sticker
    currentAudio = audio;
    currentSticker = stickerEl;

    // Add active class
    stickerEl.classList.add('active');

    // Start playing
    audio.currentTime = 0;
    audio.play().catch(err => {
        console.error('Error playing audio:', err);
        trackInfo.textContent = 'Error loading audio. Click to try again.';
    });

    // Update UI
    vinyl.classList.add('spinning');
    toneArm.classList.add('playing');
    trackInfo.textContent = `Now Playing: ${trackNames[songId]}`;
    durationEl.textContent = '0:30';
    
    // Display lyrics
    displayLyrics(songId);

    // Stop after 30 seconds
    setTimeout(() => {
        if (currentAudio === audio) {
            stopMusic();
        }
    }, 30000);

    // Update progress
    startProgressTracking();

    // Handle audio end
    audio.onended = () => {
        if (currentAudio === audio) {
            stopMusic();
        }
    };
}

// Stop music
function stopMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    if (currentSticker) {
        currentSticker.classList.remove('active');
        currentSticker = null;
    }

    vinyl.classList.remove('spinning');
    toneArm.classList.remove('playing');
    trackInfo.textContent = 'Click a sticker to play music';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    // Hide lyrics
    hideLyrics();
    
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Progress tracking
function startProgressTracking() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    progressInterval = setInterval(() => {
        if (currentAudio) {
            const progress = (currentAudio.currentTime / 30) * 100;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            
            const minutes = Math.floor(currentAudio.currentTime / 60);
            const seconds = Math.floor(currentAudio.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 100);
}

// Display lyrics
function displayLyrics(songId) {
    const songLyrics = lyrics[songId];
    if (songLyrics) {
        // Build lyrics HTML
        const lyricsHTML = songLyrics.map(line => `<p>${line}</p>`).join('');
        lyricsDisplay.innerHTML = `<div>${lyricsHTML}</div>`;
    }
}

// Hide lyrics
function hideLyrics() {
    lyricsDisplay.innerHTML = 'Click a sticker';
}

// Format time helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopMusic();
});
