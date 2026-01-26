// Get DOM elements
const vinylPreview = document.getElementById('vinylPreview');
const centerColor = document.getElementById('centerColor');
const spinBtn = document.getElementById('spinBtn');
const saveBtn = document.getElementById('saveBtn');
const addStickerBtn = document.getElementById('addStickerBtn');
const stickersContainer = document.getElementById('stickersContainer');
const textInput = document.getElementById('textInput');
const addTextBtn = document.getElementById('addTextBtn');
const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const uploadFilename = document.getElementById('uploadFilename');

// Draw elements
const drawBtn = document.getElementById('drawBtn');
const penSizeSlider = document.getElementById('penSizeSlider');
const penSizeValue = document.getElementById('penSizeValue');
const clearDrawBtn = document.getElementById('clearDrawBtn');
const eraserBtn = document.getElementById('eraserBtn');
const penColorButtons = document.querySelectorAll('.pen-color-btn');

// Border editor elements
const borderEditor = document.getElementById('borderEditor');
const stickerSizeSlider = document.getElementById('stickerSizeSlider');
const stickerSizeValue = document.getElementById('stickerSizeValue');
const borderColorOptions = document.querySelectorAll('.border-color-option');
const borderWidthSlider = document.getElementById('borderWidthSlider');
const borderWidthValue = document.getElementById('borderWidthValue');
const borderStyleBtns = document.querySelectorAll('.border-style-btn');

// Color buttons
const colorButtons = document.querySelectorAll('.color-btn');
const centerColorButtons = document.querySelectorAll('.center-color-btn');

// Library items
const libraryItems = document.querySelectorAll('.library-item');

// Drawing state
let isDrawing = false;
let drawingMode = false;
let eraserMode = false;
let penColor = 'black';
let penSize = 3;
let drawingCanvas = null;
let drawingCtx = null;
let lastX = 0;
let lastY = 0;

// State
let stickers = [];
let selectedSticker = null;
let draggedSticker = null;
let isDragging = false;
let startX, startY;
let stickerIdCounter = 0;

// Initialize
function init() {
    loadCustomization();
    setupColorButtons();
    setupLibrary();
    setupTextSticker();
    setupImageUpload();
    setupButtons();
    setupBorderEditor();
    setupToolbarButtons();
    setupDrawing();
    
    // Add initial default stickers if none exist
    if (stickers.length === 0) {
        addSticker('🎵', 50, 15);
        addSticker('⭐', 85, 35);
        addSticker('❤️', 85, 65);
        addSticker('🔥', 50, 85);
        addSticker('✨', 15, 50);
    }
}

// Setup color buttons
function setupColorButtons() {
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.dataset.color;
            vinylPreview.className = 'vinyl-preview vinyl-' + color;
        });
    });
    
    centerColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            centerColorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.dataset.center;
            centerColor.className = 'center-color center-' + color;
        });
    });
}

// Setup sticker library
function setupLibrary() {
    libraryItems.forEach(item => {
        item.addEventListener('click', () => {
            const emoji = item.dataset.emoji;
            const x = 50 + (Math.random() - 0.5) * 40;
            const y = 50 + (Math.random() - 0.5) * 40;
            addSticker(emoji, x, y);
        });
    });
}

// Setup toolbar button clicks
function setupToolbarButtons() {
    const toolbarItems = document.querySelectorAll('.toolbar-item');
    
    toolbarItems.forEach(item => {
        const btn = item.querySelector('.toolbar-btn');
        const panel = item.querySelector('.toolbar-panel');
        
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const wasActive = item.classList.contains('active');
                
                // Close all other panels and reset their button colors
                toolbarItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.toolbar-btn');
                        if (otherBtn && otherBtn.id !== 'saveBtn') {
                            otherBtn.style.background = '';
                        }
                    }
                });
                
                // Toggle current panel
                if (wasActive) {
                    // Close if already open
                    item.classList.remove('active');
                    if (btn.id !== 'saveBtn') {
                        btn.style.background = '';
                    }
                } else {
                    // Open panel
                    item.classList.add('active');
                    if (btn.id !== 'saveBtn') {
                        btn.style.background = 'rgba(255, 107, 107, 0.5)';
                    }
                    
                    // Scroll button into view on mobile
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }, 100);
                    }
                }
            });
        }
        
        // Prevent panel clicks from closing
        if (panel) {
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.toolbar-item') && !e.target.closest('#drawingCanvas') && !e.target.closest('.vinyl-preview')) {
            toolbarItems.forEach(item => {
                item.classList.remove('active');
                const btn = item.querySelector('.toolbar-btn');
                if (btn && btn.id !== 'saveBtn') {
                    btn.style.background = '';
                }
            });
        }
    });
}

