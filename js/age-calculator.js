/**
 * Age Calculator JavaScript
 * Handles all functionality for the age calculator tool
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const birthDateInput = document.getElementById('birth-date');
    const calculationOption = document.getElementById('calculation-option');
    const customDateContainer = document.getElementById('custom-date-container');
    const customDateInput = document.getElementById('custom-date');
    const calculateBtn = document.getElementById('calculate-age');
    const resultsSection = document.getElementById('results-section');
    
    // Result elements
    const resultDOB = document.getElementById('result-dob');
    const resultAsOf = document.getElementById('result-as-of');
    const resultYears = document.getElementById('result-years');
    const resultMonths = document.getElementById('result-months');
    const resultDays = document.getElementById('result-days');
    const resultHours = document.getElementById('result-hours');
    const resultMinutes = document.getElementById('result-minutes');
    const resultTotalDays = document.getElementById('result-total-days');
    const resultNextBirthday = document.getElementById('result-next-birthday');
    
    // History elements
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    // Initialize history from localStorage
    let calculationHistory = JSON.parse(localStorage.getItem('ageCalculatorHistory')) || [];
    
    // Set default values
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    customDateInput.value = formattedToday;
    
    // Show/hide custom date input based on calculation option
    calculationOption.addEventListener('change', function() {
        customDateContainer.style.display = this.value === 'custom' ? 'block' : 'none';
    });
    
    // Calculate age button click handler
    calculateBtn.addEventListener('click', function() {
        if (!birthDateInput.value) {
            alert('Please enter your date of birth');
            return;
        }
        
        const birthDate = new Date(birthDateInput.value);
        let calculationDate;
        
        if (calculationOption.value === 'current') {
            calculationDate = new Date();
        } else {
            if (!customDateInput.value) {
                alert('Please enter a custom date');
                return;
            }
            calculationDate = new Date(customDateInput.value);
            // Set to end of day for custom date
            calculationDate.setHours(23, 59, 59, 999);
        }
        
        // Validate dates
        if (birthDate > calculationDate) {
            alert('Birth date cannot be in the future relative to calculation date');
            return;
        }
        
        // Calculate age
        const ageDetails = calculateAge(birthDate, calculationDate);
        
        // Display results
        displayResults(birthDate, calculationDate, ageDetails);
        
        // Add to history
        addToHistory(birthDate, calculationDate, ageDetails);
    });
    
    // Clear history button click handler
    clearHistoryBtn.addEventListener('click', function() {
        calculationHistory = [];
        localStorage.setItem('ageCalculatorHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
    });
    
    /**
     * Calculate age between two dates
     * @param {Date} birthDate - Date of birth
     * @param {Date} calculationDate - Date to calculate age as of
     * @returns {Object} Age details object
     */
    function calculateAge(birthDate, calculationDate) {
        // Clone dates to avoid modifying the originals
        const birth = new Date(birthDate);
        const calculation = new Date(calculationDate);
        
        // Calculate years
        let years = calculation.getFullYear() - birth.getFullYear();
        
        // Calculate months
        let months = calculation.getMonth() - birth.getMonth();
        
        // Adjust years and months if needed
        if (months < 0 || (months === 0 && calculation.getDate() < birth.getDate())) {
            years--;
            months += 12;
        }
        
        // Calculate days
        let days = calculation.getDate() - birth.getDate();
        if (days < 0) {
            // Get the last day of the previous month
            const lastMonth = new Date(calculation.getFullYear(), calculation.getMonth(), 0);
            days += lastMonth.getDate();
            months--;
        }
        
        // Calculate hours and minutes
        let hours = calculation.getHours() - birth.getHours();
        let minutes = calculation.getMinutes() - birth.getMinutes();
        
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        
        if (hours < 0) {
            hours += 24;
            days--;
        }
        
        // Calculate total days and hours
        const totalMilliseconds = calculation.getTime() - birth.getTime();
        const totalDays = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        
        // Calculate days until next birthday
        const nextBirthday = calculateNextBirthday(birth, calculation);
        
        return {
            years,
            months,
            days,
            hours,
            minutes,
            totalDays,
            totalHours,
            nextBirthday
        };
    }
    
    /**
     * Calculate days until next birthday
     * @param {Date} birthDate - Date of birth
     * @param {Date} currentDate - Current date
     * @returns {Number} Days until next birthday
     */
    function calculateNextBirthday(birthDate, currentDate) {
        const birth = new Date(birthDate);
        const current = new Date(currentDate);
        
        // Create next birthday date for current year
        const nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate());
        
        // If birthday has already occurred this year, set for next year
        if (nextBirthday < current) {
            nextBirthday.setFullYear(current.getFullYear() + 1);
        }
        
        // Calculate days difference
        const diffTime = nextBirthday.getTime() - current.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    /**
     * Display calculation results
     * @param {Date} birthDate - Date of birth
     * @param {Date} calculationDate - Date calculated as of
     * @param {Object} ageDetails - Age calculation details
     */
    function displayResults(birthDate, calculationDate, ageDetails) {
        // Format dates for display
        const birthDateFormatted = formatDate(birthDate);
        const calculationDateFormatted = formatDate(calculationDate);
        
        // Update result elements
        resultDOB.textContent = birthDateFormatted;
        resultAsOf.textContent = calculationDateFormatted;
        resultYears.textContent = ageDetails.years;
        resultMonths.textContent = ageDetails.months;
        resultDays.textContent = ageDetails.days;
        resultHours.textContent = ageDetails.hours;
        resultMinutes.textContent = ageDetails.minutes;
        resultTotalDays.textContent = `${ageDetails.totalDays} days (${ageDetails.totalHours} hours)`;
        resultNextBirthday.textContent = `${ageDetails.nextBirthday} days from now`;
        
        // Show results section
        resultsSection.style.display = 'block';
    }
    
    /**
     * Format date for display
     * @param {Date} date - Date to format
     * @returns {String} Formatted date string
     */
    function formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    /**
     * Add calculation to history
     * @param {Date} birthDate - Date of birth
     * @param {Date} calculationDate - Date calculated as of
     * @param {Object} ageDetails - Age calculation details
     */
    function addToHistory(birthDate, calculationDate, ageDetails) {
        const historyItem = {
            birthDate: birthDate.toISOString(),
            calculationDate: calculationDate.toISOString(),
            birthDateFormatted: formatDate(birthDate),
            calculationDateFormatted: formatDate(calculationDate),
            ageDetails: ageDetails,
            timestamp: new Date().getTime()
        };
        
        // Add to history array (limit to 10 items)
        calculationHistory.push(historyItem);
        if (calculationHistory.length > 10) {
            calculationHistory.shift();
        }
        
        // Save to localStorage
        localStorage.setItem('ageCalculatorHistory', JSON.stringify(calculationHistory));
        
        // Update history display
        updateHistoryDisplay();
    }
    
    /**
     * Update history display
     */
    function updateHistoryDisplay() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<p class="text-gray-500 text-center italic">Your calculation history will appear here.</p>';
            return;
        }
        
        historyList.innerHTML = '';
        calculationHistory.slice().reverse().forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'border-b border-gray-200 py-2';
            historyItem.innerHTML = `
                <p class="font-medium">Age Calculation</p>
                <p class="text-gray-600">Birth Date: ${item.birthDateFormatted}</p>
                <p class="text-gray-600">Calculated as of: ${item.calculationDateFormatted}</p>
                <p class="text-indigo-600 font-bold">${item.ageDetails.years} years, ${item.ageDetails.months} months, ${item.ageDetails.days} days</p>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    // Initialize history display
    updateHistoryDisplay();
});

// Create 3D icon for the age calculator
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the age calculator page and the tool icon container exists
    const toolIconContainer = document.querySelector('.tool-icon');
    if (!toolIconContainer) return;
    
    // Create a scene for the 3D calendar icon
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // Create a renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(80, 80);
    renderer.setClearColor(0x000000, 0);
    
    // Replace the SVG with the 3D canvas
    toolIconContainer.innerHTML = '';
    toolIconContainer.appendChild(renderer.domElement);
    
    // Create a calendar base (cube)
    const calendarGeometry = new THREE.BoxGeometry(1.5, 0.2, 2);
    const calendarMaterial = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });
    const calendar = new THREE.Mesh(calendarGeometry, calendarMaterial);
    scene.add(calendar);
    
    // Create calendar pages
    const pagesGeometry = new THREE.BoxGeometry(1.4, 0.05, 1.9);
    const pagesMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
    pages.position.y = 0.15;
    scene.add(pages);
    
    // Create calendar top ring
    const ringGeometry = new THREE.TorusGeometry(0.1, 0.05, 16, 16);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
    
    // Add multiple rings across the top
    for (let i = -0.6; i <= 0.6; i += 0.3) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(i, 0.25, -0.8);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
    }
    
    // Add calendar markings (simplified numbers)
    const markerGeometry = new THREE.PlaneGeometry(1.2, 1.6);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.y = 0.18;
    marker.position.z = 0.01;
    marker.rotation.x = -Math.PI / 2;
    scene.add(marker);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 3;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the calendar slightly
        calendar.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
        pages.rotation.y = calendar.rotation.y;
        marker.rotation.x = -Math.PI / 2;
        marker.rotation.y = calendar.rotation.y;
        
        renderer.render(scene, camera);
    }
    
    animate();
});