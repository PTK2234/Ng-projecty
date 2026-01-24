# 🎵 Vinyl Record Player Website

A fully responsive, interactive website featuring an animated vinyl record with clickable stickers. Each sticker plays 30 seconds of music when clicked. Includes a comprehensive customization page with Instagram-style sticker editor.

## Features

### Main Player Page
✨ **Fully Responsive** - Optimized for all devices (desktop, tablet, mobile)
🎨 **Animated Vinyl Record** - Spinning animation with counter-rotating stickers
🎯 **Interactive Stickers** - 5 clickable stickers with different music genres
⏱️ **30-Second Playback** - Each track automatically stops after 30 seconds
📊 **Progress Bar** - Visual feedback showing playback progress
🎵 **Static Lyrics Display** - Shows lyrics in the center of the vinyl
🎚️ **Tone Arm Animation** - Realistic record player experience

### Custom Vinyl Page
🎨 **Instagram-Style Editor** - Professional sticker customization interface
📚 **Sticker Library** - 40+ emojis organized in 4 categories (Music, Symbols, Nature, Fun)
✍️ **Text Stickers** - Add custom text with different colors
🖼️ **Image Upload** - Convert your own images into stickers
🎭 **Sticker Editor** - Comprehensive editing with:
  - Size adjustment (40-150px)
  - Border customization (color, width, style)
  - Rotation control
📱 **Touch Gestures** - Drag to move, pinch to resize on mobile
💾 **Auto-Save** - Designs saved to localStorage
🎨 **Vinyl Colors** - 6 color options (Black, Blue, Red, Purple, Green, Gold)

## Mobile Optimization

The website is fully optimized for mobile devices with:

- **Touch-friendly controls** - All buttons meet minimum 44px touch target size
- **Responsive layouts** - Adapts to screen sizes from 360px to large desktops
- **Gesture support** - Drag, pinch, and tap interactions
- **Viewport optimization** - Prevents unwanted zooming and scaling
- **Performance** - Smooth animations and transitions on mobile devices
- **Touch-action CSS** - Improved touch handling and reduced delays

### Responsive Breakpoints

- **Desktop**: > 968px - Full layout with side-by-side preview and controls
- **Tablet**: 481px - 968px - Stacked layout with full-width controls
- **Mobile**: 361px - 480px - Compact layout with optimized spacing
- **Small Mobile**: ≤ 360px - Extra compact for small phones

## How to Use

### Playing Music

1. Open `index.html` in a web browser
2. Click on any sticker on the vinyl record to play music
3. Watch the vinyl spin and lyrics appear in the center
4. Click the Stop button or another sticker to change tracks

### Customizing Your Vinyl

1. Click the "🎨 Customize" button on the main page
2. Choose a vinyl color from the palette
3. Add stickers:
   - **Emoji Stickers**: Browse categories and click to add
   - **Text Stickers**: Type text, choose color, and click "Add Text"
   - **Image Stickers**: Click "Upload Image" and select a file
4. Customize stickers:
   - **Move**: Drag stickers to reposition (tap and drag on mobile)
   - **Resize**: Use the size slider in the editor (or pinch on mobile)
   - **Edit Border**: Click a sticker to open the editor
   - **Delete**: Click the 🗑️ button when a sticker is selected
5. Test the spin with the "🔄 Test Spin" button
6. Click "💾 Save Custom Vinyl" to persist your design

### Touch Gestures (Mobile)

- **Single tap**: Select sticker and open editor
- **Drag**: Move sticker around the vinyl
- **Pinch**: Resize and rotate sticker
- **Double tap vinyl**: Deselect current sticker

## Customization

### Adding Your Own Music

Replace the audio sources in `index.html`:

```html
<audio id="audio1" preload="metadata">
    <source src="your-music-file.mp3" type="audio/mpeg">
</audio>
```

### Changing Sticker Labels

Edit the track names in `script.js`:

```javascript
const trackNames = {
    1: '🎸 Your Genre',
    2: '🎹 Your Genre',
    // ... etc
};
```

### Adjusting Colors

Modify the gradient colors in `styles.css` for different sticker styles:

```css
.sticker-1 { background: linear-gradient(135deg, #YourColor1, #YourColor2); }
```

## Browser Compatibility

✅ **Desktop Browsers**
- Chrome (recommended)
- Firefox
- Safari
- Edge

✅ **Mobile Browsers**
- iOS Safari (iPhone/iPad)
- Chrome Mobile (Android)
- Samsung Internet
- Firefox Mobile

## Technologies Used

- **HTML5** - Semantic markup and audio elements
- **CSS3** - Animations, transitions, Flexbox, Grid, media queries
- **JavaScript (ES6+)** - Modern syntax with modules pattern
- **Web Audio API** - Audio playback control
- **FileReader API** - Image upload functionality
- **LocalStorage API** - Persistent data storage
- **Touch Events API** - Mobile gesture support

## File Structure

```
project/
├── index.html          # Main vinyl player page
├── styles.css          # Player page styles with responsive design
├── script.js           # Player functionality and music control
├── custom.html         # Customization page
├── custom-styles.css   # Customization page styles (mobile-optimized)
├── custom-script.js    # Sticker editor and drag-drop functionality
└── README.md           # Documentation
```

## Performance Notes

- All animations use CSS transforms for hardware acceleration
- Touch events use passive listeners where appropriate
- LocalStorage ensures instant load of saved designs
- Images are converted to base64 for easy storage
- Minimal dependencies for fast loading

## Future Enhancements

- [ ] Add more music genres
- [ ] Custom audio file upload
- [ ] Share custom vinyl designs via URL
- [ ] Animated sticker effects
- [ ] Multiple vinyl designs per user
- [ ] Export vinyl as image
