/**
 * Plagiarism Checker Tool
 * Allows users to check their text for potential plagiarism against online sources
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const plagiarismInput = document.getElementById('plagiarism-input');
    const checkTypeSelect = document.getElementById('check-type');
    const excludeSourcesInput = document.getElementById('exclude-sources');
    const checkPlagiarismBtn = document.getElementById('check-plagiarism');
    const clearTextBtn = document.getElementById('clear-text');
    const downloadReportBtn = document.getElementById('download-report');
    const resultsArea = document.getElementById('results-area');
    const plagiarismMeter = document.getElementById('plagiarism-meter');
    const plagiarismPercentage = document.getElementById('plagiarism-percentage');
    const originalityLabel = document.getElementById('originality-label');
    const matchedSourcesContainer = document.getElementById('matched-sources');
    const textAnalysisContainer = document.getElementById('text-analysis');
    const loadingIndicator = document.getElementById('loading-indicator');
    const copyNotification = document.getElementById('copy-notification');
    
    // Initialize 3D icon
    initializePlagiarismIcon();
    
    // Event listeners
    checkPlagiarismBtn.addEventListener('click', checkPlagiarism);
    clearTextBtn.addEventListener('click', clearText);
    downloadReportBtn.addEventListener('click', downloadReport);
    
    /**
     * Initialize the 3D plagiarism icon
     */
    function initializePlagiarismIcon() {
        // Create a scene for the 3D icon
        const container = document.getElementById('plagiarism-icon-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create a group to hold all objects
        const group = new THREE.Group();
        scene.add(group);
        
        // Create materials
        const documentMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            specular: 0x111111,
            shininess: 30
        });
        
        const magnifyingGlassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3949ab,
            specular: 0x333333,
            shininess: 30
        });
        
        const handleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x795548,
            specular: 0x333333,
            shininess: 30
        });
        
        // Create document geometry
        const documentGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
        const document3D = new THREE.Mesh(documentGeometry, documentMaterial);
        document3D.position.set(-0.3, 0, 0);
        group.add(document3D);
        
        // Add text lines on document
        for (let i = 0; i < 5; i++) {
            const lineGeometry = new THREE.BoxGeometry(1, 0.03, 0.02);
            const line = new THREE.Mesh(lineGeometry, new THREE.MeshPhongMaterial({ color: 0xdddddd }));
            line.position.set(0, 0.6 - (i * 0.3), 0.1);
            document3D.add(line);
        }
        
        // Create magnifying glass lens
        const lensGeometry = new THREE.CircleGeometry(0.6, 32);
        const lens = new THREE.Mesh(lensGeometry, new THREE.MeshPhongMaterial({ 
            color: 0xadd8e6,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        }));
        lens.position.set(0.8, 0.3, 0.3);
        lens.rotation.y = Math.PI / 4;
        group.add(lens);
        
        // Create magnifying glass rim
        const rimGeometry = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
        const rim = new THREE.Mesh(rimGeometry, magnifyingGlassMaterial);
        rim.position.set(0.8, 0.3, 0.3);
        rim.rotation.y = Math.PI / 4;
        group.add(rim);
        
        // Create magnifying glass handle
        const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 32);
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.8, -0.5, 0.3);
        handle.rotation.x = Math.PI / 2;
        handle.rotation.z = Math.PI / 6;
        group.add(handle);
        
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
     * Check plagiarism in the input text
     */
    function checkPlagiarism() {
        const text = plagiarismInput.value.trim();
        const checkType = checkTypeSelect.value;
        const excludeSources = excludeSourcesInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to check for plagiarism.');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        resultsArea.classList.add('hidden');
        
        // Simulate API call with setTimeout (in a real app, you would call a plagiarism detection API)
        setTimeout(() => {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
            resultsArea.classList.remove('hidden');
            
            // Enable download button
            downloadReportBtn.disabled = false;
            
            // Process the text and find potential plagiarism
            const plagiarismResults = simulatePlagiarismCheck(text, checkType, excludeSources);
            
            // Update plagiarism meter
            updatePlagiarismMeter(plagiarismResults.plagiarismScore);
            
            // Display matched sources
            displayMatchedSources(plagiarismResults.matchedSources);
            
            // Display text analysis with highlighted plagiarism
            displayTextAnalysis(text, plagiarismResults.matchedSources);
        }, 2000);
    }
    
    /**
     * Simulate plagiarism check (in a real app, this would call an API)
     * @param {string} text - The text to check
     * @param {string} checkType - The type of check to perform
     * @param {string} excludeSources - Sources to exclude from the check
     * @returns {Object} - Plagiarism check results
     */
    function simulatePlagiarismCheck(text, checkType, excludeSources) {
        // This is a simplified demo version that simulates plagiarism detection
        // In a real application, you would use a plagiarism detection API or service
        
        // Generate a random plagiarism score between 0 and 30%
        const plagiarismScore = Math.floor(Math.random() * 31);
        
        // Create some sample matched sources
        const matchedSources = [];
        
        if (plagiarismScore > 0) {
            // Number of sources depends on the check type and plagiarism score
            const sourceCount = checkType === 'deep' ? Math.ceil(plagiarismScore / 5) : Math.ceil(plagiarismScore / 10);
            
            const sampleSources = [
                { url: 'https://en.wikipedia.org/wiki/Plagiarism', title: 'Plagiarism - Wikipedia', domain: 'wikipedia.org' },
                { url: 'https://www.plagiarism.org/article/what-is-plagiarism', title: 'What is Plagiarism? - Plagiarism.org', domain: 'plagiarism.org' },
                { url: 'https://www.turnitin.com/blog/what-is-plagiarism', title: 'What is Plagiarism? - Turnitin Blog', domain: 'turnitin.com' },
                { url: 'https://www.scribbr.com/plagiarism/what-is-plagiarism/', title: 'What is Plagiarism? | Types, Consequences & Prevention', domain: 'scribbr.com' },
                { url: 'https://www.grammarly.com/plagiarism-checker', title: 'Plagiarism Checker | Grammarly', domain: 'grammarly.com' }
            ];
            
            // Filter out excluded sources
            const excludedDomains = excludeSources.split(',').map(s => s.trim().toLowerCase());
            const filteredSources = sampleSources.filter(source => {
                return !excludedDomains.some(domain => source.domain.includes(domain));
            });
            
            // Generate random matched sources
            for (let i = 0; i < Math.min(sourceCount, filteredSources.length); i++) {
                const source = filteredSources[i];
                const matchPercentage = Math.floor(Math.random() * (plagiarismScore - 1) + 1);
                
                matchedSources.push({
                    url: source.url,
                    title: source.title,
                    matchPercentage: matchPercentage,
                    matchedText: getRandomTextSegment(text)
                });
            }
        }
        
        return {
            plagiarismScore: plagiarismScore,
            matchedSources: matchedSources
        };
    }
    
    /**
     * Get a random segment of text for simulating matched content
     * @param {string} text - The full text
     * @returns {string} - A random segment of the text
     */
    function getRandomTextSegment(text) {
        const words = text.split(' ');
        if (words.length <= 10) return text;
        
        const startIndex = Math.floor(Math.random() * (words.length - 10));
        const segmentLength = Math.floor(Math.random() * 10) + 5; // 5-15 words
        
        return words.slice(startIndex, startIndex + segmentLength).join(' ');
    }
    
    /**
     * Update the plagiarism meter with the score
     * @param {number} score - The plagiarism score (0-100)
     */
    function updatePlagiarismMeter(score) {
        plagiarismPercentage.style.width = `${score}%`;
        plagiarismPercentage.textContent = `${score}%`;
        
        // Update color based on score
        if (score < 10) {
            plagiarismPercentage.classList.remove('bg-yellow-500', 'bg-red-500');
            plagiarismPercentage.classList.add('bg-green-500');
            originalityLabel.textContent = `${100 - score}% Original`;
            originalityLabel.classList.remove('text-yellow-600', 'text-red-600');
            originalityLabel.classList.add('text-green-600');
        } else if (score < 30) {
            plagiarismPercentage.classList.remove('bg-green-500', 'bg-red-500');
            plagiarismPercentage.classList.add('bg-yellow-500');
            originalityLabel.textContent = `${100 - score}% Original`;
            originalityLabel.classList.remove('text-green-600', 'text-red-600');
            originalityLabel.classList.add('text-yellow-600');
        } else {
            plagiarismPercentage.classList.remove('bg-green-500', 'bg-yellow-500');
            plagiarismPercentage.classList.add('bg-red-500');
            originalityLabel.textContent = `${100 - score}% Original`;
            originalityLabel.classList.remove('text-green-600', 'text-yellow-600');
            originalityLabel.classList.add('text-red-600');
        }
    }
    
    /**
     * Display matched sources in the results area
     * @param {Array} sources - Array of matched source objects
     */
    function displayMatchedSources(sources) {
        if (sources.length === 0) {
            matchedSourcesContainer.innerHTML = `
                <p class="text-green-600 text-center font-medium">No plagiarism detected! Your content appears to be original.</p>
            `;
            return;
        }
        
        // Sort sources by match percentage (highest first)
        sources.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        let sourcesHTML = `
            <div class="space-y-4">
        `;
        
        sources.forEach(source => {
            sourcesHTML += `
                <div class="border-b border-gray-200 pb-4">
                    <div class="flex justify-between items-start mb-2">
                        <a href="${source.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-medium">${source.title}</a>
                        <span class="text-sm font-medium px-2 py-1 rounded-full ${source.matchPercentage < 10 ? 'bg-green-100 text-green-800' : source.matchPercentage < 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">Match: ${source.matchPercentage}%</span>
                    </div>
                    <p class="text-sm text-gray-600">${source.url}</p>
                    <div class="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <p class="text-gray-700">"${source.matchedText}"</p>
                    </div>
                </div>
            `;
        });
        
        sourcesHTML += `</div>`;
        matchedSourcesContainer.innerHTML = sourcesHTML;
    }
    
    /**
     * Display text analysis with highlighted plagiarism
     * @param {string} text - The original text
     * @param {Array} sources - Array of matched source objects
     */
    function displayTextAnalysis(text, sources) {
        if (sources.length === 0) {
            textAnalysisContainer.innerHTML = `
                <p class="text-gray-700">${text}</p>
            `;
            return;
        }
        
        // Create a simple highlighting of potentially plagiarized segments
        // In a real application, this would be more sophisticated
        let highlightedText = text;
        
        sources.forEach(source => {
            const matchedText = source.matchedText;
            if (highlightedText.includes(matchedText)) {
                const highlightClass = source.matchPercentage < 10 ? 'bg-green-100' : 
                                      source.matchPercentage < 30 ? 'bg-yellow-100' : 'bg-red-100';
                
                highlightedText = highlightedText.replace(
                    matchedText,
                    `<span class="${highlightClass} px-1 rounded" title="Matched with: ${source.title}">${matchedText}</span>`
                );
            }
        });
        
        textAnalysisContainer.innerHTML = `
            <p class="text-gray-700">${highlightedText}</p>
            <div class="mt-4 text-sm text-gray-600">
                <p><span class="inline-block w-3 h-3 bg-green-100 mr-1"></span> Low similarity (< 10%)</p>
                <p><span class="inline-block w-3 h-3 bg-yellow-100 mr-1"></span> Moderate similarity (10-30%)</p>
                <p><span class="inline-block w-3 h-3 bg-red-100 mr-1"></span> High similarity (> 30%)</p>
            </div>
        `;
    }
    
    /**
     * Clear the input text and results
     */
    function clearText() {
        plagiarismInput.value = '';
        excludeSourcesInput.value = '';
        resultsArea.classList.add('hidden');
        downloadReportBtn.disabled = true;
    }
    
    /**
     * Download a plagiarism report
     */
    function downloadReport() {
        // In a real implementation, we would generate a PDF or HTML report
        // For this demo, we'll show a notification
        copyNotification.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            copyNotification.style.transform = 'translateY(20rem)';
        }, 3000);
    }
});