// Setup text sticker
function setupTextSticker() {
    addTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            const x = 50 + (Math.random() - 0.5) * 40;
            const y = 50 + (Math.random() - 0.5) * 40;
            addSticker(text, x, y, 'text');
            textInput.value = '';
        }
    });
    
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTextBtn.click();
        }
    });
}

// Setup image upload
function setupImageUpload() {
    uploadImageBtn.addEventListener('click', () => {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadFilename.textContent = `Selected: ${file.name}`;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageData = event.target.result;
                const x = 50 + (Math.random() - 0.5) * 40;
                const y = 50 + (Math.random() - 0.5) * 40;
                addSticker(imageData, x, y, 'image');
                uploadFilename.textContent = `✅ ${file.name} added!`;
                
                // Reset after 2 seconds
                setTimeout(() => {
                    uploadFilename.textContent = '';
                    imageInput.value = '';
                }, 2000);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Setup border editor
function setupBorderEditor() {
    // Sticker size
    stickerSizeSlider.addEventListener('input', () => {
        if (!selectedSticker) return;
        
        const size = stickerSizeSlider.value;
        stickerSizeValue.textContent = size + 'px';
        selectedSticker.size = parseInt(size);
        updateStickerPosition(selectedSticker);
    });
    
    // Border color
    borderColorOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (!selectedSticker) return;
            
            borderColorOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            selectedSticker.border.color = option.dataset.color;
            updateStickerBorder(selectedSticker);
        });
    });
    
    // Border width
    borderWidthSlider.addEventListener('input', () => {
        if (!selectedSticker) return;
        
        const width = borderWidthSlider.value;
        borderWidthValue.textContent = width + 'px';
        selectedSticker.border.width = parseInt(width);
        updateStickerBorder(selectedSticker);
    });
    
    // Border style
    borderStyleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!selectedSticker) return;
            
            borderStyleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            selectedSticker.border.style = btn.dataset.style;
            updateStickerBorder(selectedSticker);
        });
    });
    
    // Close editor when clicking outside
    document.addEventListener('click', (e) => {
        // Check if click is outside border editor and not on a sticker
        if (borderEditor.classList.contains('active') && 
            !borderEditor.contains(e.target) && 
            !e.target.closest('.sticker-preview')) {
            borderEditor.classList.remove('active');
            // Deselect sticker when closing
            document.querySelectorAll('.sticker-preview').forEach(el => {
                el.classList.remove('selected');
            });
            selectedSticker = null;
        }
    });
}

// Open border editor for sticker
function openBorderEditor(stickerId) {
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    borderEditor.classList.add('active');
    
    // Initialize border if not exists
    if (!sticker.border) {
        sticker.border = {
            enabled: true,
            color: '#ffffff',
            width: 3,
            style: 'solid'
        };
    }
    
    // Set size
    stickerSizeSlider.value = sticker.size;
    stickerSizeValue.textContent = sticker.size + 'px';
    
    // Set color
    borderColorOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.color === sticker.border.color);
    });
    
    // Set width
    borderWidthSlider.value = sticker.border.width;
    borderWidthValue.textContent = sticker.border.width + 'px';
    
    // Set style
    borderStyleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === sticker.border.style);
    });
}

// Update sticker border
function updateStickerBorder(sticker) {
    const element = document.querySelector(`[data-id="${sticker.id}"]`);
    if (!element) return;
    
    if (sticker.border.enabled) {
        element.classList.remove('no-border');
        element.style.borderColor = sticker.border.color;
        element.style.borderWidth = sticker.border.width + 'px';
        element.style.borderStyle = sticker.border.style;
    } else {
        element.classList.add('no-border');
        element.style.borderColor = '';
        element.style.borderWidth = '';
        element.style.borderStyle = '';
    }
}

// Setup buttons
function setupButtons() {
    saveBtn.addEventListener('click', saveCustomization);
}

// Add sticker to vinyl
function addSticker(content, x, y, type = 'emoji') {
    const id = stickerIdCounter++;
    
    const sticker = {
        id,
        content,
        x,
        y,
        size: 60,
        rotation: 0,
        type, // 'emoji', 'text', or 'image'
        border: {
            enabled: true,
            color: '#ffffff',
            width: 3,
            style: 'solid'
        }
    };
    
    stickers.push(sticker);
    renderSticker(sticker);
}

