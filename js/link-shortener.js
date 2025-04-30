/**
 * Link Shortener Tool - MultiTool Hub
 * Provides functionality for shortening URLs, generating QR codes, and managing shortened links
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const longUrlInput = document.getElementById('long-url');
    const customAliasInput = document.getElementById('custom-alias');
    const expirySelect = document.getElementById('expiry-time');
    const shortenButton = document.getElementById('shorten-button');
    const resultSection = document.getElementById('result-section');
    const shortUrlInput = document.getElementById('short-url');
    const copyButton = document.getElementById('copy-button');
    const previewLink = document.getElementById('preview-link');
    const qrButton = document.getElementById('qr-button');
    const qrSection = document.getElementById('qr-section');
    const qrCode = document.getElementById('qr-code');
    const closeQrButton = document.getElementById('close-qr');
    const downloadQrButton = document.getElementById('download-qr');
    const linksData = document.getElementById('links-data');
    const noLinksMessage = document.getElementById('no-links-message');
    
    // Link storage (simulated in localStorage for demo purposes)
    let shortenedLinks = JSON.parse(localStorage.getItem('shortenedLinks')) || [];
    let currentQrUrl = null;
    
    // Initialize the UI
    initializeUI();
    
    // Event Listeners
    shortenButton.addEventListener('click', shortenUrl);
    copyButton.addEventListener('click', copyToClipboard);
    qrButton.addEventListener('click', showQrCode);
    closeQrButton.addEventListener('click', hideQrCode);
    downloadQrButton.addEventListener('click', downloadQrCode);
    
    /**
     * Initialize the UI with stored links
     */
    function initializeUI() {
        renderLinksTable();
    }
    
    /**
     * Shorten URL
     */
    function shortenUrl() {
        const longUrl = longUrlInput.value.trim();
        const customAlias = customAliasInput.value.trim();
        const expiryValue = expirySelect.value;
        
        // Validate URL
        if (!longUrl) {
            showNotification('Please enter a URL to shorten', 'error');
            return;
        }
        
        if (!isValidUrl(longUrl)) {
            showNotification('Please enter a valid URL including http:// or https://', 'error');
            return;
        }
        
        // Generate a unique ID or use custom alias
        const linkId = customAlias || generateUniqueId();
        
        // Check if custom alias is already in use
        if (customAlias && shortenedLinks.some(link => link.id === customAlias)) {
            showNotification('This custom alias is already in use. Please choose another.', 'error');
            return;
        }
        
        // Calculate expiry date
        let expiryDate = null;
        if (expiryValue !== 'never') {
            expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + parseInt(expiryValue));
        }
        
        // Create shortened link object
        const shortLink = {
            id: linkId,
            originalUrl: longUrl,
            shortUrl: generateShortUrl(linkId),
            createdAt: new Date().toISOString(),
            expiryDate: expiryDate ? expiryDate.toISOString() : null,
            clicks: 0
        };
        
        // Add to storage
        shortenedLinks.push(shortLink);
        saveLinks();
        
        // Update UI
        showResult(shortLink);
        renderLinksTable();
        
        // Reset custom alias input
        customAliasInput.value = '';
        
        showNotification('URL shortened successfully!', 'success');
    }
    
    /**
     * Show the shortened URL result
     */
    function showResult(linkData) {
        shortUrlInput.value = linkData.shortUrl;
        previewLink.href = linkData.originalUrl;
        resultSection.classList.remove('hidden');
    }
    
    /**
     * Copy shortened URL to clipboard
     */
    function copyToClipboard() {
        shortUrlInput.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    }
    
    /**
     * Show QR code for the shortened URL
     */
    function showQrCode() {
        const url = shortUrlInput.value;
        if (!url) return;
        
        currentQrUrl = url;
        
        // In a real implementation, we would use a QR code library like qrcode.js
        // For this demo, we'll simulate it with a placeholder
        qrCode.innerHTML = `
            <div class="text-center">
                <svg class="w-32 h-32 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" fill="white" stroke="black" stroke-width="2"/>
                    <rect x="20" y="20" width="20" height="20" fill="black"/>
                    <rect x="60" y="20" width="20" height="20" fill="black"/>
                    <rect x="20" y="60" width="20" height="20" fill="black"/>
                    <rect x="45" y="45" width="10" height="10" fill="black"/>
                    <rect x="60" y="60" width="5" height="5" fill="black"/>
                    <rect x="70" y="60" width="5" height="5" fill="black"/>
                    <rect x="60" y="70" width="5" height="5" fill="black"/>
                    <rect x="70" y="70" width="5" height="5" fill="black"/>
                </svg>
                <p class="mt-2 text-sm text-gray-600">QR Code for: ${url}</p>
            </div>
        `;
        
        qrSection.classList.remove('hidden');
    }
    
    /**
     * Hide QR code section
     */
    function hideQrCode() {
        qrSection.classList.add('hidden');
        currentQrUrl = null;
    }
    
    /**
     * Download QR code as image
     */
    function downloadQrCode() {
        if (!currentQrUrl) return;
        
        // In a real implementation, we would convert the QR code to an image and download it
        // For this demo, we'll show a notification
        showNotification('QR Code download functionality would be implemented here', 'info');
    }
    
    /**
     * Render the links table
     */
    function renderLinksTable() {
        // Clean up expired links
        const now = new Date();
        shortenedLinks = shortenedLinks.filter(link => {
            return !link.expiryDate || new Date(link.expiryDate) > now;
        });
        saveLinks();
        
        // Update UI
        if (shortenedLinks.length === 0) {
            noLinksMessage.classList.remove('hidden');
            return;
        }
        
        noLinksMessage.classList.add('hidden');
        
        // Clear existing rows except the no-links-message
        const rows = linksData.querySelectorAll('tr:not(#no-links-message)');
        rows.forEach(row => row.remove());
        
        // Add link rows
        shortenedLinks.forEach(link => {
            const row = document.createElement('tr');
            
            // Truncate long URLs for display
            const displayUrl = link.originalUrl.length > 40 ? 
                link.originalUrl.substring(0, 40) + '...' : 
                link.originalUrl;
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 truncate max-w-xs" title="${link.originalUrl}">${displayUrl}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <a href="${link.shortUrl}" target="_blank" class="text-blue-600 hover:text-blue-900 text-sm">${link.shortUrl}</a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${formatDate(link.createdAt)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${link.expiryDate ? formatDate(link.expiryDate) : 'Never'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${link.clicks}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-blue-600 hover:text-blue-900 mr-3 copy-link" data-url="${link.shortUrl}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-900 delete-link" data-id="${link.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;
            
            linksData.appendChild(row);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.copy-link').forEach(button => {
            button.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                navigator.clipboard.writeText(url).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                });
            });
        });
        
        document.querySelectorAll('.delete-link').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteLink(id);
            });
        });
    }
    
    /**
     * Delete a link by ID
     */
    function deleteLink(id) {
        if (confirm('Are you sure you want to delete this shortened link?')) {
            shortenedLinks = shortenedLinks.filter(link => link.id !== id);
            saveLinks();
            renderLinksTable();
            showNotification('Link deleted successfully!', 'success');
        }
    }
    
    /**
     * Save links to storage
     */
    function saveLinks() {
        localStorage.setItem('shortenedLinks', JSON.stringify(shortenedLinks));
    }
    
    /**
     * Generate a unique ID for links
     */
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Generate a short URL from an ID
     */
    function generateShortUrl(id) {
        // In a real application, this would generate a proper URL
        return `https://multitoolhub.com/s/${id}`;
    }
    
    /**
     * Validate URL format
     */
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Format date for display
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});