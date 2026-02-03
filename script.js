// Get DOM elements
const vinyl = document.getElementById('vinyl');
const stickers = document.querySelectorAll('.sticker');
const stopBtn = document.getElementById('stopBtn');
const player = document.getElementById('player');
// trackInfo removed (player no longer contains .track-info)
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const lyricsDisplay = document.getElementById('lyricsDisplay');
const toneArm = document.getElementById('toneArm');

// State
let currentAudio = null;
let currentSticker = null;
let progressInterval = null;
let currentEmbed = null;
// YouTube API state
window.ytPlayer = null;
window.ytApiLoaded = false;
window.pendingYtAction = null;

// Track names
const trackNames = {
    1: '🎸 Rock Vibes',
    2: '🎹 Jazz Mood',
    3: '🎺 Blues Soul',
    4: '🎵 Pop Hits',
    5: '🎼 Classical Beauty'
};

// Embed URLs for each song (YouTube/Spotify)
const embedUrls = {
    1: 'https://www.youtube.com/embed/82s8PRgYSRU?si=kgDrx7d0NlMw2pwU',
    2: '',
    3: '',
    4: '',
    5: ''
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
        }, { passive: true });
    });

    // If a sticker contains an iframe (example: rock sticker), disable pointer events
    // on that iframe so clicks reach the sticker element (stickers act as buttons).
    stickers.forEach(sticker => {
        const innerIframe = sticker.querySelector('iframe');
        if (innerIframe) innerIframe.style.pointerEvents = 'none';
    });

    // Stop button
    if (stopBtn) stopBtn.addEventListener('click', stopMusic);

    // Vinyl click to stop
    if (vinyl) {
        vinyl.addEventListener('click', (e) => {
            if (e.target === vinyl || e.target.classList.contains('grooves')) {
                stopMusic();
            }
        }, { passive: true });
    }
}

// YouTube API ready callback (called by the API script)
function onYouTubeIframeAPIReady() {
    window.ytApiLoaded = true;
    if (typeof window.pendingYtAction === 'function') {
        window.pendingYtAction();
        window.pendingYtAction = null;
    }
}

function extractYouTubeId(url) {
    if (!url) return null;
    // Try to extract from common YouTube URL forms
    const m = url.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
}

function createOrLoadYouTube(videoId, start = 0, end = 0) {
    // ensure player container
    player.innerHTML = '<div id="yt-player"></div>';

    const run = () => {
        if (window.ytPlayer) {
            // If player exists, load requested video
            try {
                if (typeof window.ytPlayer.loadVideoById === 'function') {
                    const opts = { videoId };
                    if (start) opts.startSeconds = parseInt(start, 10) || 0;
                    if (end) opts.endSeconds = parseInt(end, 10) || undefined;
                    window.ytPlayer.loadVideoById(opts);
                    window.ytPlayer.playVideo();
                } else {
                    window.ytPlayer.cueVideoById(videoId);
                }
            } catch (e) {
                // fallback: replace iframe src directly
                const iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '160';
                const sep = embedUrl.includes('?') ? '&' : '?';
                iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}${end ? `&end=${end}` : ''}&autoplay=1`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframe.allowFullscreen = true;
                const container = document.getElementById('yt-player');
                if (container) container.appendChild(iframe);
            }
            return;
        }

        // create player
        window.ytPlayer = new YT.Player('yt-player', {
            height: '160',
            width: '100%',
            videoId,
            playerVars: {
                autoplay: 1,
                start: parseInt(start, 10) || 0,
                end: parseInt(end, 10) || undefined,
                rel: 0
            },
            events: {
                onReady: (e) => { try { e.target.playVideo(); } catch (e) {} },
                onStateChange: (e) => {
                    // handle end or other states if needed
                }
            }
        });
    };

    if (window.ytApiLoaded || (window.YT && window.YT.Player)) {
        run();
    } else {
        // Wait for API to load
        window.pendingYtAction = run;
    }
}

// Play music (stickers act as buttons to show/embed a player)
function playMusic(songId, stickerEl) {
    // Clear previous embed
    if (currentEmbed) {
        currentEmbed.remove();
        currentEmbed = null;
    }

    // Mark active sticker
    if (currentSticker) currentSticker.classList.remove('active');
    currentSticker = stickerEl;
    if (currentSticker) currentSticker.classList.add('active');

    // Show embed in player. Prefer sticker's data-embed, support YouTube via IFrame API.
    const embedUrl = (stickerEl && stickerEl.dataset && stickerEl.dataset.embed) ? stickerEl.dataset.embed : embedUrls[songId];
    const start = (stickerEl && stickerEl.dataset && stickerEl.dataset.start) ? stickerEl.dataset.start : 0;
    const end = (stickerEl && stickerEl.dataset && stickerEl.dataset.end) ? stickerEl.dataset.end : 0;
    player.innerHTML = '';
    if (embedUrl) {
        const ytId = extractYouTubeId(embedUrl);
        if (ytId) {
            // Use YouTube IFrame Player API for start/end control
            createOrLoadYouTube(ytId, start, end);
            currentEmbed = 'youtube';
        } else {
            // Fallback: plain iframe
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '160';
            iframe.src = embedUrl;
            // allow lazy-loading for non-YouTube fallback iframes
            try { iframe.loading = 'lazy'; } catch (e) {}
            iframe.title = (trackNames[songId] || 'Track') + ' player';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            player.appendChild(iframe);
            currentEmbed = iframe;
        }
    } else {
        player.innerHTML = '<p>No embed link available for this track.</p>';
    }

    // Tidy up UI
    hideLyrics();
    if (vinyl) vinyl.classList.remove('spinning');
    if (toneArm) toneArm.classList.remove('playing');
}

function stopMusic() {
    if (currentEmbed) {
        currentEmbed.remove();
        currentEmbed = null;
    }

    // Restore default player content (no track/time info)
    player.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
    `;

    if (vinyl) vinyl.classList.remove('spinning');
    if (toneArm) toneArm.classList.remove('playing');
    hideLyrics();
    currentAudio = null;
    if (currentSticker) {
        currentSticker.classList.remove('active');
        currentSticker = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Progress tracking (kept for compatibility but inactive when embed used)
function startProgressTracking() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (currentAudio && currentTimeEl && progressFill) {
            const progress = (currentAudio.currentTime / 30) * 100;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            const minutes = Math.floor(currentAudio.currentTime / 60);
            const seconds = Math.floor(currentAudio.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 100);
}

// Display/hide lyrics
function displayLyrics(songId) {
    const songLyrics = lyrics[songId];
    if (songLyrics && lyricsDisplay) {
        const lyricsHTML = songLyrics.map(line => `<p>${line}</p>`).join('');
        lyricsDisplay.innerHTML = `<div>${lyricsHTML}</div>`;
    }
}

function hideLyrics() {
    if (lyricsDisplay) lyricsDisplay.innerHTML = 'Click a sticker';
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
    }
    if (progressInterval) clearInterval(progressInterval);
}, { passive: true });
