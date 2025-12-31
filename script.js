// Initialize the map
const map = L.map('map', {
    zoomControl: true,
    attributionControl: true,
    minZoom: 11,
    maxZoom: 15
}).setView([21.0285, 105.8542], 12);

// Add dark tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// State management
const state = {
    discoveredDots: new Set(),
    markers: [],
    lines: [],
    svgOverlay: null
};

// Get tooltip element
const tooltip = document.getElementById('custom-tooltip');
const tooltipNumber = tooltip.querySelector('.tooltip-number');
const tooltipTitle = tooltip.querySelector('.tooltip-title');
const tooltipAddress = tooltip.querySelector('.tooltip-address');
const tooltipStory = tooltip.querySelector('.tooltip-story');

// Initialize stats
document.getElementById('total').textContent = LOCATIONS.length;
document.getElementById('discovered').textContent = '0';

// Create SVG overlay for lines
function initializeSVGOverlay() {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.style.position = 'absolute';
    svgElement.style.top = '0';
    svgElement.style.left = '0';
    svgElement.style.width = '100%';
    svgElement.style.height = '100%';
    svgElement.style.pointerEvents = 'none';
    svgElement.style.zIndex = '400';
    
    map.getPanes().overlayPane.appendChild(svgElement);
    state.svgOverlay = svgElement;
    
    return svgElement;
}

// Draw line between two points
function drawLine(point1, point2, isActive = false) {
    if (!state.svgOverlay) {
        initializeSVGOverlay();
    }
    
    const p1 = map.latLngToLayerPoint(L.latLng(point1.lat, point1.lng));
    const p2 = map.latLngToLayerPoint(L.latLng(point2.lat, point2.lng));
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.classList.add('connection-line');
    if (isActive) {
        line.classList.add('active');
    }
    
    state.svgOverlay.appendChild(line);
    state.lines.push({ element: line, point1, point2, isActive });
}

// Update all lines positions (called on map zoom/pan)
function updateLines() {
    state.lines.forEach(lineData => {
        const p1 = map.latLngToLayerPoint(L.latLng(lineData.point1.lat, lineData.point1.lng));
        const p2 = map.latLngToLayerPoint(L.latLng(lineData.point2.lat, lineData.point2.lng));
        
        lineData.element.setAttribute('x1', p1.x);
        lineData.element.setAttribute('y1', p1.y);
        lineData.element.setAttribute('x2', p2.x);
        lineData.element.setAttribute('y2', p2.y);
    });
}

