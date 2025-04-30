/**
 * YouTube Thumbnail Maker - MultiTool Hub
 * Provides functionality to create custom YouTube thumbnails with text overlays and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Controls
    const uploadImageBtn = document.getElementById('upload-image');
    const useTemplateBtn = document.getElementById('use-template');
    const imageInput = document.getElementById('image-input');
    const templateSelection = document.getElementById('template-selection');
    const templateItems = document.querySelectorAll('.template-item');
    const headlineText = document.getElementById('headline-text');
    const subtitleText = document.getElementById('subtitle-text');
    const headlineFont = document.getElementById('headline-font');
    const headlineColor = document.getElementById('headline-color');
    const subtitleFont = document.getElementById('subtitle-font');
    const subtitleColor = document.getElementById('subtitle-color');
    const overlayColor = document.getElementById('overlay-color');
    const overlayOpacity = document.getElementById('overlay-opacity');
    const resetBtn = document.getElementById('reset-thumbnail');
    const downloadBtn = document.getElementById('download-thumbnail');
    
    // DOM Elements - Preview
    const thumbnailPreview = document.getElementById('thumbnail-preview');
    
    // DOM Elements - Saved Thumbnails
    const savedThumbnails = document.getElementById('saved-thumbnails');
    const clearSavedBtn = document.getElementById('clear-saved');
    
    // Thumbnail state
    let currentState = {
        backgroundImage: null,
        backgroundType: null, // 'upload' or 'template'
        templateName: null,
        headline: '',
        subtitle: '',
        headlineFont: 'Arial, sans-serif',
        headlineColor: '#FFFFFF',
        subtitleFont: 'Arial, sans-serif',
        subtitleColor: '#FFFFFF',
        overlayColor: '#000000',
        overlayOpacity: 30
    };
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the YouTube Thumbnail Maker Tool
     */
    function init() {
        // Set up event listeners
        uploadImageBtn.addEventListener('click', triggerImageUpload);
        useTemplateBtn.addEventListener('click', toggleTemplateSelection);
        imageInput.addEventListener('change', handleImageUpload);
        
        // Template selection
        templateItems.forEach(item => {
            item.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                selectTemplate(template);
            });
        });
        
        // Text and styling inputs
        headlineText.addEventListener('input', updateHeadline);
        subtitleText.addEventListener('input', updateSubtitle);
        headlineFont.addEventListener('change', updateHeadlineFont);
        headlineColor.addEventListener('input', updateHeadlineColor);
        subtitleFont.addEventListener('change', updateSubtitleFont);
        subtitleColor.addEventListener('input', updateSubtitleColor);
        
        // Effects
        overlayColor.addEventListener('input', updateOverlayColor);
        overlayOpacity.addEventListener('input', updateOverlayOpacity);
        
        // Action buttons
        resetBtn.addEventListener('click', resetThumbnail);
        downloadBtn.addEventListener('click', downloadThumbnail);
        clearSavedBtn.addEventListener('click', clearSavedThumbnails);
        
        // Load saved thumbnails
        loadSavedThumbnails();
    }
    
    /**
     * Trigger image upload dialog
     */
    function triggerImageUpload() {
        imageInput.click();
    }
    
    /**
     * Toggle template selection visibility
     */
    function toggleTemplateSelection() {
        if (templateSelection.classList.contains('hidden')) {
            templateSelection.classList.remove('hidden');
        } else {
            templateSelection.classList.add('hidden');
        }
    }
    
    /**
     * Handle image upload
     */
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentState.backgroundImage = event.target.result;
                currentState.backgroundType = 'upload';
                currentState.templateName = null;
                renderThumbnail();
                
                // Hide template selection if visible
                templateSelection.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    }
    
    /**
     * Select a template
     */
    function selectTemplate(template) {
        // In a real implementation, you would have actual template images
        // For this example, we'll use placeholder paths
        const templatePath = `../assets/templates/${template}-thumbnail.jpg`;
        
        // Update state
        currentState.backgroundImage = templatePath;
        currentState.backgroundType = 'template';
        currentState.templateName = template;
        
        // Render the updated thumbnail
        renderThumbnail();
        
        // Hide template selection
        templateSelection.classList.add('hidden');
    }
    
    /**
     * Update headline text
     */
    function updateHeadline() {
        currentState.headline = headlineText.value;
        renderThumbnail();
    }
    
    /**
     * Update subtitle text
     */
    function updateSubtitle() {
        currentState.subtitle = subtitleText.value;
        renderThumbnail();
    }
    
    /**
     * Update headline font
     */
    function updateHeadlineFont() {
        currentState.headlineFont = headlineFont.value;
        renderThumbnail();
    }
    
    /**
     * Update headline color
     */
    function updateHeadlineColor() {
        currentState.headlineColor = headlineColor.value;
        renderThumbnail();
    }
    
    /**
     * Update subtitle font
     */
    function updateSubtitleFont() {
        currentState.subtitleFont = subtitleFont.value;
        renderThumbnail();
    }
    
    /**
     * Update subtitle color
     */
    function updateSubtitleColor() {
        currentState.subtitleColor = subtitleColor.value;
        renderThumbnail();
    }
    
    /**
     * Update overlay color
     */
    function updateOverlayColor() {
        currentState.overlayColor = overlayColor.value;
        renderThumbnail();
    }
    
    /**
     * Update overlay opacity
     */
    function updateOverlayOpacity() {
        currentState.overlayOpacity = overlayOpacity.value;
        renderThumbnail();
    }
    
    /**
     * Reset thumbnail to default state
     */
    function resetThumbnail() {
        // Reset state
        currentState = {
            backgroundImage: null,
            backgroundType: null,
            templateName: null,
            headline: '',
            subtitle: '',
            headlineFont: 'Arial, sans-serif',
            headlineColor: '#FFFFFF',
            subtitleFont: 'Arial, sans-serif',
            subtitleColor: '#FFFFFF',
            overlayColor: '#000000',
            overlayOpacity: 30
        };
        
        // Reset form inputs
        headlineText.value = '';
        subtitleText.value = '';
        headlineFont.value = 'Arial, sans-serif';
        headlineColor.value = '#FFFFFF';
        subtitleFont.value = 'Arial, sans-serif';
        subtitleColor.value = '#FFFFFF';
        overlayColor.value = '#000000';
        overlayOpacity.value = 30;
        
        // Clear file input
        imageInput.value = '';
        
        // Render empty thumbnail
        renderThumbnail();
    }
    
    /**
     * Render the thumbnail based on current state
     */
    function renderThumbnail() {
        // Clear previous content
        thumbnailPreview.innerHTML = '';
        
        if (!currentState.backgroundImage) {
            // Show placeholder if no background image
            thumbnailPreview.innerHTML = `
                <div class="absolute inset-0 flex items-center justify-center text-gray-500">
                    <p>Upload an image or select a template to start</p>
                </div>
            `;
            return;
        }
        
        // Create thumbnail elements
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'absolute inset-0';
        
        // Background image
        const backgroundImg = document.createElement('img');
        backgroundImg.src = currentState.backgroundImage;
        backgroundImg.className = 'w-full h-full object-cover';
        thumbnailContainer.appendChild(backgroundImg);
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0';
        overlay.style.backgroundColor = currentState.overlayColor;
        overlay.style.opacity = currentState.overlayOpacity / 100;
        thumbnailContainer.appendChild(overlay);
        
        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'absolute inset-0 flex flex-col items-center justify-center p-4 text-center';
        
        // Headline
        if (currentState.headline) {
            const headline = document.createElement('h2');
            headline.textContent = currentState.headline;
            headline.className = 'text-3xl md:text-4xl font-bold mb-2 px-2 py-1';
            headline.style.fontFamily = currentState.headlineFont;
            headline.style.color = currentState.headlineColor;
            headline.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            textContainer.appendChild(headline);
        }
        
        // Subtitle
        if (currentState.subtitle) {
            const subtitle = document.createElement('p');
            subtitle.textContent = currentState.subtitle;
            subtitle.className = 'text-xl md:text-2xl px-2 py-1';
            subtitle.style.fontFamily = currentState.subtitleFont;
            subtitle.style.color = currentState.subtitleColor;
            subtitle.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 0.8)';
            textContainer.appendChild(subtitle);
        }
        
        thumbnailContainer.appendChild(textContainer);
        thumbnailPreview.appendChild(thumbnailContainer);
    }
    
    /**
     * Download the thumbnail
     */
    function downloadThumbnail() {
        if (!currentState.backgroundImage) {
            alert('Please add a background image or select a template first.');
            return;
        }
        
        // Create a canvas to render the thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = 1280; // YouTube thumbnail width
        canvas.height = 720; // YouTube thumbnail height
        const ctx = canvas.getContext('2d');
        
        // Create an image for the background
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle CORS for template images
        
        img.onload = function() {
            // Draw background image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Draw overlay
            ctx.fillStyle = currentState.overlayColor;
            ctx.globalAlpha = currentState.overlayOpacity / 100;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
            
            // Draw headline
            if (currentState.headline) {
                ctx.font = `bold 60px ${currentState.headlineFont}`;
                ctx.fillStyle = currentState.headlineColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.fillText(currentState.headline, canvas.width / 2, canvas.height / 2 - 40, canvas.width - 40);
            }
            
            // Draw subtitle
            if (currentState.subtitle) {
                ctx.font = `40px ${currentState.subtitleFont}`;
                ctx.fillStyle = currentState.subtitleColor;
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillText(currentState.subtitle, canvas.width / 2, canvas.height / 2 + 40, canvas.width - 60);
            }
            
            // Convert canvas to data URL and trigger download
            const dataURL = canvas.toDataURL('image/png');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = `youtube-thumbnail-${timestamp}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Save to local storage
            saveThumbnail(dataURL);
        };
        
        img.onerror = function() {
            alert('Error loading image. Please try again with a different image.');
        };
        
        img.src = currentState.backgroundImage;
    }
    
    /**
     * Save thumbnail to local storage
     */
    function saveThumbnail(dataURL) {
        // Get existing saved thumbnails
        let savedItems = JSON.parse(localStorage.getItem('youtubeThumbnails')) || [];
        
        // Add new thumbnail with timestamp
        const newThumbnail = {
            id: Date.now(),
            dataURL: dataURL,
            headline: currentState.headline,
            createdAt: new Date().toISOString()
        };
        
        // Limit to 8 saved thumbnails (keep most recent)
        savedItems.unshift(newThumbnail);
        if (savedItems.length > 8) {
            savedItems = savedItems.slice(0, 8);
        }
        
        // Save to localStorage
        localStorage.setItem('youtubeThumbnails', JSON.stringify(savedItems));
        
        // Update the display
        loadSavedThumbnails();
    }
    
    /**
     * Load saved thumbnails from local storage
     */
    function loadSavedThumbnails() {
        const savedItems = JSON.parse(localStorage.getItem('youtubeThumbnails')) || [];
        
        // Clear current display
        savedThumbnails.innerHTML = '';
        
        if (savedItems.length === 0) {
            savedThumbnails.innerHTML = `
                <p class="text-gray-500 text-center italic col-span-full">Your saved thumbnails will appear here.</p>
            `;
            return;
        }
        
        // Create thumbnail items
        savedItems.forEach(item => {
            const thumbnailItem = document.createElement('div');
            thumbnailItem.className = 'bg-gray-100 rounded-md overflow-hidden';
            
            // Create thumbnail image
            const img = document.createElement('img');
            img.src = item.dataURL;
            img.className = 'w-full h-auto';
            img.alt = item.headline || 'YouTube Thumbnail';
            thumbnailItem.appendChild(img);
            
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
                a.download = `youtube-thumbnail-${item.id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-sm text-red-600 hover:text-red-800';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteSavedThumbnail(item.id);
            });
            
            actions.appendChild(downloadBtn);
            actions.appendChild(deleteBtn);
            thumbnailItem.appendChild(actions);
            
            savedThumbnails.appendChild(thumbnailItem);
        });
    }
    
    /**
     * Delete a saved thumbnail
     */
    function deleteSavedThumbnail(id) {
        let savedItems = JSON.parse(localStorage.getItem('youtubeThumbnails')) || [];
        savedItems = savedItems.filter(item => item.id !== id);
        localStorage.setItem('youtubeThumbnails', JSON.stringify(savedItems));
        loadSavedThumbnails();
    }
    
    /**
     * Clear all saved thumbnails
     */
    function clearSavedThumbnails() {
        if (confirm('Are you sure you want to delete all saved thumbnails?')) {
            localStorage.removeItem('youtubeThumbnails');
            loadSavedThumbnails();
        }
    }
});