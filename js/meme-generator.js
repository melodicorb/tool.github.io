/**
 * Meme Generator Tool - JavaScript functionality
 * Part of MultiTool Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const memeCanvas = document.getElementById('meme-canvas');
    const ctx = memeCanvas.getContext('2d');
    const templateSelect = document.getElementById('meme-template');
    const customUploadContainer = document.getElementById('custom-upload-container');
    const customImageUpload = document.getElementById('custom-image-upload');
    const topTextInput = document.getElementById('top-text');
    const bottomTextInput = document.getElementById('bottom-text');
    const textColorInput = document.getElementById('text-color');
    const textStrokeInput = document.getElementById('text-stroke');
    const fontSizeInput = document.getElementById('font-size');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Meme State
    let currentTemplate = 'drake';
    let customImage = null;
    let memeImage = new Image();
    
    // Canvas dimensions
    const canvasWidth = 600;
    const canvasHeight = 600;
    
    // Set canvas dimensions
    memeCanvas.width = canvasWidth;
    memeCanvas.height = canvasHeight;
    
    // Template paths
    const templatePaths = {
        'drake': 'https://i.imgur.com/dTWMkKe.jpg',
        'distracted': 'https://i.imgur.com/QbRXRRQ.jpg',
        'buttons': 'https://i.imgur.com/Ey5GtPA.jpg',
        'change-mind': 'https://i.imgur.com/LLS8EeD.jpg',
        'doge': 'https://i.imgur.com/2jLKypH.jpg',
        'success-kid': 'https://i.imgur.com/ZibGHCk.jpg',
        'thinking': 'https://i.imgur.com/jNBmJkv.jpg'
    };
    
    // Initialize
    loadTemplate(currentTemplate);
    
    // Event Listeners
    templateSelect.addEventListener('change', function() {
        currentTemplate = this.value;
        
        if (currentTemplate === 'custom') {
            customUploadContainer.classList.remove('hidden');
        } else {
            customUploadContainer.classList.add('hidden');
            loadTemplate(currentTemplate);
        }
    });
    
    customImageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                customImage = new Image();
                customImage.onload = function() {
                    generateMeme();
                };
                customImage.src = event.target.result;
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    generateBtn.addEventListener('click', generateMeme);
    
    // Text input live preview
    [topTextInput, bottomTextInput, textColorInput, textStrokeInput, fontSizeInput].forEach(input => {
        input.addEventListener('input', function() {
            generateMeme();
        });
    });
    
    downloadBtn.addEventListener('click', downloadMeme);
    
    /**
     * Load a meme template
     */
    function loadTemplate(template) {
        showLoading();
        
        if (templatePaths[template]) {
            memeImage = new Image();
            memeImage.crossOrigin = 'Anonymous'; // Enable CORS for the image
            memeImage.onload = function() {
                generateMeme();
                hideLoading();
            };
            memeImage.onerror = function() {
                alert('Error loading template. Please try another one.');
                hideLoading();
            };
            memeImage.src = templatePaths[template];
        }
    }
    
    /**
     * Generate the meme with current settings
     */
    function generateMeme() {
        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw the template image
        let imageToUse = currentTemplate === 'custom' ? customImage : memeImage;
        
        if (imageToUse) {
            // Calculate aspect ratio to fit the image properly
            const aspectRatio = imageToUse.width / imageToUse.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            
            if (aspectRatio > 1) {
                // Wider than tall
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / aspectRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                // Taller than wide
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * aspectRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            }
            
            ctx.drawImage(imageToUse, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        // Get text inputs
        const topText = topTextInput.value.toUpperCase();
        const bottomText = bottomTextInput.value.toUpperCase();
        
        // Get styling options
        const textColor = textColorInput.value;
        const strokeColor = textStrokeInput.value;
        const fontSize = parseInt(fontSizeInput.value);
        
        // Draw text
        ctx.font = `bold ${fontSize}px Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = textColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = fontSize / 15; // Proportional stroke width
        
        // Draw top text with text wrapping
        if (topText) {
            drawTextWithWrap(topText, canvasWidth / 2, fontSize + 10, fontSize, canvasWidth * 0.9);
        }
        
        // Draw bottom text with text wrapping
        if (bottomText) {
            drawTextWithWrap(bottomText, canvasWidth / 2, canvasHeight - 20, fontSize, canvasWidth * 0.9);
        }
    }
    
    /**
     * Draw text with wrapping
     */
    function drawTextWithWrap(text, x, y, fontSize, maxWidth) {
        const words = text.split(' ');
        const lineHeight = fontSize * 1.2;
        let line = '';
        let lines = [];
        
        // Create wrapped lines
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        // Adjust y position based on number of lines
        if (y < canvasHeight / 2) {
            // Top text
            for (let i = 0; i < lines.length; i++) {
                const lineY = y + (i * lineHeight);
                drawTextWithStroke(lines[i], x, lineY);
            }
        } else {
            // Bottom text
            for (let i = 0; i < lines.length; i++) {
                const lineY = y - ((lines.length - 1 - i) * lineHeight);
                drawTextWithStroke(lines[i], x, lineY);
            }
        }
    }
    
    /**
     * Draw text with stroke
     */
    function drawTextWithStroke(text, x, y) {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }
    
    /**
     * Download the generated meme
     */
    function downloadMeme() {
        // Create a temporary link element
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = memeCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Show loading indicator
     */
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
    }
    
    /**
     * Hide loading indicator
     */
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }
});