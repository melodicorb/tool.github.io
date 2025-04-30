/**
 * Emoji Maker Tool
 * Allows users to create custom emojis by combining different facial features, colors, and accessories
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const emojiPreview = document.getElementById('emoji-preview');
    const baseShapeOptions = document.getElementById('base-shape-options');
    const eyesOptions = document.getElementById('eyes-options');
    const mouthOptions = document.getElementById('mouth-options');
    const accessoriesOptions = document.getElementById('accessories-options');
    const colorPicker = document.getElementById('emoji-color');
    const resetButton = document.getElementById('reset-emoji');
    const downloadButton = document.getElementById('download-emoji');
    const shareButton = document.getElementById('share-emoji');

    // State variables
    let currentEmoji = {
        baseShape: 'circle',
        color: '#FFDD67',
        eyes: 'normal',
        mouth: 'smile',
        accessories: null
    };

    // Base shapes data
    const baseShapes = [
        { id: 'circle', name: 'Circle', icon: '⭕' },
        { id: 'square', name: 'Square', icon: '🔲' },
        { id: 'rounded', name: 'Rounded', icon: '🔘' },
        { id: 'heart', name: 'Heart', icon: '❤️' }
    ];

    // Eyes data
    const eyes = [
        { id: 'normal', name: 'Normal', svg: '<circle cx="15" cy="15" r="3" fill="black"/><circle cx="35" cy="15" r="3" fill="black"/>' },
        { id: 'happy', name: 'Happy', svg: '<path d="M12,15 Q15,10 18,15" stroke="black" fill="none" stroke-width="2"/><path d="M32,15 Q35,10 38,15" stroke="black" fill="none" stroke-width="2"/>' },
        { id: 'wink', name: 'Wink', svg: '<circle cx="15" cy="15" r="3" fill="black"/><path d="M32,15 Q35,10 38,15" stroke="black" fill="none" stroke-width="2"/>' },
        { id: 'surprised', name: 'Surprised', svg: '<circle cx="15" cy="15" r="4" fill="black"/><circle cx="35" cy="15" r="4" fill="black"/>' },
        { id: 'angry', name: 'Angry', svg: '<path d="M12,12 L18,15" stroke="black" stroke-width="2"/><path d="M32,15 L38,12" stroke="black" stroke-width="2"/><circle cx="15" cy="18" r="2" fill="black"/><circle cx="35" cy="18" r="2" fill="black"/>' },
        { id: 'sleepy', name: 'Sleepy', svg: '<path d="M12,15 L18,15" stroke="black" stroke-width="2"/><path d="M32,15 L38,15" stroke="black" stroke-width="2"/>' },
        { id: 'hearts', name: 'Hearts', svg: '<path d="M15,15 l-2,-2 a2,2 0 1,0 -2,2 a2,2 0 1,0 2,2 z" fill="red"/><path d="M35,15 l-2,-2 a2,2 0 1,0 -2,2 a2,2 0 1,0 2,2 z" fill="red"/>' },
        { id: 'glasses', name: 'Glasses', svg: '<circle cx="15" cy="15" r="5" fill="none" stroke="black" stroke-width="1"/><circle cx="35" cy="15" r="5" fill="none" stroke="black" stroke-width="1"/><path d="M20,15 L30,15" stroke="black" stroke-width="1"/>' }
    ];

    // Mouths data
    const mouths = [
        { id: 'smile', name: 'Smile', svg: '<path d="M15,35 Q25,45 35,35" stroke="black" fill="none" stroke-width="2"/>' },
        { id: 'laugh', name: 'Laugh', svg: '<path d="M15,35 Q25,45 35,35" stroke="black" fill="black" stroke-width="2"/>' },
        { id: 'neutral', name: 'Neutral', svg: '<path d="M15,35 L35,35" stroke="black" stroke-width="2"/>' },
        { id: 'sad', name: 'Sad', svg: '<path d="M15,40 Q25,30 35,40" stroke="black" fill="none" stroke-width="2"/>' },
        { id: 'surprised', name: 'Surprised', svg: '<circle cx="25" cy="35" r="5" fill="none" stroke="black" stroke-width="2"/>' },
        { id: 'tongue', name: 'Tongue', svg: '<path d="M15,35 Q25,45 35,35" stroke="black" fill="none" stroke-width="2"/><path d="M22,38 Q25,45 28,38" fill="red"/>' },
        { id: 'teeth', name: 'Teeth', svg: '<path d="M15,35 Q25,45 35,35" stroke="black" fill="white" stroke-width="2"/><path d="M20,35 L20,40" stroke="black" stroke-width="1"/><path d="M25,35 L25,42" stroke="black" stroke-width="1"/><path d="M30,35 L30,40" stroke="black" stroke-width="1"/>' },
        { id: 'kiss', name: 'Kiss', svg: '<path d="M25,35 a3,5 0 1,0 0,1" fill="red"/>' }
    ];

    // Accessories data
    const accessories = [
        { id: null, name: 'None', icon: '❌' },
        { id: 'hat', name: 'Hat', svg: '<path d="M10,10 H40 L35,0 H15 Z" fill="#333"/>' },
        { id: 'crown', name: 'Crown', svg: '<path d="M10,10 L15,0 L25,5 L35,0 L40,10 Z" fill="gold"/>' },
        { id: 'horns', name: 'Horns', svg: '<path d="M10,10 L5,0 L15,5 Z" fill="red"/><path d="M40,10 L45,0 L35,5 Z" fill="red"/>' },
        { id: 'halo', name: 'Halo', svg: '<circle cx="25" cy="0" r="5" fill="none" stroke="gold" stroke-width="2"/>' },
        { id: 'bow', name: 'Bow', svg: '<path d="M20,0 H30 L25,5 Z" fill="pink"/><circle cx="25" cy="7" r="2" fill="pink"/>' },
        { id: 'mustache', name: 'Mustache', svg: '<path d="M15,30 Q25,40 35,30" stroke="black" fill="black" stroke-width="1"/>' },
        { id: 'beard', name: 'Beard', svg: '<path d="M15,35 Q25,50 35,35" stroke="black" fill="black" stroke-width="1"/>' },
        { id: 'glasses', name: 'Glasses', svg: '<circle cx="15" cy="15" r="5" fill="none" stroke="black" stroke-width="1"/><circle cx="35" cy="15" r="5" fill="none" stroke="black" stroke-width="1"/><path d="M20,15 L30,15" stroke="black" stroke-width="1"/>' },
        { id: 'sunglasses', name: 'Sunglasses', svg: '<rect x="10" y="12" width="10" height="6" rx="2" fill="#333"/><rect x="30" y="12" width="10" height="6" rx="2" fill="#333"/><path d="M20,15 L30,15" stroke="#333" stroke-width="1"/>' },
        { id: 'earrings', name: 'Earrings', svg: '<circle cx="5" cy="20" r="2" fill="gold"/><circle cx="45" cy="20" r="2" fill="gold"/>' },
        { id: 'bowtie', name: 'Bowtie', svg: '<path d="M20,45 L15,40 L20,35 L30,35 L35,40 L30,45 Z" fill="#ff5555"/>' }
    ];

    // Additional features - Filters and effects
    const filters = [
        { id: 'none', name: 'None', filter: '' },
        { id: 'sepia', name: 'Sepia', filter: 'sepia(0.8)' },
        { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(1)' },
        { id: 'invert', name: 'Invert', filter: 'invert(0.8)' },
        { id: 'blur', name: 'Blur', filter: 'blur(1px)' }
    ];

    // Animation effects
    const animations = [
        { id: 'none', name: 'None', animation: '' },
        { id: 'pulse', name: 'Pulse', animation: 'pulse 2s infinite' },
        { id: 'bounce', name: 'Bounce', animation: 'bounce 1s infinite' },
        { id: 'shake', name: 'Shake', animation: 'shake 0.5s infinite' },
        { id: 'spin', name: 'Spin', animation: 'spin 3s linear infinite' }
    ];

    // Add to current emoji state
    currentEmoji.filter = 'none';
    currentEmoji.animation = 'none';

    // Initialize the tool
    function init() {
        renderBaseShapeOptions();
        renderEyesOptions();
        renderMouthOptions();
        renderAccessoriesOptions();
        renderFiltersAndEffects();
        updateEmojiPreview();
        setupEventListeners();
        addAnimationStyles();
    }
    
    // Add animation keyframes to document
    function addAnimationStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Render filters and effects options
    function renderFiltersAndEffects() {
        // Create filters section
        const filtersSection = document.createElement('div');
        filtersSection.className = 'mb-4';
        filtersSection.innerHTML = `
            <label class="block text-sm font-medium text-gray-700 mb-1">Filters</label>
            <div class="grid grid-cols-4 gap-2" id="filter-options"></div>
        `;
        
        // Create animations section
        const animationsSection = document.createElement('div');
        animationsSection.className = 'mb-4';
        animationsSection.innerHTML = `
            <label class="block text-sm font-medium text-gray-700 mb-1">Animations</label>
            <div class="grid grid-cols-4 gap-2" id="animation-options"></div>
        `;
        
        // Insert before reset button
        resetButton.parentNode.insertBefore(filtersSection, resetButton);
        resetButton.parentNode.insertBefore(animationsSection, resetButton);
        
        const filterOptions = document.getElementById('filter-options');
        const animationOptions = document.getElementById('animation-options');
        
        // Populate filter options
        filters.forEach(filter => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.filter === filter.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            option.textContent = filter.name;
            option.dataset.id = filter.id;
            option.addEventListener('click', () => selectFilter(filter.id));
            filterOptions.appendChild(option);
        });
        
        // Populate animation options
        animations.forEach(animation => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.animation === animation.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            option.textContent = animation.name;
            option.dataset.id = animation.id;
            option.addEventListener('click', () => selectAnimation(animation.id));
            animationOptions.appendChild(option);
        });
    }
    
    // Select filter
    function selectFilter(id) {
        currentEmoji.filter = id;
        updateSelectedOption(document.getElementById('filter-options'), id);
        updateEmojiPreview();
    }
    
    // Select animation
    function selectAnimation(id) {
        currentEmoji.animation = id;
        updateSelectedOption(document.getElementById('animation-options'), id);
        updateEmojiPreview();
    }

    // Render base shape options
    function renderBaseShapeOptions() {
        baseShapes.forEach(shape => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.baseShape === shape.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            option.innerHTML = `<span class="text-xl">${shape.icon}</span>`;
            option.title = shape.name;
            option.dataset.id = shape.id;
            option.addEventListener('click', () => selectBaseShape(shape.id));
            baseShapeOptions.appendChild(option);
        });
    }

    // Render eyes options
    function renderEyesOptions() {
        eyes.forEach(eye => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.eyes === eye.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            option.innerHTML = `<svg width="30" height="20" viewBox="0 0 50 30">${eye.svg}</svg>`;
            option.title = eye.name;
            option.dataset.id = eye.id;
            option.addEventListener('click', () => selectEyes(eye.id));
            eyesOptions.appendChild(option);
        });
    }

    // Render mouth options
    function renderMouthOptions() {
        mouths.forEach(mouth => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.mouth === mouth.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            option.innerHTML = `<svg width="30" height="20" viewBox="0 0 50 50">${mouth.svg}</svg>`;
            option.title = mouth.name;
            option.dataset.id = mouth.id;
            option.addEventListener('click', () => selectMouth(mouth.id));
            mouthOptions.appendChild(option);
        });
    }

    // Render accessories options
    function renderAccessoriesOptions() {
        accessories.forEach(accessory => {
            const option = document.createElement('button');
            option.className = `p-2 border rounded hover:bg-gray-200 transition ${currentEmoji.accessories === accessory.id ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`;
            if (accessory.id === null) {
                option.innerHTML = `<span class="text-xl">${accessory.icon}</span>`;
            } else {
                option.innerHTML = `<svg width="30" height="20" viewBox="0 0 50 50">${accessory.svg}</svg>`;
            }
            option.title = accessory.name;
            option.dataset.id = accessory.id || 'none';
            option.addEventListener('click', () => selectAccessory(accessory.id));
            accessoriesOptions.appendChild(option);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        colorPicker.addEventListener('input', (e) => {
            currentEmoji.color = e.target.value;
            updateEmojiPreview();
        });

        resetButton.addEventListener('click', resetEmoji);
        downloadButton.addEventListener('click', downloadEmoji);
        shareButton.addEventListener('click', shareEmoji);
    }

    // Select base shape
    function selectBaseShape(id) {
        currentEmoji.baseShape = id;
        updateSelectedOption(baseShapeOptions, id);
        updateEmojiPreview();
    }

    // Select eyes
    function selectEyes(id) {
        currentEmoji.eyes = id;
        updateSelectedOption(eyesOptions, id);
        updateEmojiPreview();
    }

    // Select mouth
    function selectMouth(id) {
        currentEmoji.mouth = id;
        updateSelectedOption(mouthOptions, id);
        updateEmojiPreview();
    }

    // Select accessory
    function selectAccessory(id) {
        currentEmoji.accessories = id;
        updateSelectedOption(accessoriesOptions, id || 'none');
        updateEmojiPreview();
    }

    // Update selected option styling
    function updateSelectedOption(container, selectedId) {
        Array.from(container.children).forEach(option => {
            if (option.dataset.id === selectedId) {
                option.classList.add('bg-indigo-100', 'border-indigo-500');
                option.classList.remove('border-gray-300');
            } else {
                option.classList.remove('bg-indigo-100', 'border-indigo-500');
                option.classList.add('border-gray-300');
            }
        });
    }

    // Update emoji preview
    function updateEmojiPreview() {
        // Clear previous preview
        emojiPreview.innerHTML = '';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 50 50');
        
        // Apply selected filter if any
        if (currentEmoji.filter && currentEmoji.filter !== 'none') {
            const selectedFilter = filters.find(f => f.id === currentEmoji.filter);
            if (selectedFilter) {
                svg.style.filter = selectedFilter.filter;
            }
        }
        
        // Apply selected animation if any
        if (currentEmoji.animation && currentEmoji.animation !== 'none') {
            const selectedAnimation = animations.find(a => a.id === currentEmoji.animation);
            if (selectedAnimation) {
                svg.style.animation = selectedAnimation.animation;
            }
        }

        // Add base shape
        let baseShapePath;
        switch (currentEmoji.baseShape) {
            case 'circle':
                baseShapePath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                baseShapePath.setAttribute('cx', '25');
                baseShapePath.setAttribute('cy', '25');
                baseShapePath.setAttribute('r', '20');
                break;
            case 'square':
                baseShapePath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                baseShapePath.setAttribute('x', '5');
                baseShapePath.setAttribute('y', '5');
                baseShapePath.setAttribute('width', '40');
                baseShapePath.setAttribute('height', '40');
                break;
            case 'rounded':
                baseShapePath = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                baseShapePath.setAttribute('x', '5');
                baseShapePath.setAttribute('y', '5');
                baseShapePath.setAttribute('width', '40');
                baseShapePath.setAttribute('height', '40');
                baseShapePath.setAttribute('rx', '10');
                baseShapePath.setAttribute('ry', '10');
                break;
            case 'heart':
                baseShapePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                baseShapePath.setAttribute('d', 'M25,45 L10,30 A10,10 0 1,1 10,15 A10,10 0 0,1 25,15 A10,10 0 0,1 40,15 A10,10 0 1,1 40,30 Z');
                break;
        }
        baseShapePath.setAttribute('fill', currentEmoji.color);
        svg.appendChild(baseShapePath);

        // Add eyes
        const selectedEyes = eyes.find(eye => eye.id === currentEmoji.eyes);
        if (selectedEyes) {
            const eyesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            eyesGroup.innerHTML = selectedEyes.svg;
            svg.appendChild(eyesGroup);
        }

        // Add mouth
        const selectedMouth = mouths.find(mouth => mouth.id === currentEmoji.mouth);
        if (selectedMouth) {
            const mouthGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            mouthGroup.innerHTML = selectedMouth.svg;
            svg.appendChild(mouthGroup);
        }

        // Add accessory if selected
        if (currentEmoji.accessories) {
            const selectedAccessory = accessories.find(acc => acc.id === currentEmoji.accessories);
            if (selectedAccessory) {
                const accessoryGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                accessoryGroup.innerHTML = selectedAccessory.svg;
                svg.appendChild(accessoryGroup);
            }
        }

        emojiPreview.appendChild(svg);
    }

    // Reset emoji to default
    function resetEmoji() {
        currentEmoji = {
            baseShape: 'circle',
            color: '#FFDD67',
            eyes: 'normal',
            mouth: 'smile',
            accessories: null,
            filter: 'none',
            animation: 'none'
        };

        colorPicker.value = currentEmoji.color;
        updateSelectedOption(baseShapeOptions, currentEmoji.baseShape);
        updateSelectedOption(eyesOptions, currentEmoji.eyes);
        updateSelectedOption(mouthOptions, currentEmoji.mouth);
        updateSelectedOption(accessoriesOptions, 'none');
        
        // Reset filter and animation options if they exist
        const filterOptions = document.getElementById('filter-options');
        const animationOptions = document.getElementById('animation-options');
        
        if (filterOptions) updateSelectedOption(filterOptions, 'none');
        if (animationOptions) updateSelectedOption(animationOptions, 'none');
        
        updateEmojiPreview();
    }

    // Download emoji as PNG or GIF based on animation selection
    function downloadEmoji() {
        // Check if animation is selected
        if (currentEmoji.animation !== 'none') {
            // Create a script element to load gif.js if not already loaded
            if (typeof GIF === 'undefined') {
                const gifScript = document.createElement('script');
                gifScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js';
                gifScript.onload = createAnimatedGif;
                document.head.appendChild(gifScript);
            } else {
                createAnimatedGif();
            }
        } else {
            // For static emojis, use PNG format
            downloadStaticEmoji();
        }
    }
    
    // Download static emoji as PNG
    function downloadStaticEmoji() {
        const svgData = new XMLSerializer().serializeToString(emojiPreview.querySelector('svg'));
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0, 256, 256);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'custom-emoji.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
    
    // Create and download animated GIF
    function createAnimatedGif() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Creating animated emoji...';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '10px 20px';
        loadingIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.zIndex = '9999';
        document.body.appendChild(loadingIndicator);
        
        // Create GIF using gif.js
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 256,
            height: 256,
            workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
        });
        
        // Get animation properties
        const selectedAnimation = animations.find(a => a.id === currentEmoji.animation);
        const animationName = selectedAnimation.animation.split(' ')[0];
        const frames = 20; // Number of frames to capture
        
        // Create a container for the animated emoji
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
        
        // Function to capture frames
        const captureFrames = (frameCount) => {
            if (frameCount >= frames) {
                // All frames captured, finish GIF
                document.body.removeChild(container);
                
                gif.on('finished', function(blob) {
                    // Remove loading indicator
                    document.body.removeChild(loadingIndicator);
                    
                    // Create download link
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'animated-emoji.gif';
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.click();
                });
                
                gif.render();
                return;
            }
            
            // Create a copy of the SVG for this frame
            const svgData = new XMLSerializer().serializeToString(emojiPreview.querySelector('svg'));
            const svgCopy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgCopy.setAttribute('width', '256');
            svgCopy.setAttribute('height', '256');
            svgCopy.setAttribute('viewBox', '0 0 50 50');
            svgCopy.innerHTML = emojiPreview.querySelector('svg').innerHTML;
            
            // Apply animation frame
            const progress = frameCount / frames;
            switch (animationName) {
                case 'pulse':
                    const scale = 1 + 0.1 * Math.sin(progress * Math.PI * 2);
                    svgCopy.style.transform = `scale(${scale})`;
                    break;
                case 'bounce':
                    const yOffset = -10 * Math.sin(progress * Math.PI * 2);
                    svgCopy.style.transform = `translateY(${yOffset}px)`;
                    break;
                case 'shake':
                    const xOffset = 5 * Math.sin(progress * Math.PI * 4);
                    svgCopy.style.transform = `translateX(${xOffset}px)`;
                    break;
                case 'spin':
                    const rotation = progress * 360;
                    svgCopy.style.transform = `rotate(${rotation}deg)`;
                    break;
            }
            
            container.innerHTML = '';
            container.appendChild(svgCopy);
            
            // Convert SVG to canvas
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 256, 256);
                gif.addFrame(canvas, { delay: 50, copy: true });
                
                // Capture next frame
                setTimeout(() => captureFrames(frameCount + 1), 10);
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgCopy.outerHTML)));
        };
        
        // Start capturing frames
        captureFrames(0);
    }

    // Share emoji with enhanced implementation
    function shareEmoji() {
        if (navigator.share) {
            // Convert SVG to PNG for better compatibility
            const svgData = new XMLSerializer().serializeToString(emojiPreview.querySelector('svg'));
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 256, 256);
                canvas.toBlob(blob => {
                    const file = new File([blob], 'custom-emoji.png', {type: 'image/png'});
                    
                    navigator.share({
                        title: 'My Custom Emoji',
                        text: 'Check out this emoji I created with MultiTool Hub!',
                        files: [file]
                    }).catch(error => {
                        // Fallback to sharing without file if that's the issue
                        navigator.share({
                            title: 'My Custom Emoji',
                            text: 'Check out this emoji I created with MultiTool Hub!',
                            url: window.location.href
                        }).catch(err => {
                            alert('Error sharing: ' + err);
                        });
                    });
                }, 'image/png');
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } else {
            // Fallback for browsers without Web Share API
            // Create a temporary input to copy a share message to clipboard
            const tempInput = document.createElement('input');
            tempInput.value = 'Check out this emoji I created with MultiTool Hub! ' + window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            alert('Share link copied to clipboard! You can paste it in your social media or messaging apps.');
        }
    }

    // Initialize the tool
    init();
});

// Add 3D icon animation for the tool icon
document.addEventListener('DOMContentLoaded', () => {
    const iconContainer = document.querySelector('.tool-icon');
    if (!iconContainer) return;

    // Create a scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(80, 80);
    renderer.setClearColor(0x000000, 0);
    
    // Replace the SVG icon with the 3D canvas
    iconContainer.innerHTML = '';
    iconContainer.appendChild(renderer.domElement);

    // Create a sphere geometry for the emoji base
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFDD67 });
    const emoji = new THREE.Mesh(geometry, material);
    scene.add(emoji);

    // Add eyes (black spheres)
    const eyeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.8, 0.5, 1.8);
    emoji.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.8, 0.5, 1.8);
    emoji.add(rightEye);

    // Add smile (curved line)
    const smileGeometry = new THREE.TorusGeometry(1, 0.1, 16, 32, Math.PI);
    const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const smile = new THREE.Mesh(smileGeometry, smileMaterial);
    smile.position.set(0, -0.5, 1.8);
    smile.rotation.x = Math.PI;
    emoji.add(smile);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        emoji.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
});