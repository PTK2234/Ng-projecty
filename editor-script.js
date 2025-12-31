// Editor State
let locations = [...LOCATIONS]; // Clone the original data
let selectedLocation = null;
let previewMap = null;
let previewMarker = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    renderLocationsList();
    setupEventListeners();
});

// Initialize Preview Map
function initializeMap() {
    previewMap = L.map('preview-map', {
        zoomControl: true,
        attributionControl: false
    }).setView([21.0285, 105.8542], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(previewMap);

    // Click to set coordinates
    previewMap.on('click', (e) => {
        if (selectedLocation) {
            document.getElementById('lat').value = e.latlng.lat.toFixed(6);
            document.getElementById('lng').value = e.latlng.lng.toFixed(6);
            updatePreviewMarker(e.latlng.lat, e.latlng.lng);
        }
    });
}

// Render Locations List
function renderLocationsList(filter = '') {
    const listContainer = document.getElementById('locations-list');
    const filteredLocations = locations.filter(loc => 
        loc.name.toLowerCase().includes(filter.toLowerCase()) ||
        loc.address.toLowerCase().includes(filter.toLowerCase()) ||
        loc.id.toString().includes(filter)
    );

    document.getElementById('location-count').textContent = filteredLocations.length;

    listContainer.innerHTML = filteredLocations.map(location => `
        <div class="location-item ${selectedLocation?.id === location.id ? 'active' : ''}" 
             data-id="${location.id}">
            <div class="location-item-header">
                <span class="location-number">#${location.id}</span>
                <span class="location-name">${location.name}</span>
            </div>
            <div class="location-address">${location.address}</div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            selectLocation(id);
        });
    });
}

// Select Location
function selectLocation(id) {
    selectedLocation = locations.find(loc => loc.id === id);
    if (!selectedLocation) return;

    // Update UI
    document.querySelectorAll('.location-item').forEach(item => {
        item.classList.toggle('active', parseInt(item.dataset.id) === id);
    });

    renderEditForm();
    updatePreviewMarker(selectedLocation.lat, selectedLocation.lng);
    previewMap.setView([selectedLocation.lat, selectedLocation.lng], 14);
}

// Render Edit Form
function renderEditForm() {
    if (!selectedLocation) return;

    const container = document.getElementById('editor-form-container');
    container.innerHTML = `
        <form class="editor-form" id="edit-form">
            <div class="form-header">
                <h2>Edit Location #${selectedLocation.id}</h2>
                <div class="form-actions">
                    <button type="button" id="delete-btn" class="btn btn-danger">
                        <span class="btn-icon">🗑</span>
                        Delete
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <span class="btn-icon">💾</span>
                        Save
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Location ID <span class="required">*</span>
                </label>
                <input type="number" id="location-id" class="form-input" 
                       value="${selectedLocation.id}" required>
                <div class="form-help">Sequential number for dot-to-dot order</div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Location Name <span class="required">*</span>
                </label>
                <input type="text" id="name" class="form-input" 
                       value="${selectedLocation.name}" required
                       placeholder="e.g., Arc de Triomphe">
            </div>

            <div class="form-group">
                <label class="form-label">
                    Address <span class="required">*</span>
                </label>
                <input type="text" id="address" class="form-input" 
                       value="${selectedLocation.address}" required
                       placeholder="e.g., Place Charles de Gaulle, 75008 Paris">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">
                        Latitude <span class="required">*</span>
                    </label>
                    <input type="number" id="lat" class="form-input" 
                           value="${selectedLocation.lat}" 
                           step="0.000001" required
                           placeholder="21.0285">
                    <div class="form-help">Click map to set</div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Longitude <span class="required">*</span>
                    </label>
                    <input type="number" id="lng" class="form-input" 
                           value="${selectedLocation.lng}" 
                           step="0.000001" required
                           placeholder="105.8542">
                    <div class="form-help">Click map to set</div>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Story <span class="required">*</span>
                </label>
                <textarea id="story" class="form-textarea" required
                          placeholder="Tell an emotional story about this location...">${selectedLocation.story}</textarea>
                <div class="form-help">This appears in the tooltip when users hover over the dot</div>
            </div>
        </form>
    `;

    // Setup form listeners
    document.getElementById('edit-form').addEventListener('submit', handleSaveLocation);
    document.getElementById('delete-btn').addEventListener('click', handleDeleteLocation);
    
    // Update preview on coordinate change
    document.getElementById('lat').addEventListener('input', updatePreviewFromInputs);
    document.getElementById('lng').addEventListener('input', updatePreviewFromInputs);
}

// Update Preview Marker
function updatePreviewMarker(lat, lng) {
    if (!previewMap) return;

    if (previewMarker) {
        previewMarker.setLatLng([lat, lng]);
    } else {
        previewMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'preview-marker-icon',
                html: `<div style="width: 20px; height: 20px; background: #00d4ff; border: 3px solid #060812; border-radius: 50%; box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(previewMap);
    }
}

// Update Preview from Inputs
function updatePreviewFromInputs() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    
    if (!isNaN(lat) && !isNaN(lng)) {
        updatePreviewMarker(lat, lng);
    }
}

