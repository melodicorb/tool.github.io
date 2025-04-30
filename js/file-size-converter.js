document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const inputValue = document.getElementById('input-value');
    const inputUnit = document.getElementById('input-unit');
    const outputValue = document.getElementById('output-value');
    const outputUnit = document.getElementById('output-unit');
    const swapUnitsBtn = document.getElementById('swap-units');
    
    // Conversion factors (in bytes)
    const conversionFactors = {
        bytes: 1,
        kilobytes: 1024,
        megabytes: 1024 * 1024,
        gigabytes: 1024 * 1024 * 1024,
        terabytes: 1024 * 1024 * 1024 * 1024,
        petabytes: 1024 * 1024 * 1024 * 1024 * 1024
    };
    
    // Initialize the converter
    calculateConversion();
    
    // Add event listeners
    inputValue.addEventListener('input', calculateConversion);
    inputUnit.addEventListener('change', calculateConversion);
    outputUnit.addEventListener('change', calculateConversion);
    swapUnitsBtn.addEventListener('click', swapUnits);
    
    /**
     * Calculate and display the conversion result
     */
    function calculateConversion() {
        // Get input value and units
        const value = parseFloat(inputValue.value) || 0;
        const fromUnit = inputUnit.value;
        const toUnit = outputUnit.value;
        
        // Convert to bytes first, then to target unit
        const valueInBytes = value * conversionFactors[fromUnit];
        const result = valueInBytes / conversionFactors[toUnit];
        
        // Format the result based on size
        let formattedResult;
        if (result === 0) {
            formattedResult = '0';
        } else if (result < 0.0001) {
            formattedResult = result.toExponential(6);
        } else if (result < 0.01) {
            formattedResult = result.toFixed(6);
        } else if (result < 1) {
            formattedResult = result.toFixed(4);
        } else if (result < 10) {
            formattedResult = result.toFixed(3);
        } else if (result < 100) {
            formattedResult = result.toFixed(2);
        } else if (result < 1000) {
            formattedResult = result.toFixed(1);
        } else if (result < 10000) {
            formattedResult = result.toFixed(0);
        } else {
            formattedResult = result.toExponential(2);
        }
        
        // Remove trailing zeros after decimal point
        formattedResult = formattedResult.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
        
        // Display the result
        outputValue.value = formattedResult;
    }
    
    /**
     * Swap input and output units
     */
    function swapUnits() {
        // Save current values
        const tempUnit = inputUnit.value;
        const tempValue = inputValue.value;
        
        // Swap units
        inputUnit.value = outputUnit.value;
        outputUnit.value = tempUnit;
        
        // Update input value to current output value
        inputValue.value = outputValue.value;
        
        // Recalculate
        calculateConversion();
        
        // Add animation effect
        swapUnitsBtn.classList.add('rotate-180');
        setTimeout(() => {
            swapUnitsBtn.classList.remove('rotate-180');
        }, 300);
    }
    
    // Add 3D icon animation
    const iconContainer = document.querySelector('.tool-icon');
    if (iconContainer) {
        // Create a scene for the 3D icon
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        // Create renderer with transparent background
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(80, 80);
        iconContainer.appendChild(renderer.domElement);
        
        // Create a file icon geometry
        const fileGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
        const fileMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4f46e5,
            metalness: 0.3,
            roughness: 0.4
        });
        const file = new THREE.Mesh(fileGeometry, fileMaterial);
        
        // Create a smaller box for the "size" indicator
        const sizeGeometry = new THREE.BoxGeometry(0.5, 0.3, 0.15);
        const sizeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.2
        });
        const sizeIndicator = new THREE.Mesh(sizeGeometry, sizeMaterial);
        sizeIndicator.position.set(0, -0.2, 0.15);
        file.add(sizeIndicator);
        
        scene.add(file);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 2);
        scene.add(directionalLight);
        
        camera.position.z = 2.5;
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            file.rotation.y += 0.01;
            file.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});