// Render sticker element
function renderSticker(sticker) {
    const stickerEl = document.createElement('div');
    let className = 'sticker-preview';
    if (sticker.type === 'text') className += ' text-sticker';
    if (sticker.type === 'image') className += ' image-sticker';
    if (sticker.border && !sticker.border.enabled) className += ' no-border';
    
    stickerEl.className = className;
    stickerEl.dataset.id = sticker.id;
    stickerEl.style.left = sticker.x + '%';
    stickerEl.style.top = sticker.y + '%';
    stickerEl.style.width = sticker.size + 'px';
    stickerEl.style.height = sticker.size + 'px';
    stickerEl.style.transform = `translate(-50%, -50%) rotate(${sticker.rotation}deg)`;
    
    // Apply border styles
    if (sticker.border && sticker.border.enabled) {
        stickerEl.style.borderColor = sticker.border.color;
        stickerEl.style.borderWidth = sticker.border.width + 'px';
        stickerEl.style.borderStyle = sticker.border.style;
    }
    
    if (sticker.type === 'text') {
        const textSpan = document.createElement('span');
        textSpan.className = 'sticker-text-preview';
        textSpan.textContent = sticker.content;
        stickerEl.appendChild(textSpan);
    } else if (sticker.type === 'image') {
        const img = document.createElement('img');
        img.src = sticker.content;
        img.alt = 'Custom sticker';
        stickerEl.appendChild(img);
    } else {
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'sticker-emoji-preview';
        emojiSpan.textContent = sticker.content;
        stickerEl.appendChild(emojiSpan);
    }
    
    // Add controls
    const controls = document.createElement('div');
    controls.className = 'sticker-controls';
    
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'sticker-control-btn delete-btn';
    deleteBtn.innerHTML = '×';
    
    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        deleteSticker(sticker.id);
    };
    
    deleteBtn.addEventListener('click', handleDelete);
    deleteBtn.addEventListener('touchend', handleDelete);
    
    controls.appendChild(deleteBtn);
    stickerEl.appendChild(controls);
    
    // Add event listeners
    setupStickerInteraction(stickerEl, sticker);
    
    stickersContainer.appendChild(stickerEl);
}

// Setup sticker interaction (Instagram-style)
function setupStickerInteraction(element, sticker) {
    let startTouchDistance = 0;
    let startSize = sticker.size;
    let startRotation = sticker.rotation;
    
    // Mouse/Touch start
    const handleStart = (e) => {
        if (vinylPreview.classList.contains('spinning')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        selectSticker(sticker.id);
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = true;
        draggedSticker = sticker;
        
        // Multi-touch for pinch to resize/rotate
        if (e.touches && e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            startTouchDistance = Math.sqrt(dx * dx + dy * dy);
            startSize = sticker.size;
            startRotation = sticker.rotation;
        }
    };
    
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('touchstart', handleStart, { passive: false });
}

// Global move handler
document.addEventListener('mousemove', (e) => {
    if (!isDragging || !draggedSticker) return;
    
    const rect = vinylPreview.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(10, Math.min(90, y));
    
    draggedSticker.x = clampedX;
    draggedSticker.y = clampedY;
    
    updateStickerPosition(draggedSticker);
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging || !draggedSticker) return;
    e.preventDefault();
    
    if (e.touches.length === 1) {
        // Move
        const touch = e.touches[0];
        const rect = vinylPreview.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        
        const clampedX = Math.max(10, Math.min(90, x));
        const clampedY = Math.max(10, Math.min(90, y));
        
        draggedSticker.x = clampedX;
        draggedSticker.y = clampedY;
        
        updateStickerPosition(draggedSticker);
    } else if (e.touches.length === 2) {
        // Pinch to resize and rotate
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Resize
        const scale = distance / (startTouchDistance || distance);
        draggedSticker.size = Math.max(40, Math.min(150, startSize * scale));
        
        // Rotate
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        draggedSticker.rotation = angle;
        
        updateStickerPosition(draggedSticker);
    }
}, { passive: false });

// Global end handler
document.addEventListener('mouseup', () => {
    isDragging = false;
    draggedSticker = null;
});

document.addEventListener('touchend', () => {
    isDragging = false;
    draggedSticker = null;
});

// Update sticker position
function updateStickerPosition(sticker) {
    const element = document.querySelector(`[data-id="${sticker.id}"]`);
    if (element) {
        element.style.left = sticker.x + '%';
        element.style.top = sticker.y + '%';
        element.style.width = sticker.size + 'px';
        element.style.height = sticker.size + 'px';
        element.style.transform = `translate(-50%, -50%) rotate(${sticker.rotation}deg)`;
    }
}