// Handle Save Location
function handleSaveLocation(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('location-id').value);
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const story = document.getElementById('story').value;

    // Update location
    const index = locations.findIndex(loc => loc.id === selectedLocation.id);
    if (index !== -1) {
        locations[index] = { id, name, address, lat, lng, story };
        selectedLocation = locations[index];
        
        // Re-render
        renderLocationsList();
        showNotification('Location saved successfully!', 'success');
        
        // Update selected
        document.querySelectorAll('.location-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.id) === id);
        });
    }
}

// Handle Delete Location
function handleDeleteLocation() {
    if (!selectedLocation) return;
    
    if (confirm(`Are you sure you want to delete "${selectedLocation.name}"?`)) {
        locations = locations.filter(loc => loc.id !== selectedLocation.id);
        selectedLocation = null;
        
        const container = document.getElementById('editor-form-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📍</div>
                <h3>Location Deleted</h3>
                <p>Select another location or add a new one</p>
            </div>
        `;
        
        renderLocationsList();
        if (previewMarker) {
            previewMap.removeLayer(previewMarker);
            previewMarker = null;
        }
        
        showNotification('Location deleted successfully!', 'success');
    }
}

// Add New Location
function handleAddLocation() {
    const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
    const newLocation = {
        id: newId,
        name: 'New Location',
        address: 'Enter address',
        lat: 21.0285,
        lng: 105.8542,
        story: 'Enter your story here...'
    };
    
    locations.push(newLocation);
    renderLocationsList();
    selectLocation(newId);
    showNotification('New location added!', 'success');
}

// Export Data
function handleExport() {
    const dataStr = JSON.stringify(locations, null, 2);
    const dataBlob = new Blob([`// Location Data\nconst LOCATIONS = ${dataStr};\n`], { type: 'text/javascript' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'locations-data.js';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

// Import Data
function handleImport() {
    document.getElementById('import-modal').classList.add('show');
}

function confirmImport() {
    const textarea = document.getElementById('import-textarea');
    try {
        const imported = JSON.parse(textarea.value);
        
        if (!Array.isArray(imported)) {
            throw new Error('Data must be an array');
        }
        
        // Validate structure
        imported.forEach(loc => {
            if (!loc.id || !loc.name || !loc.address || !loc.lat || !loc.lng || !loc.story) {
                throw new Error('Invalid location structure');
            }
        });
        
        locations = imported;
        selectedLocation = null;
        renderLocationsList();
        
        const container = document.getElementById('editor-form-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✅</div>
                <h3>Import Successful</h3>
                <p>${locations.length} locations imported</p>
            </div>
        `;
        
        document.getElementById('import-modal').classList.remove('show');
        textarea.value = '';
        showNotification(`Imported ${locations.length} locations!`, 'success');
    } catch (error) {
        alert('Import failed: ' + error.message);
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        renderLocationsList(e.target.value);
    });
    
    // Add location
    document.getElementById('add-location-btn').addEventListener('click', handleAddLocation);
    
    // Export
    document.getElementById('export-btn').addEventListener('click', handleExport);
    
    // Import
    document.getElementById('import-btn').addEventListener('click', handleImport);
    document.getElementById('close-import-modal').addEventListener('click', () => {
        document.getElementById('import-modal').classList.remove('show');
    });
    document.getElementById('cancel-import').addEventListener('click', () => {
        document.getElementById('import-modal').classList.remove('show');
    });
    document.getElementById('confirm-import').addEventListener('click', confirmImport);
    
    // Center map
    document.getElementById('center-map-btn').addEventListener('click', () => {
        if (selectedLocation) {
            previewMap.setView([selectedLocation.lat, selectedLocation.lng], 14);
        }
    });
    
    // Close modal on outside click
    document.getElementById('import-modal').addEventListener('click', (e) => {
        if (e.target.id === 'import-modal') {
            document.getElementById('import-modal').classList.remove('show');
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
