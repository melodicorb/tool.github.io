/**
 * Notepad Tool - JavaScript functionality
 * Part of MultiTool Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const notepad = document.getElementById('notepad');
    const btnNew = document.getElementById('btn-new');
    const btnDownload = document.getElementById('btn-download');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');
    const btnUnderline = document.getElementById('btn-underline');
    const fontSizeSelect = document.getElementById('font-size');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');
    const autoSaveIndicator = document.getElementById('auto-save-indicator');
    
    // Local Storage Keys
    const STORAGE_KEY = 'multitool_notepad_content';
    const NOTES_HISTORY_KEY = 'multitool_notepad_history';
    
    // Initialize
    loadSavedContent();
    updateCounters();
    hideAutoSaveIndicator();
    
    // Event Listeners
    notepad.addEventListener('input', function() {
        updateCounters();
        saveContent();
        showAutoSaveIndicator();
    });
    
    btnNew.addEventListener('click', createNewNote);
    btnDownload.addEventListener('click', downloadNote);
    btnCopy.addEventListener('click', copyToClipboard);
    btnClear.addEventListener('click', clearNotepad);
    
    // Formatting buttons
    btnBold.addEventListener('click', function() { formatText('bold'); });
    btnItalic.addEventListener('click', function() { formatText('italic'); });
    btnUnderline.addEventListener('click', function() { formatText('underline'); });
    
    // Font size change
    fontSizeSelect.addEventListener('change', function() {
        notepad.style.fontSize = this.value;
    });
    
    // Functions
    
    /**
     * Load saved content from local storage
     */
    function loadSavedContent() {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
            notepad.value = savedContent;
        }
    }
    
    /**
     * Save content to local storage
     */
    function saveContent() {
        localStorage.setItem(STORAGE_KEY, notepad.value);
    }
    
    /**
     * Update character and word counters
     */
    function updateCounters() {
        const text = notepad.value;
        charCount.textContent = text.length;
        
        // Count words (split by whitespace and filter out empty strings)
        const words = text.split(/\s+/).filter(word => word.length > 0);
        wordCount.textContent = words.length;
    }
    
    /**
     * Show auto-save indicator and hide after delay
     */
    function showAutoSaveIndicator() {
        autoSaveIndicator.style.display = 'block';
        setTimeout(hideAutoSaveIndicator, 2000);
    }
    
    /**
     * Hide auto-save indicator
     */
    function hideAutoSaveIndicator() {
        autoSaveIndicator.style.display = 'none';
    }
    
    /**
     * Create a new note (save current one to history)
     */
    function createNewNote() {
        if (notepad.value.trim() !== '') {
            // Save current note to history
            saveToHistory();
            
            // Clear the notepad
            notepad.value = '';
            updateCounters();
            saveContent();
        }
    }
    
    /**
     * Save current note to history
     */
    function saveToHistory() {
        const currentContent = notepad.value;
        if (currentContent.trim() === '') return;
        
        let history = JSON.parse(localStorage.getItem(NOTES_HISTORY_KEY) || '[]');
        
        // Add current note with timestamp
        history.push({
            content: currentContent,
            timestamp: new Date().toISOString(),
            preview: currentContent.substring(0, 50) + (currentContent.length > 50 ? '...' : '')
        });
        
        // Keep only the last 10 notes
        if (history.length > 10) {
            history = history.slice(history.length - 10);
        }
        
        localStorage.setItem(NOTES_HISTORY_KEY, JSON.stringify(history));
    }
    
    /**
     * Download note as a text file
     */
    function downloadNote() {
        if (notepad.value.trim() === '') {
            alert('Notepad is empty. Nothing to download.');
            return;
        }
        
        const text = notepad.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'note_' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    /**
     * Copy notepad content to clipboard
     */
    function copyToClipboard() {
        if (notepad.value.trim() === '') {
            alert('Notepad is empty. Nothing to copy.');
            return;
        }
        
        notepad.select();
        document.execCommand('copy');
        
        // Show temporary success message
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = '<svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
        
        setTimeout(() => {
            btnCopy.innerHTML = originalText;
        }, 2000);
    }
    
    /**
     * Clear the notepad
     */
    function clearNotepad() {
        if (notepad.value.trim() === '') return;
        
        if (confirm('Are you sure you want to clear the notepad? This action cannot be undone.')) {
            notepad.value = '';
            updateCounters();
            saveContent();
        }
    }
    
    /**
     * Apply formatting to selected text
     */
    function formatText(format) {
        // Get selection
        const start = notepad.selectionStart;
        const end = notepad.selectionEnd;
        const selectedText = notepad.value.substring(start, end);
        
        if (start === end) {
            // No text selected, show message
            alert('Please select some text to format.');
            return;
        }
        
        let formattedText = '';
        
        // Apply formatting based on type
        switch(format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `_${selectedText}_`;
                break;
            default:
                formattedText = selectedText;
        }
        
        // Replace the selected text with formatted text
        notepad.value = notepad.value.substring(0, start) + formattedText + notepad.value.substring(end);
        
        // Update and save
        updateCounters();
        saveContent();
        
        // Set selection to include the formatting markers
        notepad.focus();
        notepad.selectionStart = start;
        notepad.selectionEnd = start + formattedText.length;
    }
});