// Select sticker
function selectSticker(id) {
    document.querySelectorAll('.sticker-preview').forEach(el => {
        el.classList.remove('selected');
    });
    
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.classList.add('selected');
        selectedSticker = stickers.find(s => s.id === id);
        // Automatically open border editor when sticker is selected
        openBorderEditor(id);
    }
}

// Delete sticker
function deleteSticker(id) {
    stickers = stickers.filter(s => s.id !== id);
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.remove();
    }
    selectedSticker = null;
}

// Clear all stickers
function clearStickers() {
    stickers = [];
    stickersContainer.innerHTML = '';
    selectedSticker = null;
}

// Render all stickers
function renderAllStickers() {
    stickersContainer.innerHTML = '';
    stickers.forEach(sticker => renderSticker(sticker));
}

// Save customization
function saveCustomization() {
    const customData = {
        vinylColor: document.querySelector('.color-btn.active')?.dataset.color || 'black',
        centerColor: document.querySelector('.center-color-btn.active')?.dataset.center || 'red',
        stickers: stickers.map(s => ({
            content: s.content,
            x: s.x,
            y: s.y,
            size: s.size,
            rotation: s.rotation,
            type: s.type || 'emoji',
            border: s.border || { enabled: true, color: '#ffffff', width: 3, style: 'solid' }
        }))
    };
    
    localStorage.setItem('customVinyl', JSON.stringify(customData));
    
    // Capture vinyl as image
    saveBtn.innerHTML = '<span>💾</span><small>Saving...</small>';
    
    // Use html2canvas to capture the vinyl
    html2canvas(vinylPreview, {
        backgroundColor: null,
        scale: 2,
        logging: false
    }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        localStorage.setItem('savedVinylImage', imageData);
        
        saveBtn.innerHTML = '<span>✅</span><small>Saved!</small>';
        
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 500);
    }).catch(error => {
        console.error('Error saving image:', error);
        // Fallback: just redirect without image
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 500);
    });
}

// Load customization
function loadCustomization() {
    const saved = localStorage.getItem('customVinyl');
    if (saved) {
        const customData = JSON.parse(saved);
        
        // Apply vinyl color
        if (customData.vinylColor) {
            const vinylBtn = document.querySelector(`[data-color="${customData.vinylColor}"]`);
            if (vinylBtn) {
                colorButtons.forEach(b => b.classList.remove('active'));
                vinylBtn.classList.add('active');
                vinylPreview.className = 'vinyl-preview vinyl-' + customData.vinylColor;
            }
        }
        
        // Apply center color
        if (customData.centerColor) {
            const centerBtn = document.querySelector(`[data-center="${customData.centerColor}"]`);
            if (centerBtn) {
                centerColorButtons.forEach(b => b.classList.remove('active'));
                centerBtn.classList.add('active');
                centerColor.className = 'center-color center-' + customData.centerColor;
            }
        }
        
        // Apply stickers
        if (customData.stickers && customData.stickers.length > 0) {
            clearStickers();
            customData.stickers.forEach(s => {
                const sticker = {
                    id: stickerIdCounter++,
                    content: s.content,
                    x: s.x,
                    y: s.y,
                    size: s.size || 60,
                    rotation: s.rotation || 0,
                    type: s.type || (s.isText ? 'text' : 'emoji'),
                    border: s.border || { enabled: true, color: '#ffffff', width: 3, style: 'solid' }
                };
                stickers.push(sticker);
                renderSticker(sticker);
            });
        }
    }
}

// Click outside to deselect
vinylPreview.addEventListener('click', (e) => {
    if (e.target === vinylPreview || e.target.classList.contains('grooves')) {
        document.querySelectorAll('.sticker-preview').forEach(el => {
            el.classList.remove('selected');
        });
        selectedSticker = null;
    }
});

