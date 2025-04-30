/**
 * Drawing Pad Tool - MultiTool Hub
 * Provides canvas-based drawing functionality with various tools and options
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const brushSizeSlider = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    const colorPicker = document.getElementById('color-picker');
    const btnBrush = document.getElementById('btn-brush');
    const btnEraser = document.getElementById('btn-eraser');
    const btnClear = document.getElementById('btn-clear');
    const btnDownload = document.getElementById('btn-download');
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let brushSize = 5;
    let currentColor = '#000000';
    let currentTool = 'brush';
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Drawing Pad Tool
     */
    function init() {
        // Set up canvas size to match container dimensions
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Set up event listeners for drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support for mobile devices
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', stopDrawing);
        
        // Tool controls
        brushSizeSlider.addEventListener('input', updateBrushSize);
        colorPicker.addEventListener('input', updateColor);
        btnBrush.addEventListener('click', selectBrushTool);
        btnEraser.addEventListener('click', selectEraserTool);
        btnClear.addEventListener('click', clearCanvas);
        btnDownload.addEventListener('click', downloadCanvas);
        
        // Initialize with a white background
        clearCanvas();
    }
    
    /**
     * Resize canvas to fit container
     */
    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        
        // Maintain aspect ratio (4:3)
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.75;
        
        // Redraw canvas after resize
        clearCanvas();
    }
    
    /**
     * Start drawing when mouse is pressed
     */
    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
        
        // Create a dot at the starting point
        ctx.beginPath();
        ctx.arc(lastX, lastY, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentTool === 'brush' ? currentColor : '#FFFFFF';
        ctx.fill();
    }
    
    /**
     * Draw on the canvas as mouse moves
     */
    function draw(e) {
        if (!isDrawing) return;
        
        const coords = getCoordinates(e);
        const x = coords.x;
        const y = coords.y;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentTool === 'brush' ? currentColor : '#FFFFFF';
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
    
    /**
     * Stop drawing when mouse is released
     */
    function stopDrawing() {
        isDrawing = false;
    }
    
    /**
     * Handle touch start event for mobile devices
     */
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    /**
     * Handle touch move event for mobile devices
     */
    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    /**
     * Get coordinates relative to canvas
     */
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    /**
     * Update brush size from slider
     */
    function updateBrushSize() {
        brushSize = brushSizeSlider.value;
        sizeDisplay.textContent = `${brushSize}px`;
    }
    
    /**
     * Update drawing color from color picker
     */
    function updateColor() {
        currentColor = colorPicker.value;
        if (currentTool === 'brush') {
            btnBrush.click(); // Reactivate brush with new color
        }
    }
    
    /**
     * Select brush tool
     */
    function selectBrushTool() {
        currentTool = 'brush';
        btnBrush.classList.remove('bg-gray-200');
        btnBrush.classList.add('bg-indigo-600', 'text-white');
        btnEraser.classList.remove('bg-indigo-600', 'text-white');
        btnEraser.classList.add('bg-gray-200');
    }
    
    /**
     * Select eraser tool
     */
    function selectEraserTool() {
        currentTool = 'eraser';
        btnEraser.classList.remove('bg-gray-200');
        btnEraser.classList.add('bg-indigo-600', 'text-white');
        btnBrush.classList.remove('bg-indigo-600', 'text-white');
        btnBrush.classList.add('bg-gray-200');
    }
    
    /**
     * Clear the canvas
     */
    function clearCanvas() {
        if (currentTool === 'eraser') {
            // Switch back to brush if eraser is active
            selectBrushTool();
        }
        
        // Fill canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Download canvas as PNG image
     */
    function downloadCanvas() {
        // Create temporary link element
        const link = document.createElement('a');
        link.download = 'drawing_' + new Date().toISOString().slice(0, 10) + '.png';
        
        // Convert canvas to data URL
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
    }
});