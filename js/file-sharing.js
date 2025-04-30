/**
 * File Sharing Tool - MultiTool Hub
 * Provides functionality for uploading, sharing, and managing files
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const fileList = document.getElementById('file-list');
    const noFilesMessage = document.getElementById('no-files-message');
    const fileLinkSection = document.getElementById('file-link-section');
    const shareLinkInput = document.getElementById('share-link');
    const copyLinkButton = document.getElementById('copy-link');
    const expirySelect = document.getElementById('expiry-time');
    const updateExpiryButton = document.getElementById('update-expiry');
    const deleteFileButton = document.getElementById('delete-file');
    
    // File storage (simulated in localStorage for demo purposes)
    let sharedFiles = JSON.parse(localStorage.getItem('sharedFiles')) || [];
    let currentFileId = null;
    
    // Initialize the UI
    initializeUI();
    
    // Event Listeners
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    fileInput.addEventListener('change', handleFileSelect);
    uploadButton.addEventListener('click', uploadFiles);
    copyLinkButton.addEventListener('click', copyShareLink);
    updateExpiryButton.addEventListener('click', updateFileExpiry);
    deleteFileButton.addEventListener('click', deleteCurrentFile);
    
    /**
     * Initialize the UI with stored files
     */
    function initializeUI() {
        renderFileList();
    }
    
    /**
     * Handle drag over event
     */
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('border-purple-500', 'bg-purple-50');
    }
    
    /**
     * Handle drag leave event
     */
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('border-purple-500', 'bg-purple-50');
    }
    
    /**
     * Handle file drop event
     */
    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('border-purple-500', 'bg-purple-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            uploadFiles();
        }
    }
    
    /**
     * Handle file selection from input
     */
    function handleFileSelect() {
        if (fileInput.files.length > 0) {
            uploadFiles();
        }
    }
    
    /**
     * Upload files (simulated)
     */
    function uploadFiles() {
        const files = fileInput.files;
        if (!files || files.length === 0) {
            showNotification('Please select files to upload', 'error');
            return;
        }
        
        // Show progress UI
        uploadProgress.classList.remove('hidden');
        uploadButton.disabled = true;
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finishUpload(files);
            }
            updateProgress(progress);
        }, 200);
    }
    
    /**
     * Update progress bar
     */
    function updateProgress(value) {
        const percentage = Math.min(Math.round(value), 100);
        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
    }
    
    /**
     * Finish upload process
     */
    function finishUpload(files) {
        // Process each file
        Array.from(files).forEach(file => {
            const fileId = generateUniqueId();
            const expiryHours = parseInt(expirySelect.value);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + expiryHours);
            
            const fileData = {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                expiryDate: expiryDate.toISOString(),
                downloads: 0,
                shareLink: generateShareLink(fileId)
            };
            
            sharedFiles.push(fileData);
            saveFiles();
        });
        
        // Reset UI
        uploadProgress.classList.add('hidden');
        uploadButton.disabled = false;
        fileInput.value = '';
        renderFileList();
        showNotification('Files uploaded successfully!', 'success');
    }
    
    /**
     * Generate a unique ID for files
     */
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Generate a share link for a file
     */
    function generateShareLink(fileId) {
        // In a real application, this would generate a proper URL
        return `https://multitoolhub.com/share/${fileId}`;
    }
    
    /**
     * Save files to storage
     */
    function saveFiles() {
        localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
    }
    
    /**
     * Render the file list
     */
    function renderFileList() {
        // Clean up expired files
        const now = new Date();
        sharedFiles = sharedFiles.filter(file => {
            return new Date(file.expiryDate) > now;
        });
        saveFiles();
        
        // Update UI
        if (sharedFiles.length === 0) {
            noFilesMessage.classList.remove('hidden');
            fileList.innerHTML = '';
            return;
        }
        
        noFilesMessage.classList.add('hidden');
        fileList.innerHTML = '';
        
        sharedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'py-4 flex items-center justify-between';
            fileItem.innerHTML = `
                <div class="flex items-center">
                    <div class="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-gray-800 font-medium">${file.name}</h3>
                        <p class="text-gray-500 text-sm">${formatFileSize(file.size)} • Expires ${formatExpiryDate(file.expiryDate)}</p>
                    </div>
                </div>
                <button class="view-file-btn text-purple-600 hover:text-purple-800 transition" data-file-id="${file.id}">
                    View Details
                </button>
            `;
            
            fileList.appendChild(fileItem);
            
            // Add event listener to the view button
            fileItem.querySelector('.view-file-btn').addEventListener('click', () => {
                showFileDetails(file.id);
            });
        });
    }
    
    /**
     * Show file details and share options
     */
    function showFileDetails(fileId) {
        const file = sharedFiles.find(f => f.id === fileId);
        if (!file) return;
        
        currentFileId = fileId;
        fileLinkSection.classList.remove('hidden');
        shareLinkInput.value = file.shareLink;
        
        // Set expiry select to match file's current expiry
        const expiryHours = Math.round((new Date(file.expiryDate) - new Date()) / (60 * 60 * 1000));
        if (expiryHours <= 1) expirySelect.value = '1';
        else if (expiryHours <= 24) expirySelect.value = '24';
        else if (expiryHours <= 72) expirySelect.value = '72';
        else if (expiryHours <= 168) expirySelect.value = '168';
        else expirySelect.value = '720';
        
        // Scroll to the file link section
        fileLinkSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Copy share link to clipboard
     */
    function copyShareLink() {
        shareLinkInput.select();
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    }
    
    /**
     * Update file expiry time
     */
    function updateFileExpiry() {
        if (!currentFileId) return;
        
        const fileIndex = sharedFiles.findIndex(f => f.id === currentFileId);
        if (fileIndex === -1) return;
        
        const expiryHours = parseInt(expirySelect.value);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + expiryHours);
        
        sharedFiles[fileIndex].expiryDate = expiryDate.toISOString();
        saveFiles();
        renderFileList();
        
        showNotification('Expiry time updated successfully!', 'success');
    }
    
    /**
     * Delete current file
     */
    function deleteCurrentFile() {
        if (!currentFileId) return;
        
        sharedFiles = sharedFiles.filter(f => f.id !== currentFileId);
        saveFiles();
        renderFileList();
        
        fileLinkSection.classList.add('hidden');
        currentFileId = null;
        
        showNotification('File deleted successfully!', 'success');
    }
    
    /**
     * Format file size for display
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Format expiry date for display
     */
    function formatExpiryDate(dateString) {
        const expiryDate = new Date(dateString);
        const now = new Date();
        
        const diffHours = Math.round((expiryDate - now) / (60 * 60 * 1000));
        
        if (diffHours < 1) return 'in less than an hour';
        if (diffHours === 1) return 'in 1 hour';
        if (diffHours < 24) return `in ${diffHours} hours`;
        if (diffHours < 48) return 'tomorrow';
        if (diffHours < 168) return `in ${Math.ceil(diffHours / 24)} days`;
        
        return expiryDate.toLocaleDateString();
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`;
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