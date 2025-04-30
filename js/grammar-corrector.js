/**
 * Grammar Corrector Tool
 * Allows users to check and correct grammar, spelling, and punctuation errors in their text
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const grammarInput = document.getElementById('grammar-input');
    const checkGrammarBtn = document.getElementById('check-grammar');
    const clearTextBtn = document.getElementById('clear-text');
    const copyCorrectedBtn = document.getElementById('copy-corrected');
    const resultsArea = document.getElementById('results-area');
    const correctionsContainer = document.getElementById('corrections-container');
    const correctedTextContainer = document.getElementById('corrected-text');
    const loadingIndicator = document.getElementById('loading-indicator');
    const copyNotification = document.getElementById('copy-notification');
    
    // Initialize 3D icon
    initializeGrammarIcon();
    
    // Event listeners
    checkGrammarBtn.addEventListener('click', checkGrammar);
    clearTextBtn.addEventListener('click', clearText);
    copyCorrectedBtn.addEventListener('click', copyText);
    
    /**
     * Initialize the 3D grammar icon
     */
    function initializeGrammarIcon() {
        // Create a scene for the 3D icon
        const container = document.getElementById('grammar-icon-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create a group to hold all objects
        const group = new THREE.Group();
        scene.add(group);
        
        // Create a paper material
        const paperMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            specular: 0x111111,
            shininess: 30
        });
        
        // Create a pen material
        const penMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3949ab,
            specular: 0x333333,
            shininess: 30
        });
        
        // Create a check mark material
        const checkMarkMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4caf50,
            specular: 0x333333,
            shininess: 30
        });
        
        // Create paper geometry
        const paperGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
        const paper = new THREE.Mesh(paperGeometry, paperMaterial);
        group.add(paper);
        
        // Create pen geometry
        const penGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
        const pen = new THREE.Mesh(penGeometry, penMaterial);
        pen.position.set(0.8, 0, 0.3);
        pen.rotation.z = Math.PI / 4;
        group.add(pen);
        
        // Create check mark
        const checkMarkGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 100, Math.PI);
        const checkMark = new THREE.Mesh(checkMarkGeometry, checkMarkMaterial);
        checkMark.position.set(-0.4, 0, 0.3);
        checkMark.rotation.z = Math.PI / 4;
        group.add(checkMark);
        
        // Add text lines on paper
        for (let i = 0; i < 5; i++) {
            const lineGeometry = new THREE.BoxGeometry(1, 0.03, 0.02);
            const line = new THREE.Mesh(lineGeometry, new THREE.MeshPhongMaterial({ color: 0xdddddd }));
            line.position.set(0, 0.6 - (i * 0.3), 0.1);
            paper.add(line);
        }
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 2);
        scene.add(directionalLight);
        
        // Position camera
        camera.position.z = 4;
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the group slightly
            group.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
    
    /**
     * Check grammar in the input text
     */
    function checkGrammar() {
        const text = grammarInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to check.');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        resultsArea.classList.add('hidden');
        
        // Simulate API call with setTimeout (in a real app, you would call a grammar API)
        setTimeout(() => {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
            resultsArea.classList.remove('hidden');
            
            // Enable copy button
            copyCorrectedBtn.disabled = false;
            
            // Process the text and find errors
            const corrections = findGrammarErrors(text);
            
            // Display corrections
            displayCorrections(corrections);
            
            // Display corrected text
            displayCorrectedText(text, corrections);
        }, 1500);
    }
    
    /**
     * Find grammar errors in the text
     * @param {string} text - The text to check
     * @returns {Array} - Array of correction objects
     */
    function findGrammarErrors(text) {
        // This is a simplified demo version that detects some common errors
        // In a real application, you would use a grammar checking API or library
        
        const corrections = [];
        
        // Sample error patterns to detect
        const errorPatterns = [
            {
                pattern: /\b(i)\b/g,
                suggestion: 'I',
                type: 'capitalization',
                explanation: 'The pronoun "I" should always be capitalized.'
            },
            {
                pattern: /\b(dont|cant|wont|shouldnt|couldnt|wouldnt)\b/gi,
                suggestion: (match) => match.replace(/([a-z]+)([a-z]+)/i, '$1\'$2'),
                type: 'apostrophe',
                explanation: 'Contractions should include an apostrophe.'
            },
            {
                pattern: /\b(there|their|they're)\b/gi,
                checkContext: true,
                type: 'commonly confused',
                explanation: 'Make sure you\'re using the correct form: "there" (location), "their" (possession), or "they\'re" (they are).'
            },
            {
                pattern: /\b(your|you're)\b/gi,
                checkContext: true,
                type: 'commonly confused',
                explanation: 'Make sure you\'re using the correct form: "your" (possession) or "you\'re" (you are).'
            },
            {
                pattern: /\b(its|it's)\b/gi,
                checkContext: true,
                type: 'commonly confused',
                explanation: 'Make sure you\'re using the correct form: "its" (possession) or "it\'s" (it is/it has).'
            },
            {
                pattern: /\s([,.!?:;])\b/g,
                suggestion: '$1',
                type: 'punctuation',
                explanation: 'There should not be a space before punctuation marks.'
            },
            {
                pattern: /\b(\w+)\s+(\1)\b/gi,
                suggestion: '$1',
                type: 'duplicate',
                explanation: 'You have a duplicate word.'
            },
            {
                pattern: /\b(alot)\b/gi,
                suggestion: 'a lot',
                type: 'spelling',
                explanation: '"Alot" should be written as two words: "a lot".'
            },
            {
                pattern: /\b(could of|should of|would of|must of|might of)\b/gi,
                suggestion: (match) => match.replace(/ of$/i, ' have'),
                type: 'grammar',
                explanation: 'Use "have" instead of "of" after modal verbs.'
            }
        ];
        
        // Check for each error pattern
        errorPatterns.forEach(errorPattern => {
            let match;
            while ((match = errorPattern.pattern.exec(text)) !== null) {
                // Skip context-dependent errors in this demo
                if (errorPattern.checkContext) {
                    // In a real app, you would implement context-aware checking here
                    continue;
                }
                
                const start = match.index;
                const end = start + match[0].length;
                const originalText = match[0];
                
                let suggestion = originalText;
                if (typeof errorPattern.suggestion === 'string') {
                    suggestion = originalText.replace(errorPattern.pattern, errorPattern.suggestion);
                } else if (typeof errorPattern.suggestion === 'function') {
                    suggestion = errorPattern.suggestion(originalText);
                }
                
                corrections.push({
                    start,
                    end,
                    originalText,
                    suggestion,
                    type: errorPattern.type,
                    explanation: errorPattern.explanation
                });
            }
        });
        
        return corrections;
    }
    
    /**
     * Display corrections in the corrections container
     * @param {Array} corrections - Array of correction objects
     */
    function displayCorrections(corrections) {
        if (corrections.length === 0) {
            correctionsContainer.innerHTML = '<p class="text-green-600 text-center">No grammar issues found. Your text looks good!</p>';
            return;
        }
        
        correctionsContainer.innerHTML = '';
        
        // Sort corrections by position in text
        corrections.sort((a, b) => a.start - b.start);
        
        // Create correction elements
        corrections.forEach((correction, index) => {
            const correctionElement = document.createElement('div');
            correctionElement.className = 'correction-item bg-gray-50 hover:bg-gray-100 rounded-lg p-3 mb-3 border-l-4 border-yellow-500';
            
            correctionElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-800 mb-1">
                            <span class="bg-yellow-100 px-1 rounded">${correction.originalText}</span> → 
                            <span class="bg-green-100 px-1 rounded cursor-pointer hover:bg-green-200" 
                                title="Click to apply this suggestion" 
                                data-correction-index="${index}">${correction.suggestion}</span>
                        </div>
                        <div class="text-xs text-gray-500 mb-1">Type: ${correction.type}</div>
                        <div class="text-sm text-gray-600">${correction.explanation}</div>
                    </div>
                </div>
            `;
            
            // Add click event to apply suggestion
            const suggestionElement = correctionElement.querySelector(`[data-correction-index="${index}"]`);
            suggestionElement.addEventListener('click', () => {
                applySuggestion(correction);
            });
            
            correctionsContainer.appendChild(correctionElement);
        });
    }
    
    /**
     * Display corrected text in the corrected text container
     * @param {string} originalText - The original text
     * @param {Array} corrections - Array of correction objects
     */
    function displayCorrectedText(originalText, corrections) {
        if (corrections.length === 0) {
            correctedTextContainer.textContent = originalText;
            return;
        }
        
        // Sort corrections by position in text (from end to start to avoid offset issues)
        corrections.sort((a, b) => b.start - a.start);
        
        // Apply all corrections to get the corrected text
        let correctedText = originalText;
        corrections.forEach(correction => {
            correctedText = correctedText.substring(0, correction.start) + 
                           correction.suggestion + 
                           correctedText.substring(correction.end);
        });
        
        correctedTextContainer.textContent = correctedText;
    }
    
    /**
     * Apply a suggestion to the original text and update the input
     * @param {Object} correction - The correction object to apply
     */
    function applySuggestion(correction) {
        const text = grammarInput.value;
        
        // Apply the correction
        const newText = text.substring(0, correction.start) + 
                       correction.suggestion + 
                       text.substring(correction.end);
        
        // Update the input text
        grammarInput.value = newText;
        
        // Re-check grammar with the updated text
        checkGrammar();
    }
    
    /**
     * Clear the input text and results
     */
    function clearText() {
        grammarInput.value = '';
        resultsArea.classList.add('hidden');
        copyCorrectedBtn.disabled = true;
    }
    
    /**
     * Copy the corrected text to clipboard
     */
    function copyText() {
        const textToCopy = correctedTextContainer.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Show notification
                showCopyNotification();
            })
            .catch(err => {
                console.error('Failed to copy text:', err);
                // Fallback method for clipboard
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showCopyNotification();
                } catch (err) {
                    console.error('Fallback: Failed to copy text:', err);
                }
                
                document.body.removeChild(textArea);
            });
    }
    
    /**
     * Show copy notification and hide after a delay
     */
    function showCopyNotification() {
        copyNotification.classList.remove('translate-y-20');
        copyNotification.classList.add('translate-y-0');
        
        setTimeout(() => {
            copyNotification.classList.remove('translate-y-0');
            copyNotification.classList.add('translate-y-20');
        }, 2000);
    }
});