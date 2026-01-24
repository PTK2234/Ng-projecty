// Load saved vinyl image
function loadVinylImage() {
    const vinylImage = localStorage.getItem('savedVinylImage');
    const vinylDisplay = document.getElementById('vinylDisplay');
    
    if (vinylImage) {
        const img = document.createElement('img');
        img.src = vinylImage;
        img.alt = 'Your Custom Vinyl';
        vinylDisplay.appendChild(img);
    } else {
        vinylDisplay.innerHTML = '<p style="color: #666;">No vinyl image found. Please create one first!</p>';
    }
}

// Download vinyl image
document.getElementById('downloadBtn').addEventListener('click', () => {
    const vinylImage = localStorage.getItem('savedVinylImage');
    if (vinylImage) {
        const link = document.createElement('a');
        link.download = 'my-custom-vinyl.png';
        link.href = vinylImage;
        link.click();
    } else {
        alert('No image to download!');
    }
});

// Share to Facebook
document.getElementById('shareFacebook').addEventListener('click', () => {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
});

// Share to Twitter
document.getElementById('shareTwitter').addEventListener('click', () => {
    const text = 'Check out my custom vinyl design! 🎵✨';
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
});

// Share to Pinterest
document.getElementById('sharePinterest').addEventListener('click', () => {
    const vinylImage = localStorage.getItem('savedVinylImage');
    const url = window.location.href;
    const description = 'My Custom Vinyl Design';
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(vinylImage)}&description=${encodeURIComponent(description)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
});

// Copy link
document.getElementById('copyLink').addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyLink');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>✓</span> Copied!';
        btn.style.background = '#13f287';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '#667eea';
        }, 2000);
    }).catch(() => {
        alert('Failed to copy link. Please copy manually: ' + url);
    });
});

// Create new vinyl
document.getElementById('newVinylBtn').addEventListener('click', () => {
    if (confirm('Start a new vinyl design? Your current design will be saved.')) {
        window.location.href = 'custom.html';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadVinylImage);
