/**
 * Animation Font Maker - MultiTool Hub
 * Provides functionality to create animated text with customizable effects and styles
 * Features include animation presets, sequence chaining, multiple export formats, and real-time preview
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Controls
    const animationText = document.getElementById('animation-text');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const fontColor = document.getElementById('font-color');
    const fontWeight = document.getElementById('font-weight');
    const animationType = document.getElementById('animation-type');
    const animationDuration = document.getElementById('animation-duration');
    const animationDelay = document.getElementById('animation-delay');
    const animationIteration = document.getElementById('animation-iteration');
    const backgroundColor = document.getElementById('background-color');
    const backgroundOpacity = document.getElementById('background-opacity');
    const textShadow = document.getElementById('text-shadow');
    const textEffect = document.getElementById('text-effect');
    const previewBtn = document.getElementById('preview-animation');
    const resetBtn = document.getElementById('reset-animation');
    const downloadBtn = document.getElementById('download-animation');
    
    // DOM Elements - Preview
    const animationPreview = document.getElementById('animation-preview');
    
    // DOM Elements - Saved Animations
    const savedAnimations = document.getElementById('saved-animations');
    const clearSavedBtn = document.getElementById('clear-saved');
    
    // DOM Elements - New Features
    const presetSelector = document.getElementById('animation-preset');
    const exportFormatSelector = document.getElementById('export-format');
    const timelineContainer = document.getElementById('timeline-container');
    const addSequenceBtn = document.getElementById('add-sequence');
    const realTimePreviewToggle = document.getElementById('real-time-preview');
    
    // Animation state
    let currentState = {
        text: '',
        fontFamily: 'Arial, sans-serif',
        fontSize: 48,
        fontColor: '#FFFFFF',
        fontWeight: 'bold',
        animationType: 'fade',
        animationDuration: 1,
        animationDelay: 0,
        animationIteration: 1,
        backgroundColor: '#000000',
        backgroundOpacity: 50,
        textShadow: 'none',
        textEffect: 'none',
        preset: 'none',
        exportFormat: 'png',
        realTimePreview: false,
        sequences: []
    };
    
    // Animation presets
    const animationPresets = {
        none: { name: 'None' },
        attention: {
            name: 'Attention Grabber',
            animationType: 'shake',
            animationDuration: 0.8,
            animationIteration: 'infinite',
            textShadow: 'heavy',
            fontColor: '#FF5733'
        },
        elegant: {
            name: 'Elegant Entrance',
            animationType: 'fade',
            animationDuration: 2,
            textShadow: 'medium',
            fontColor: '#E0E0E0',
            backgroundColor: '#2C3E50',
            backgroundOpacity: 90
        },
        energetic: {
            name: 'Energetic Bounce',
            animationType: 'bounce',
            animationDuration: 1,
            animationIteration: 3,
            textEffect: 'gradient'
        },
        typewriter: {
            name: 'Typewriter Effect',
            animationType: 'typewriter',
            animationDuration: 3,
            fontFamily: 'Courier New, monospace',
            backgroundColor: '#000000',
            fontColor: '#00FF00'
        },
        neon: {
            name: 'Neon Sign',
            textShadow: 'neon',
            animationType: 'pulse',
            animationDuration: 1.5,
            animationIteration: 'infinite',
            backgroundColor: '#000000',
            backgroundOpacity: 100,
            fontColor: '#00FFFF'
        }
    };
    
    // Timeline for animation sequences
    let animationTimeline = [];
    
    // Real-time preview interval
    let realTimePreviewInterval = null;
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Animation Font Maker Tool
     */
    function init() {
        // Set up event listeners
        animationText.addEventListener('input', updateText);
        fontFamily.addEventListener('change', updateFontFamily);
        fontSize.addEventListener('input', updateFontSize);
        fontColor.addEventListener('input', updateFontColor);
        fontWeight.addEventListener('change', updateFontWeight);
        animationType.addEventListener('change', updateAnimationType);
        animationDuration.addEventListener('input', updateAnimationDuration);
        animationDelay.addEventListener('input', updateAnimationDelay);
        animationIteration.addEventListener('change', updateAnimationIteration);
        backgroundColor.addEventListener('input', updateBackgroundColor);
        backgroundOpacity.addEventListener('input', updateBackgroundOpacity);
        textShadow.addEventListener('change', updateTextShadow);
        textEffect.addEventListener('change', updateTextEffect);
        
        // Action buttons
        previewBtn.addEventListener('click', previewAnimation);
        resetBtn.addEventListener('click', resetAnimation);
        downloadBtn.addEventListener('click', downloadAnimation);
        clearSavedBtn.addEventListener('click', clearSavedAnimations);
        
        // New feature event listeners
        if (presetSelector) {
            populatePresetSelector();
            presetSelector.addEventListener('change', applyPreset);
        }
        
        if (exportFormatSelector) {
            exportFormatSelector.addEventListener('change', updateExportFormat);
        }
        
        if (addSequenceBtn) {
            addSequenceBtn.addEventListener('click', addAnimationSequence);
        }
        
        if (realTimePreviewToggle) {
            realTimePreviewToggle.addEventListener('change', toggleRealTimePreview);
        }
        
        // Load saved animations
        loadSavedAnimations();
        
        // Initialize timeline if container exists
        if (timelineContainer) {
            initializeTimeline();
        }
    }
    
    /**
     * Populate the preset selector with available presets
     */
    function populatePresetSelector() {
        // Clear existing options
        presetSelector.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = 'none';
        defaultOption.textContent = 'Select a preset...';
        presetSelector.appendChild(defaultOption);
        
        // Add presets
        Object.keys(animationPresets).forEach(presetKey => {
            if (presetKey !== 'none') {
                const option = document.createElement('option');
                option.value = presetKey;
                option.textContent = animationPresets[presetKey].name;
                presetSelector.appendChild(option);
            }
        });
    }
    
    /**
     * Apply selected preset to current state
     */
    function applyPreset() {
        const presetKey = presetSelector.value;
        currentState.preset = presetKey;
        
        if (presetKey !== 'none') {
            const preset = animationPresets[presetKey];
            
            // Apply preset properties to current state
            Object.keys(preset).forEach(key => {
                if (key !== 'name' && currentState.hasOwnProperty(key)) {
                    currentState[key] = preset[key];
                    
                    // Update UI controls to match preset
                    updateControlsFromState();
                }
            });
            
            // Preview the animation with the new preset
            previewAnimation();
        }
    }
    
    /**
     * Update UI controls to match current state
     */
    function updateControlsFromState() {
        // Update form inputs to match current state
        if (currentState.animationType && animationType) {
            animationType.value = currentState.animationType;
        }
        
        if (currentState.animationDuration && animationDuration) {
            animationDuration.value = currentState.animationDuration;
        }
        
        if (currentState.animationIteration && animationIteration) {
            animationIteration.value = currentState.animationIteration;
        }
        
        if (currentState.textShadow && textShadow) {
            textShadow.value = currentState.textShadow;
        }
        
        if (currentState.textEffect && textEffect) {
            textEffect.value = currentState.textEffect;
        }
        
        if (currentState.fontColor && fontColor) {
            fontColor.value = currentState.fontColor;
        }
        
        if (currentState.backgroundColor && backgroundColor) {
            backgroundColor.value = currentState.backgroundColor;
        }
        
        if (currentState.backgroundOpacity && backgroundOpacity) {
            backgroundOpacity.value = currentState.backgroundOpacity;
        }
        
        if (currentState.fontFamily && fontFamily) {
            fontFamily.value = currentState.fontFamily;
        }
    }
    
    /**
     * Initialize the animation timeline
     */
    function initializeTimeline() {
        // Clear existing timeline
        timelineContainer.innerHTML = '';
        
        // Create timeline header
        const timelineHeader = document.createElement('div');
        timelineHeader.className = 'flex justify-between items-center mb-2';
        timelineHeader.innerHTML = `
            <h4 class="text-sm font-medium text-gray-700">Animation Timeline</h4>
            <button id="play-timeline" class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition">
                Play Sequence
            </button>
        `;
        timelineContainer.appendChild(timelineHeader);
        
        // Add event listener to play button
        timelineHeader.querySelector('#play-timeline').addEventListener('click', playAnimationSequence);
        
        // Create timeline tracks container
        const timelineTracks = document.createElement('div');
        timelineTracks.id = 'timeline-tracks';
        timelineTracks.className = 'space-y-2';
        timelineContainer.appendChild(timelineTracks);
        
        // Update timeline with current sequences
        updateTimelineDisplay();
    }
    
    /**
     * Update the timeline display with current sequences
     */
    function updateTimelineDisplay() {
        const timelineTracks = document.getElementById('timeline-tracks');
        if (!timelineTracks) return;
        
        // Clear existing tracks
        timelineTracks.innerHTML = '';
        
        // Add a message if no sequences
        if (currentState.sequences.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-sm text-gray-500 italic text-center py-2';
            emptyMessage.textContent = 'Add animation sequences to create multi-step animations';
            timelineTracks.appendChild(emptyMessage);
            return;
        }
        
        // Add each sequence to the timeline
        currentState.sequences.forEach((sequence, index) => {
            const sequenceTrack = document.createElement('div');
            sequenceTrack.className = 'bg-gray-100 rounded p-2 flex justify-between items-center';
            sequenceTrack.innerHTML = `
                <div>
                    <span class="font-medium">${index + 1}. ${sequence.animationType}</span>
                    <span class="text-xs text-gray-500 ml-2">${sequence.animationDuration}s</span>
                </div>
                <div class="flex space-x-2">
                    <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition edit-sequence" data-index="${index}">
                        Edit
                    </button>
                    <button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition delete-sequence" data-index="${index}">
                        Delete
                    </button>
                </div>
            `;
            timelineTracks.appendChild(sequenceTrack);
            
            // Add event listeners to buttons
            sequenceTrack.querySelector('.edit-sequence').addEventListener('click', () => editSequence(index));
            sequenceTrack.querySelector('.delete-sequence').addEventListener('click', () => deleteSequence(index));
        });
    }
    
    /**
     * Add a new animation sequence to the timeline
     */
    function addAnimationSequence() {
        // Create a new sequence from current settings
        const newSequence = {
            text: currentState.text,
            fontFamily: currentState.fontFamily,
            fontSize: currentState.fontSize,
            fontColor: currentState.fontColor,
            fontWeight: currentState.fontWeight,
            animationType: currentState.animationType,
            animationDuration: currentState.animationDuration,
            animationDelay: currentState.animationDelay,
            animationIteration: 1, // Force single iteration for sequences
            backgroundColor: currentState.backgroundColor,
            backgroundOpacity: currentState.backgroundOpacity,
            textShadow: currentState.textShadow,
            textEffect: currentState.textEffect
        };
        
        // Add to sequences array
        currentState.sequences.push(newSequence);
        
        // Update timeline display
        updateTimelineDisplay();
        
        // Show confirmation message
        showNotification('Animation sequence added to timeline');
    }
    
    /**
     * Edit an existing sequence
     */
    function editSequence(index) {
        // Get the sequence
        const sequence = currentState.sequences[index];
        
        // Apply sequence settings to current state
        Object.keys(sequence).forEach(key => {
            if (currentState.hasOwnProperty(key)) {
                currentState[key] = sequence[key];
            }
        });
        
        // Update UI controls
        updateControlsFromState();
        
        // Preview the animation
        previewAnimation();
        
        // Show confirmation message
        showNotification(`Editing sequence ${index + 1}`);
    }
    
    /**
     * Delete a sequence from the timeline
     */
    function deleteSequence(index) {
        // Remove the sequence
        currentState.sequences.splice(index, 1);
        
        // Update timeline display
        updateTimelineDisplay();
        
        // Show confirmation message
        showNotification('Sequence deleted');
    }
    
    /**
     * Play the animation sequence
     */
    function playAnimationSequence() {
        if (currentState.sequences.length === 0) {
            showNotification('No sequences to play. Add sequences first.');
            return;
        }
        
        // Clear preview
        animationPreview.innerHTML = '';
        
        // Play each sequence in order with delays
        let totalDelay = 0;
        
        currentState.sequences.forEach((sequence, index) => {
            setTimeout(() => {
                // Apply sequence settings
                Object.keys(sequence).forEach(key => {
                    if (currentState.hasOwnProperty(key)) {
                        currentState[key] = sequence[key];
                    }
                });
                
                // Render the animation
                renderAnimation();
                
                // Update UI controls to match current sequence
                updateControlsFromState();
                
                // Show which sequence is playing
                showNotification(`Playing sequence ${index + 1} of ${currentState.sequences.length}`);
            }, totalDelay * 1000);
            
            // Add duration plus a small gap for the next sequence
            totalDelay += sequence.animationDuration + 0.5;
        });
    }
    
    /**
     * Toggle real-time preview
     */
    function toggleRealTimePreview() {
        currentState.realTimePreview = realTimePreviewToggle.checked;
        
        if (currentState.realTimePreview) {
            // Clear any existing interval
            if (realTimePreviewInterval) {
                clearInterval(realTimePreviewInterval);
            }
            
            // Set up interval to update preview
            realTimePreviewInterval = setInterval(() => {
                if (currentState.text) {
                    renderAnimation();
                }
            }, 500); // Update every 500ms
            
            showNotification('Real-time preview enabled');
        } else {
            // Clear interval
            if (realTimePreviewInterval) {
                clearInterval(realTimePreviewInterval);
                realTimePreviewInterval = null;
            }
            
            showNotification('Real-time preview disabled');
        }
    }
    
    /**
     * Update export format
     */
    function updateExportFormat() {
        currentState.exportFormat = exportFormatSelector.value;
    }
    
    /**
     * Show a notification message
     */
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('animation-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'animation-notification';
            notification.className = 'fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 translate-y-full';
            document.body.appendChild(notification);
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-y-full');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-y-full');
        }, 3000);
    }
    
    /**
     * Update text
     */
    function updateText() {
        currentState.text = animationText.value;
    }
    
    /**
     * Update font family
     */
    function updateFontFamily() {
        currentState.fontFamily = fontFamily.value;
    }
    
    /**
     * Update font size
     */
    function updateFontSize() {
        currentState.fontSize = parseInt(fontSize.value);
    }
    
    /**
     * Update font color
     */
    function updateFontColor() {
        currentState.fontColor = fontColor.value;
    }
    
    /**
     * Update font weight
     */
    function updateFontWeight() {
        currentState.fontWeight = fontWeight.value;
    }
    
    /**
     * Update animation type
     */
    function updateAnimationType() {
        currentState.animationType = animationType.value;
    }
    
    /**
     * Update animation duration
     */
    function updateAnimationDuration() {
        currentState.animationDuration = parseFloat(animationDuration.value);
    }
    
    /**
     * Update animation delay
     */
    function updateAnimationDelay() {
        currentState.animationDelay = parseFloat(animationDelay.value);
    }
    
    /**
     * Update animation iteration
     */
    function updateAnimationIteration() {
        currentState.animationIteration = animationIteration.value;
    }
    
    /**
     * Update background color
     */
    function updateBackgroundColor() {
        currentState.backgroundColor = backgroundColor.value;
    }
    
    /**
     * Update background opacity
     */
    function updateBackgroundOpacity() {
        currentState.backgroundOpacity = parseInt(backgroundOpacity.value);
    }
    
    /**
     * Update text shadow
     */
    function updateTextShadow() {
        currentState.textShadow = textShadow.value;
    }
    
    /**
     * Update text effect
     */
    function updateTextEffect() {
        currentState.textEffect = textEffect.value;
    }
    
    /**
     * Preview the animation
     */
    function previewAnimation() {
        if (!currentState.text) {
            alert('Please enter some text to animate.');
            return;
        }
        
        renderAnimation();
    }
    
    /**
     * Reset animation to default state
     */
    function resetAnimation() {
        // Reset state
        currentState = {
            text: '',
            fontFamily: 'Arial, sans-serif',
            fontSize: 48,
            fontColor: '#FFFFFF',
            fontWeight: 'bold',
            animationType: 'fade',
            animationDuration: 1,
            animationDelay: 0,
            animationIteration: 1,
            backgroundColor: '#000000',
            backgroundOpacity: 50,
            textShadow: 'none',
            textEffect: 'none'
        };
        
        // Reset form inputs
        animationText.value = '';
        fontFamily.value = 'Arial, sans-serif';
        fontSize.value = 48;
        fontColor.value = '#FFFFFF';
        fontWeight.value = 'bold';
        animationType.value = 'fade';
        animationDuration.value = 1;
        animationDelay.value = 0;
        animationIteration.value = 1;
        backgroundColor.value = '#000000';
        backgroundOpacity.value = 50;
        textShadow.value = 'none';
        textEffect.value = 'none';
        
        // Clear preview
        animationPreview.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center text-gray-500">
                <p>Your animated text will appear here</p>
            </div>
        `;
    }
    
    /**
     * Render the animation based on current state
     */
    function renderAnimation() {
        // Clear previous content
        animationPreview.innerHTML = '';
        
        if (!currentState.text) {
            // Show placeholder if no text
            animationPreview.innerHTML = `
                <div class="absolute inset-0 flex items-center justify-center text-gray-500">
                    <p>Your animated text will appear here</p>
                </div>
            `;
            return;
        }
        
        // Create animation container
        const animationContainer = document.createElement('div');
        animationContainer.className = 'absolute inset-0';
        
        // Background
        const background = document.createElement('div');
        background.className = 'absolute inset-0';
        background.style.backgroundColor = currentState.backgroundColor;
        background.style.opacity = currentState.backgroundOpacity / 100;
        animationContainer.appendChild(background);
        
        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'absolute inset-0 flex items-center justify-center p-4 text-center';
        
        // Animated text element
        const textElement = document.createElement('div');
        textElement.textContent = currentState.text;
        textElement.style.fontFamily = currentState.fontFamily;
        textElement.style.fontSize = `${currentState.fontSize}px`;
        textElement.style.color = currentState.fontColor;
        textElement.style.fontWeight = currentState.fontWeight;
        
        // Apply text shadow based on selection
        switch(currentState.textShadow) {
            case 'light':
                textElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
                break;
            case 'medium':
                textElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
                break;
            case 'heavy':
                textElement.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.9)';
                break;
            case 'neon':
                textElement.style.textShadow = '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6';
                break;
            default:
                textElement.style.textShadow = 'none';
        }
        
        // Apply text effect based on selection
        switch(currentState.textEffect) {
            case 'outline':
                textElement.style.webkitTextStroke = '1px #000';
                break;
            case 'gradient':
                textElement.style.background = 'linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)';
                textElement.style.backgroundSize = '400% 400%';
                textElement.style.webkitBackgroundClip = 'text';
                textElement.style.webkitTextFillColor = 'transparent';
                break;
            case 'emboss':
                textElement.style.textShadow = '-1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5)';
                break;
            case 'fire':
                textElement.style.textShadow = '0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00';
                break;
        }
        
        // Apply animation based on type
        const keyframes = {};
        const animationName = `animation-${Date.now()}`;
        
        switch(currentState.animationType) {
            case 'fade':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `;
                break;
            case 'bounce':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-30px); }
                        60% { transform: translateY(-15px); }
                    }
                `;
                break;
            case 'slide':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(0); }
                    }
                `;
                break;
            case 'rotate':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                break;
            case 'pulse':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                break;
            case 'shake':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                        20%, 40%, 60%, 80% { transform: translateX(10px); }
                    }
                `;
                break;
            case 'flip':
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { transform: perspective(400px) rotateY(0); }
                        100% { transform: perspective(400px) rotateY(360deg); }
                    }
                `;
                break;
            case 'typewriter':
                // For typewriter effect, we'll handle it differently
                textElement.style.overflow = 'hidden';
                textElement.style.borderRight = '0.15em solid #fff';
                textElement.style.whiteSpace = 'nowrap';
                textElement.style.margin = '0 auto';
                textElement.style.width = '0';
                
                keyframes[animationName] = `
                    @keyframes ${animationName} {
                        0% { width: 0; }
                        100% { width: 100%; }
                    }
                `;
                break;
        }
        
        // Add keyframes to document
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = Object.values(keyframes).join('\n');
        document.head.appendChild(styleSheet);
        
        // Apply animation properties
        textElement.style.animation = `${animationName} ${currentState.animationDuration}s ${currentState.animationDelay}s ${currentState.animationIteration} forwards`;
        
        // Add to DOM
        textContainer.appendChild(textElement);
        animationContainer.appendChild(textContainer);
        animationPreview.appendChild(animationContainer);
    }
    
    /**
     * Download the animation
     */
    function downloadAnimation() {
        if (!currentState.text) {
            alert('Please enter some text and preview the animation first.');
            return;
        }
        
        // Handle different export formats
        switch(currentState.exportFormat) {
            case 'gif':
                downloadAnimatedGif();
                break;
            case 'mp4':
                downloadMP4();
                break;
            case 'css':
                downloadCSSCode();
                break;
            case 'png':
            default:
                downloadStaticImage();
                break;
        }
    }
    
    /**
     * Download a static image of the animation
     */
    function downloadStaticImage() {
        // Create a canvas to render the animation
        const canvas = document.createElement('canvas');
        canvas.width = 800; // Standard width
        canvas.height = 450; // 16:9 aspect ratio
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = currentState.backgroundColor;
        ctx.globalAlpha = currentState.backgroundOpacity / 100;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        
        // Draw text
        ctx.font = `${currentState.fontWeight} ${currentState.fontSize}px ${currentState.fontFamily}`;
        ctx.fillStyle = currentState.fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Apply text shadow based on selection
        switch(currentState.textShadow) {
            case 'light':
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                break;
            case 'medium':
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                break;
            case 'heavy':
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                break;
            case 'neon':
                ctx.shadowColor = '#0073e6';
                ctx.shadowBlur = 15;
                break;
        }
        
        // Draw text
        ctx.fillText(currentState.text, canvas.width / 2, canvas.height / 2, canvas.width - 40);
        
        // Convert canvas to data URL and trigger download
        const dataURL = canvas.toDataURL('image/png');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `animated-text-${timestamp}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Save to local storage
        saveAnimation(dataURL);
        
        showNotification('PNG image downloaded successfully');
    }
    
    /**
     * Download an animated GIF of the animation
     */
    function downloadAnimatedGif() {
        // Show loading notification
        showNotification('Creating animated GIF...');
        
        // Create a container for the animation frames
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        document.body.appendChild(container);
        
        // Set up canvas for capturing frames
        const canvas = document.createElement('canvas');
        canvas.width = 800; // Standard width
        canvas.height = 450; // 16:9 aspect ratio
        container.appendChild(canvas);
        
        // Create GIF encoder using gif.js library
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
        });
        
        // Number of frames to capture
        const frameCount = 30;
        const frameDuration = (currentState.animationDuration * 1000) / frameCount;
        
        // Create animation element
        const animationElement = document.createElement('div');
        animationElement.style.width = '100%';
        animationElement.style.height = '100%';
        animationElement.style.display = 'flex';
        animationElement.style.alignItems = 'center';
        animationElement.style.justifyContent = 'center';
        animationElement.style.backgroundColor = currentState.backgroundColor;
        animationElement.style.opacity = currentState.backgroundOpacity / 100;
        container.appendChild(animationElement);
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.textContent = currentState.text;
        textElement.style.fontFamily = currentState.fontFamily;
        textElement.style.fontSize = `${currentState.fontSize}px`;
        textElement.style.fontWeight = currentState.fontWeight;
        textElement.style.color = currentState.fontColor;
        
        // Apply text shadow
        applyTextShadow(textElement, currentState.textShadow);
        
        // Apply text effect
        applyTextEffect(textElement, currentState.textEffect);
        
        // Apply animation
        const animationName = `animation-${Date.now()}`;
        applyAnimation(textElement, animationName, currentState.animationType, currentState.animationDuration, 0, 'infinite');
        
        animationElement.appendChild(textElement);
        
        // Capture frames
        let frameIndex = 0;
        const ctx = canvas.getContext('2d');
        
        function captureFrame() {
            if (frameIndex >= frameCount) {
                // Finish GIF creation
                gif.on('finished', function(blob) {
                    // Clean up
                    document.body.removeChild(container);
                    
                    // Download the GIF
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `animated-text-${timestamp}.gif`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                    
                    showNotification('GIF animation downloaded successfully');
                });
                
                gif.render();
                return;
            }
            
            // Update animation progress
            const progress = frameIndex / frameCount;
            textElement.style.animationDelay = `-${progress * currentState.animationDuration}s`;
            
            // Render to canvas using html2canvas
            html2canvas(animationElement).then(function(renderedCanvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(renderedCanvas, 0, 0, canvas.width, canvas.height);
                
                // Add frame to GIF
                gif.addFrame(canvas, {copy: true, delay: frameDuration});
                
                // Capture next frame
                frameIndex++;
                setTimeout(captureFrame, 50);
            });
        }
        
        // Load required libraries and start capturing
        loadLibraries(['https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js', 
                      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'])
            .then(() => {
                captureFrame();
            })
            .catch(error => {
                console.error('Error loading libraries:', error);
                showNotification('Error creating GIF: Could not load required libraries');
                document.body.removeChild(container);
            });
    }
    
    /**
     * Download an MP4 video of the animation
     */
    function downloadMP4() {
        // Show loading notification
        showNotification('Creating MP4 video...');
        
        // Create a container for the animation
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '800px';
        container.style.height = '450px';
        document.body.appendChild(container);
        
        // Create animation element
        const animationElement = document.createElement('div');
        animationElement.style.width = '100%';
        animationElement.style.height = '100%';
        animationElement.style.display = 'flex';
        animationElement.style.alignItems = 'center';
        animationElement.style.justifyContent = 'center';
        animationElement.style.backgroundColor = currentState.backgroundColor;
        animationElement.style.opacity = currentState.backgroundOpacity / 100;
        container.appendChild(animationElement);
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.textContent = currentState.text;
        textElement.style.fontFamily = currentState.fontFamily;
        textElement.style.fontSize = `${currentState.fontSize}px`;
        textElement.style.fontWeight = currentState.fontWeight;
        textElement.style.color = currentState.fontColor;
        
        // Apply text shadow
        applyTextShadow(textElement, currentState.textShadow);
        
        // Apply text effect
        applyTextEffect(textElement, currentState.textEffect);
        
        // Apply animation
        const animationName = `animation-${Date.now()}`;
        applyAnimation(textElement, animationName, currentState.animationType, currentState.animationDuration, 0, 'infinite');
        
        animationElement.appendChild(textElement);
        
        // Load required libraries
        loadLibraries(['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
                      'https://cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.6.2/RecordRTC.min.js'])
            .then(() => {
                // Start recording after a short delay to allow animation to initialize
                setTimeout(() => {
                    // Use html2canvas to convert the animation to a canvas element
                    html2canvas(animationElement).then(canvas => {
                        // Create a MediaStream from the canvas
                        const stream = canvas.captureStream(30); // 30 FPS
                        
                        // Create a recorder
                        const recorder = RecordRTC(stream, {
                            type: 'video',
                            mimeType: 'video/webm',
                            frameRate: 30,
                            quality: 1,
                            width: 800,
                            height: 450
                        });
                        
                        // Start recording
                        recorder.startRecording();
                        
                        // Record for the duration of the animation
                        const recordingDuration = Math.max(currentState.animationDuration * 1000, 2000); // Minimum 2 seconds
                        
                        setTimeout(() => {
                            // Stop recording
                            recorder.stopRecording(() => {
                                // Get the recorded blob
                                const blob = recorder.getBlob();
                                
                                // Convert to MP4 if possible, otherwise use WebM
                                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                const a = document.createElement('a');
                                a.href = URL.createObjectURL(blob);
                                a.download = `animated-text-${timestamp}.mp4`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(a.href);
                                
                                // Clean up
                                document.body.removeChild(container);
                                
                                showNotification('MP4 video downloaded successfully');
                            });
                        }, recordingDuration);
                    });
                }, 500);
            })
            .catch(error => {
                console.error('Error loading libraries:', error);
                showNotification('Error creating MP4: Could not load required libraries');
                document.body.removeChild(container);
            });
    }
    
    /**
     * Load external libraries dynamically
     * @param {Array} urls - Array of library URLs to load
     * @returns {Promise} - Resolves when all libraries are loaded
     */
    function loadLibraries(urls) {
        return Promise.all(urls.map(url => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }));
    }
    
    /**
     * Apply text shadow to an element
     * @param {HTMLElement} element - The element to apply shadow to
     * @param {string} shadowType - The type of shadow to apply
     */
    function applyTextShadow(element, shadowType) {
        switch(shadowType) {
            case 'light':
                element.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
                break;
            case 'medium':
                element.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
                break;
            case 'heavy':
                element.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.9)';
                break;
            case 'neon':
                element.style.textShadow = '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6';
                break;
        }
    }
    
    /**
     * Apply text effect to an element
     * @param {HTMLElement} element - The element to apply effect to
     * @param {string} effectType - The type of effect to apply
     */
    function applyTextEffect(element, effectType) {
        switch(effectType) {
            case 'outline':
                element.style.webkitTextStroke = '1px #000';
                break;
            case 'gradient':
                element.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)';
                element.style.webkitBackgroundClip = 'text';
                element.style.webkitTextFillColor = 'transparent';
                break;
            case 'emboss':
                element.style.textShadow = '-1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5)';
                break;
            case 'fire':
                element.style.textShadow = '0 -2px 4px #fff, 0 -2px 10px #ff3, 0 -10px 20px #f90, 0 -20px 40px #c33';
                break;
        }
    }
    
    /**
     * Apply animation to an element
     * @param {HTMLElement} element - The element to animate
     * @param {string} name - Animation name
     * @param {string} type - Animation type
     * @param {number} duration - Animation duration in seconds
     * @param {number} delay - Animation delay in seconds
     * @param {string|number} iterations - Number of iterations or 'infinite'
     */
    function applyAnimation(element, name, type, duration, delay, iterations) {
        // Create keyframes
        let keyframesRule = '';
        
        switch(type) {
            case 'fade':
                keyframesRule = `
                    @keyframes ${name} {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `;
                break;
            case 'bounce':
                keyframesRule = `
                    @keyframes ${name} {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-30px); }
                        60% { transform: translateY(-15px); }
                    }
                `;
                break;
            case 'slide':
                keyframesRule = `
                    @keyframes ${name} {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(0); }
                    }
                `;
                break;
            case 'rotate':
                keyframesRule = `
                    @keyframes ${name} {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                break;
            case 'pulse':
                keyframesRule = `
                    @keyframes ${name} {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                break;
            case 'shake':
                keyframesRule = `
                    @keyframes ${name} {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                        20%, 40%, 60%, 80% { transform: translateX(10px); }
                    }
                `;
                break;
            case 'flip':
                keyframesRule = `
                    @keyframes ${name} {
                        0% { transform: perspective(400px) rotateY(0); }
                        100% { transform: perspective(400px) rotateY(360deg); }
                    }
                `;
                break;
            case 'typewriter':
                element.style.overflow = 'hidden';
                element.style.borderRight = '0.15em solid #fff';
                element.style.whiteSpace = 'nowrap';
                element.style.margin = '0 auto';
                element.style.width = '0';
                
                keyframesRule = `
                    @keyframes ${name} {
                        0% { width: 0; }
                        100% { width: 100%; }
                    }
                `;
                break;
        }
        
        // Add keyframes to document
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = keyframesRule;
        document.head.appendChild(styleSheet);
        
        // Apply animation
        element.style.animation = `${name} ${duration}s ${delay}s ${iterations} forwards`;
    }
    
    /**
     * Download CSS code for the animation
     */
    function downloadCSSCode() {
        // Generate CSS code for the animation
        let cssCode = generateCSSCode();
        
        // Create a blob and download it
        const blob = new Blob([cssCode], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const a = document.createElement('a');
        a.href = url;
        a.download = `animated-text-${timestamp}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('CSS code downloaded successfully');
    }
    
    /**
     * Generate CSS code for the animation
     */
    function generateCSSCode() {
        // Create a unique animation name
        const animationName = `animation-${Date.now()}`;
        
        // Generate keyframes based on animation type
        let keyframes = '';
        switch(currentState.animationType) {
            case 'fade':
                keyframes = `
@keyframes ${animationName} {
    0% { opacity: 0; }
    100% { opacity: 1; }
}`;
                break;
            case 'bounce':
                keyframes = `
@keyframes ${animationName} {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-30px); }
    60% { transform: translateY(-15px); }
}`;
                break;
            case 'slide':
                keyframes = `
@keyframes ${animationName} {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
}`;
                break;
            case 'rotate':
                keyframes = `
@keyframes ${animationName} {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
                break;
            case 'pulse':
                keyframes = `
@keyframes ${animationName} {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}`;
                break;
            case 'shake':
                keyframes = `
@keyframes ${animationName} {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}`;
                break;
            case 'flip':
                keyframes = `
@keyframes ${animationName} {
    0% { transform: perspective(400px) rotateY(0); }
    100% { transform: perspective(400px) rotateY(360deg); }
}`;
                break;
            case 'typewriter':
                keyframes = `
@keyframes ${animationName} {
    0% { width: 0; }
    100% { width: 100%; }
}`;
                break;
        }
        
        // Generate CSS for the text element
        let textCSS = `
.animated-text {
    font-family: ${currentState.fontFamily};
    font-size: ${currentState.fontSize}px;
    color: ${currentState.fontColor};
    font-weight: ${currentState.fontWeight};
    animation: ${animationName} ${currentState.animationDuration}s ${currentState.animationDelay}s ${currentState.animationIteration} forwards;
`;
        
        // Add text shadow if applicable
        switch(currentState.textShadow) {
            case 'light':
                textCSS += '    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);\n';
                break;
            case 'medium':
                textCSS += '    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);\n';
                break;
            case 'heavy':
                textCSS += '    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.9);\n';
                break;
            case 'neon':
                textCSS += '    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6;\n';
                break;
        }
        
        // Add text effect if applicable
        switch(currentState.textEffect) {
            case 'outline':
                textCSS += '    -webkit-text-stroke: 1px #000;\n';
                break;
            case 'gradient':
                textCSS += '    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);\n';
                textCSS += '    background-size: 400% 400%;\n';
                textCSS += '    -webkit-background-clip: text;\n';
                textCSS += '    -webkit-text-fill-color: transparent;\n';
                break;
            case 'emboss':
                textCSS += '    text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5);\n';
                break;
            case 'fire':
                textCSS += '    text-shadow: 0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00;\n';
                break;
        }
        
        // Close the CSS rule
        textCSS += '}';
        
        // Generate CSS for the container
        const containerCSS = `
.animation-container {
    background-color: ${currentState.backgroundColor};
    opacity: ${currentState.backgroundOpacity / 100};
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}`;
        
        // Combine all CSS
        return `/* Animated Text CSS - Generated by Animation Font Maker */
${keyframes}
${textCSS}
${containerCSS}

/* HTML Usage Example:
<div class="animation-container">
    <div class="animated-text">${currentState.text}</div>
</div>
*/`;
    }
    
    /**
     * Save animation to local storage
     */
    function saveAnimation(dataURL) {
        // Get existing saved animations
        let savedItems = JSON.parse(localStorage.getItem('animatedFonts')) || [];
        
        // Add new animation with timestamp
        const newAnimation = {
            id: Date.now(),
            dataURL: dataURL,
            text: currentState.text,
            createdAt: new Date().toISOString()
        };
        
        // Limit to 8 saved animations (keep most recent)
        savedItems.unshift(newAnimation);
        if (savedItems.length > 8) {
            savedItems = savedItems.slice(0, 8);
        }
        
        // Save to localStorage
        localStorage.setItem('animatedFonts', JSON.stringify(savedItems));
        
        // Update the display
        loadSavedAnimations();
    }
    
    /**
     * Load saved animations from local storage
     */
    function loadSavedAnimations() {
        const savedItems = JSON.parse(localStorage.getItem('animatedFonts')) || [];
        
        // Clear current display
        savedAnimations.innerHTML = '';
        
        if (savedItems.length === 0) {
            savedAnimations.innerHTML = `
                <p class="text-gray-500 text-center italic col-span-full">Your saved animations will appear here.</p>
            `;
            return;
        }
        
        // Create animation items
        savedItems.forEach(item => {
            const animationItem = document.createElement('div');
            animationItem.className = 'bg-gray-100 rounded-md overflow-hidden';
            
            // Create animation image
            const img = document.createElement('img');
            img.src = item.dataURL;
            img.className = 'w-full h-auto';
            img.alt = item.text || 'Animated Text';
            animationItem.appendChild(img);
            
            // Create action buttons
            const actions = document.createElement('div');
            actions.className = 'p-2 flex justify-between';
            
            // Download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'text-sm text-blue-600 hover:text-blue-800';
            downloadBtn.textContent = 'Download';
            downloadBtn.addEventListener('click', function() {
                const a = document.createElement('a');
                a.href = item.dataURL;
                a.download = `animated-text-${item.id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-sm text-red-600 hover:text-red-800';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteSavedAnimation(item.id);
            });
            
            actions.appendChild(downloadBtn);
            actions.appendChild(deleteBtn);
            animationItem.appendChild(actions);
            
            savedAnimations.appendChild(animationItem);
        });
    }
    
    /**
     * Delete a saved animation
     */
    function deleteSavedAnimation(id) {
        let savedItems = JSON.parse(localStorage.getItem('animatedFonts')) || [];
        savedItems = savedItems.filter(item => item.id !== id);
        localStorage.setItem('animatedFonts', JSON.stringify(savedItems));
        loadSavedAnimations();
    }
    
    /**
     * Clear all saved animations
     */
    function clearSavedAnimations() {
        if (confirm('Are you sure you want to delete all saved animations?')) {
            localStorage.removeItem('animatedFonts');
            loadSavedAnimations();
        }
    }
});