// Create custom dot marker
function createDotMarker(location) {
    const icon = L.divIcon({
        className: 'custom-dot-icon',
        html: `<div class="dot-marker" data-id="${location.id}">
                   <div class="dot-number">#${location.id}</div>
               </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    
    const marker = L.marker([location.lat, location.lng], { icon })
        .addTo(map);
    
    // Get the actual DOM element
    const markerElement = marker.getElement().querySelector('.dot-marker');
    
    // Mouse events
    markerElement.addEventListener('mouseenter', (e) => handleDotHover(location, e, markerElement));
    markerElement.addEventListener('mouseleave', () => handleDotLeave(markerElement));
    markerElement.addEventListener('mousemove', (e) => updateTooltipPosition(e));
    markerElement.addEventListener('click', () => discoverDot(location, markerElement));
    
    state.markers.push({ location, marker, element: markerElement });
    
    return marker;
}

// Handle dot hover
function handleDotHover(location, event, markerElement) {
    // Show tooltip
    tooltipNumber.textContent = `#${location.id}`;
    tooltipTitle.textContent = location.name;
    tooltipAddress.textContent = location.address;
    tooltipStory.textContent = location.story;
    
    tooltip.classList.add('show');
    updateTooltipPosition(event);
    
    // Highlight connected lines
    updateLineHighlights(location.id);
}

// Handle dot leave
function handleDotLeave(markerElement) {
    tooltip.classList.remove('show');
    
    // Reset line highlights
    state.lines.forEach(lineData => {
        const bothDiscovered = state.discoveredDots.has(lineData.point1.id) && 
                              state.discoveredDots.has(lineData.point2.id);
        if (bothDiscovered) {
            lineData.element.classList.add('active');
        } else {
            lineData.element.classList.remove('active');
        }
    });
}

// Update tooltip position
function updateTooltipPosition(event) {
    const x = event.clientX;
    const y = event.clientY;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let left = x + 20;
    let top = y - tooltipHeight / 2;
    
    // Adjust if tooltip goes off screen
    if (left + tooltipWidth > windowWidth - 20) {
        left = x - tooltipWidth - 20;
    }
    if (top < 20) {
        top = 20;
    }
    if (top + tooltipHeight > windowHeight - 20) {
        top = windowHeight - tooltipHeight - 20;
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// Discover a dot
function discoverDot(location, markerElement) {
    if (state.discoveredDots.has(location.id)) return;
    
    state.discoveredDots.add(location.id);
    markerElement.classList.add('discovered');
    
    // Update stats
    document.getElementById('discovered').textContent = state.discoveredDots.size;
    
    // Update connected lines
    updateLineHighlights(location.id);
    
    // Check if all discovered
    if (state.discoveredDots.size === LOCATIONS.length) {
        celebrateCompletion();
    }
    
    // Animate discovery
    markerElement.style.animation = 'none';
    setTimeout(() => {
        markerElement.style.animation = '';
    }, 10);
}

// Update line highlights based on discovered dots
function updateLineHighlights(currentDotId) {
    state.lines.forEach(lineData => {
        const point1Discovered = state.discoveredDots.has(lineData.point1.id);
        const point2Discovered = state.discoveredDots.has(lineData.point2.id);
        
        // Highlight if both points discovered or if hovering connects to discovered
        const shouldHighlight = (point1Discovered && point2Discovered) ||
                               (currentDotId === lineData.point1.id && point2Discovered) ||
                               (currentDotId === lineData.point2.id && point1Discovered);
        
        if (shouldHighlight) {
            lineData.element.classList.add('active');
            lineData.isActive = point1Discovered && point2Discovered;
        } else if (!lineData.isActive) {
            lineData.element.classList.remove('active');
        }
    });
}

// Celebrate completion
function celebrateCompletion() {
    // Add completion overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay active';
    document.body.appendChild(overlay);
    
    // Update story panel
    const storyPanel = document.querySelector('.story-panel .story-content');
    storyPanel.innerHTML = `
        <h2>✨ Journey Complete ✨</h2>
        <p>You've discovered all ${LOCATIONS.length} locations and revealed the spirit of the horse across the city.</p>
        <p class="story-highlight">The hoofbeats echo through time, reminding us that some bonds between human and nature are eternal.</p>
        <p style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.7;">Thank you for exploring these urban memories.</p>
    `;
    
    // Animate all dots
    state.markers.forEach((markerData, index) => {
        setTimeout(() => {
            markerData.element.style.animation = 'pulse 1s ease-in-out';
        }, index * 30);
    });
}

// Initialize the experience
function initialize() {
    // Create all markers
    LOCATIONS.forEach(location => {
        createDotMarker(location);
    });
    
    // Initialize SVG overlay
    initializeSVGOverlay();
    
    // Draw all connecting lines (in sequence to form horse shape)
    for (let i = 0; i < LOCATIONS.length - 1; i++) {
        drawLine(LOCATIONS[i], LOCATIONS[i + 1], false);
    }
    
    // Update lines on map move
    map.on('zoom', updateLines);
    map.on('move', updateLines);
    map.on('zoomend', updateLines);
    map.on('moveend', updateLines);
    
    // Initial line update
    setTimeout(updateLines, 100);
}

// Start the experience
initialize();

// Add subtle animation on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.header').style.opacity = '1';
    }, 100);
});
