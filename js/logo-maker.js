/**
 * Logo Maker Tool - MultiTool Hub
 * Provides functionality to create custom logos with shapes, text, and colors
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const logoPreview = document.getElementById('logo-preview');
    const logoText = document.getElementById('logo-text');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const fontSizeDisplay = document.getElementById('font-size-display');
    const shapeColor = document.getElementById('shape-color');
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const btnReset = document.getElementById('btn-reset');
    const btnDownload = document.getElementById('btn-download');
    const shapeButtons = document.querySelectorAll('.shape-btn');
    
    // Logo state
    let currentState = {
        shape: 'circle',
        text: 'Your Brand',
        fontFamily: 'Arial, sans-serif',
        fontSize: 40,
        textRotation: 0,
        shapeColor: '#4F46E5',
        textColor: '#FFFFFF',
        bgColor: '#FFFFFF'
    };
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Logo Maker Tool
     */
    function init() {
        // Set initial values
        logoText.value = currentState.text;
        fontFamily.value = currentState.fontFamily;
        fontSize.value = currentState.fontSize;
        fontSizeDisplay.textContent = `${currentState.fontSize}px`;
        if (document.getElementById('text-rotation')) {
            document.getElementById('text-rotation').value = currentState.textRotation;
            document.getElementById('text-rotation-display').textContent = `${currentState.textRotation}°`;
        }
        shapeColor.value = currentState.shapeColor;
        textColor.value = currentState.textColor;
        bgColor.value = currentState.bgColor;
        
        // Set up event listeners
        logoText.addEventListener('input', updateLogoText);
        fontFamily.addEventListener('change', updateFontFamily);
        fontSize.addEventListener('input', updateFontSize);
        if (document.getElementById('text-rotation')) {
            document.getElementById('text-rotation').addEventListener('input', updateTextRotation);
        }
        shapeColor.addEventListener('input', updateShapeColor);
        textColor.addEventListener('input', updateTextColor);
        bgColor.addEventListener('input', updateBgColor);
        btnReset.addEventListener('click', resetLogo);
        btnDownload.addEventListener('click', downloadLogo);
        
        // Set up shape buttons
        shapeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const shape = this.getAttribute('data-shape');
                updateShape(shape);
                
                // Update active state
                shapeButtons.forEach(btn => btn.classList.remove('bg-gray-200'));
                this.classList.add('bg-gray-200');
            });
        });
        
        // Initial render
        renderLogo();
    }
    
    /**
     * Update logo text
     */
    function updateLogoText() {
        currentState.text = logoText.value || 'Your Brand';
        renderLogo();
    }
    
    /**
     * Update font family
     */
    function updateFontFamily() {
        currentState.fontFamily = fontFamily.value;
        renderLogo();
    }
    
    /**
     * Update font size
     */
    function updateFontSize() {
        currentState.fontSize = parseInt(fontSize.value);
        fontSizeDisplay.textContent = `${currentState.fontSize}px`;
        renderLogo();
    }
    
    /**
     * Update text rotation
     */
    function updateTextRotation() {
        const rotationSlider = document.getElementById('text-rotation');
        if (rotationSlider) {
            currentState.textRotation = parseInt(rotationSlider.value);
            document.getElementById('text-rotation-display').textContent = `${currentState.textRotation}°`;
            renderLogo();
        }
    }
    
    /**
     * Update shape color
     */
    function updateShapeColor() {
        currentState.shapeColor = shapeColor.value;
        renderLogo();
    }
    
    /**
     * Update text color
     */
    function updateTextColor() {
        currentState.textColor = textColor.value;
        renderLogo();
    }
    
    /**
     * Update background color
     */
    function updateBgColor() {
        currentState.bgColor = bgColor.value;
        renderLogo();
    }
    
    /**
     * Update shape
     */
    function updateShape(shape) {
        currentState.shape = shape;
        renderLogo();
    }
    
    /**
     * Reset logo to default values
     */
    function resetLogo() {
        currentState = {
            shape: 'circle',
            text: 'Your Brand',
            fontFamily: 'Arial, sans-serif',
            fontSize: 40,
            textRotation: 0,
            shapeColor: '#4F46E5',
            textColor: '#FFFFFF',
            bgColor: '#FFFFFF'
        };
        
        // Update UI elements
        logoText.value = currentState.text;
        fontFamily.value = currentState.fontFamily;
        fontSize.value = currentState.fontSize;
        fontSizeDisplay.textContent = `${currentState.fontSize}px`;
        if (document.getElementById('text-rotation')) {
            document.getElementById('text-rotation').value = currentState.textRotation;
            document.getElementById('text-rotation-display').textContent = `${currentState.textRotation}°`;
        }
        shapeColor.value = currentState.shapeColor;
        textColor.value = currentState.textColor;
        bgColor.value = currentState.bgColor;
        
        // Reset shape buttons
        shapeButtons.forEach(btn => btn.classList.remove('bg-gray-200'));
        document.querySelector('[data-shape="circle"]').classList.add('bg-gray-200');
        
        renderLogo();
    }
    
    /**
     * Render the logo based on current state
     */
    function renderLogo() {
        // Clear previous content
        logoPreview.innerHTML = '';
        
        // Set background color
        logoPreview.style.backgroundColor = currentState.bgColor;
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '300');
        svg.setAttribute('viewBox', '0 0 300 300');
        
        // Create shape based on selection
        let shapeElement;
        switch(currentState.shape) {
            case 'circle':
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                shapeElement.setAttribute('cx', '150');
                shapeElement.setAttribute('cy', '150');
                shapeElement.setAttribute('r', '100');
                break;
            case 'square':
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                shapeElement.setAttribute('x', '50');
                shapeElement.setAttribute('y', '50');
                shapeElement.setAttribute('width', '200');
                shapeElement.setAttribute('height', '200');
                break;
            case 'triangle':
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeElement.setAttribute('points', '150,50 250,220 50,220');
                break;
            case 'star':
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeElement.setAttribute('points', '150,50 179,122 256,122 194,167 223,238 150,195 77,238 106,167 44,122 121,122');
                break;
            default:
                shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                shapeElement.setAttribute('cx', '150');
                shapeElement.setAttribute('cy', '150');
                shapeElement.setAttribute('r', '100');
        }
        
        // Set shape color
        shapeElement.setAttribute('fill', currentState.shapeColor);
        svg.appendChild(shapeElement);
        
        // Create text element
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '150');
        textElement.setAttribute('y', '160');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('fill', currentState.textColor);
        textElement.setAttribute('font-family', currentState.fontFamily);
        textElement.setAttribute('font-size', currentState.fontSize);
        
        // Apply rotation if set
        if (currentState.textRotation !== 0) {
            textElement.setAttribute('transform', `rotate(${currentState.textRotation}, 150, 160)`);
        }
        
        textElement.textContent = currentState.text;
        svg.appendChild(textElement);
        
        // Add SVG to preview
        logoPreview.appendChild(svg);
    }
    
    /**
     * Download logo as PNG image
     */
    function downloadLogo() {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = currentState.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Get SVG data
        const svg = logoPreview.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        // Create image from SVG
        const img = new Image();
        img.onload = function() {
            // Draw image to canvas (scaled up)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            
            // Convert canvas to blob and download
            canvas.toBlob(function(blob) {
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'logo.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            });
        };
        img.src = url;
    }
});