// Setup drawing functionality
function setupDrawing() {
    // Create canvas for drawing
    if (!drawingCanvas) {
        drawingCanvas = document.createElement('canvas');
        drawingCanvas.id = 'drawingCanvas';
        drawingCanvas.width = vinylPreview.offsetWidth;
        drawingCanvas.height = vinylPreview.offsetHeight;
        drawingCanvas.style.position = 'absolute';
        drawingCanvas.style.top = '0';
        drawingCanvas.style.left = '0';
        drawingCanvas.style.pointerEvents = 'none';
        drawingCanvas.style.zIndex = '5';
        vinylPreview.appendChild(drawingCanvas);
        drawingCtx = drawingCanvas.getContext('2d');
        drawingCtx.lineCap = 'round';
        drawingCtx.lineJoin = 'round';
    }
    
    // Create custom cursor circle
    const cursorCircle = document.createElement('div');
    cursorCircle.id = 'eraserCursor';
    cursorCircle.style.cssText = `
        position: fixed;
        width: ${penSize * 3 * 2}px;
        height: ${penSize * 3 * 2}px;
        border: 2px solid white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        display: none;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursorCircle);
    
    // Toggle drawing mode
    drawBtn.addEventListener('click', () => {
        drawingMode = !drawingMode;
        const cursorCircle = document.getElementById('eraserCursor');
        if (drawingMode) {
            drawBtn.style.background = 'rgba(255, 107, 107, 0.5)';
            drawingCanvas.style.pointerEvents = 'auto';
            if (eraserMode) {
                vinylPreview.style.cursor = 'none';
                if (cursorCircle) cursorCircle.style.display = 'block';
            } else {
                vinylPreview.style.cursor = 'crosshair';
            }
        } else {
            drawBtn.style.background = '';
            drawingCanvas.style.pointerEvents = 'none';
            vinylPreview.style.cursor = 'move';
            if (cursorCircle) cursorCircle.style.display = 'none';
        }
    });
    
    // Pen color selection
    penColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            penColorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            penColor = btn.dataset.pencolor;
            eraserMode = false;
            eraserBtn.style.background = '';
            eraserBtn.style.color = '';
            eraserBtn.style.borderColor = '';
            const cursorCircle = document.getElementById('eraserCursor');
            if (cursorCircle) cursorCircle.style.display = 'none';
            if (drawingMode) vinylPreview.style.cursor = 'crosshair';
        });
    });
    
    // Eraser button
    eraserBtn.addEventListener('click', () => {
        eraserMode = !eraserMode;
        const cursorCircle = document.getElementById('eraserCursor');
        if (eraserMode) {
            penColorButtons.forEach(b => b.classList.remove('active'));
            eraserBtn.style.background = '#667eea';
            eraserBtn.style.color = 'white';
            eraserBtn.style.borderColor = '#667eea';
            if (drawingMode && cursorCircle) {
                cursorCircle.style.display = 'block';
                vinylPreview.style.cursor = 'none';
            }
        } else {
            eraserBtn.style.background = '';
            eraserBtn.style.color = '';
            eraserBtn.style.borderColor = '';
            if (cursorCircle) {
                cursorCircle.style.display = 'none';
            }
            if (drawingMode) {
                vinylPreview.style.cursor = 'crosshair';
            }
        }
    });
    
    // Pen size slider
    penSizeSlider.addEventListener('input', () => {
        penSize = penSizeSlider.value;
        penSizeValue.textContent = penSize;
        const cursorCircle = document.getElementById('eraserCursor');
        if (cursorCircle && eraserMode) {
            const size = penSize * 3 * 2;
            cursorCircle.style.width = size + 'px';
            cursorCircle.style.height = size + 'px';
        }
    });
    
    // Clear drawing
    clearDrawBtn.addEventListener('click', () => {
        if (drawingCtx) {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        }
    });
    
    // Drawing events
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);
    
    // Cursor circle follow mouse
    document.addEventListener('mousemove', (e) => {
        const cursorCircle = document.getElementById('eraserCursor');
        if (cursorCircle && eraserMode && drawingMode) {
            cursorCircle.style.left = e.clientX + 'px';
            cursorCircle.style.top = e.clientY + 'px';
        }
    });
    
    // Touch events for mobile
    drawingCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        drawingCanvas.dispatchEvent(mouseEvent);
    });
    
    drawingCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        drawingCanvas.dispatchEvent(mouseEvent);
    });
    
    drawingCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        drawingCanvas.dispatchEvent(mouseEvent);
    });
}

function startDrawing(e) {
    if (!drawingMode) return;
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing || !drawingMode) return;
    
    const rect = drawingCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    if (eraserMode) {
        drawingCtx.globalCompositeOperation = 'destination-out';
        drawingCtx.lineWidth = penSize * 3;
    } else {
        drawingCtx.globalCompositeOperation = 'source-over';
        drawingCtx.strokeStyle = penColor;
        drawingCtx.lineWidth = penSize;
    }
    
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(currentX, currentY);
    drawingCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
