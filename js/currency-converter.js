document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fromAmount = document.getElementById('from-amount');
    const toAmount = document.getElementById('to-amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const convertButton = document.getElementById('convert-button');
    const swapButton = document.getElementById('swap-currencies');
    const currentRateElement = document.getElementById('current-rate');
    const updateTimeElement = document.getElementById('update-time');
    const exchangeRateInfo = document.getElementById('exchange-rate-info');
    
    // State variables
    let exchangeRates = {};
    let lastUpdated = null;
    
    // Initialize the converter
    initializeConverter();
    
    // Event listeners
    convertButton.addEventListener('click', performConversion);
    swapButton.addEventListener('click', swapCurrencies);
    fromCurrency.addEventListener('change', updateRateInfo);
    toCurrency.addEventListener('change', updateRateInfo);
    fromAmount.addEventListener('input', handleAmountInput);
    
    /**
     * Initialize the currency converter
     */
    function initializeConverter() {
        // Try to load cached rates from localStorage
        const cachedRates = localStorage.getItem('exchangeRates');
        const cachedTime = localStorage.getItem('ratesUpdatedAt');
        
        if (cachedRates && cachedTime) {
            exchangeRates = JSON.parse(cachedRates);
            lastUpdated = new Date(cachedTime);
            updateTimeElement.textContent = formatDateTime(lastUpdated);
            updateRateInfo();
            
            // If cached rates are older than 6 hours, fetch new ones
            const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
            if (lastUpdated < sixHoursAgo) {
                fetchExchangeRates();
            }
        } else {
            fetchExchangeRates();
        }
        
        // Perform initial conversion
        performConversion();
    }
    
    /**
     * Fetch exchange rates from API
     */
    function fetchExchangeRates() {
        // For demo purposes, we'll use a free API
        // In a production environment, you would use a more reliable API with an API key
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                exchangeRates = data.rates;
                lastUpdated = new Date();
                
                // Save to localStorage
                localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
                localStorage.setItem('ratesUpdatedAt', lastUpdated.toISOString());
                
                updateTimeElement.textContent = formatDateTime(lastUpdated);
                updateRateInfo();
                performConversion();
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                updateTimeElement.textContent = 'Failed to update rates';
            });
    }
    
    /**
     * Perform currency conversion
     */
    function performConversion() {
        const amount = parseFloat(fromAmount.value);
        if (isNaN(amount)) {
            toAmount.value = '';
            return;
        }
        
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        if (!exchangeRates[from] || !exchangeRates[to]) {
            toAmount.value = 'Exchange rate not available';
            return;
        }
        
        // Convert to USD first (base currency), then to target currency
        const amountInUSD = from === 'USD' ? amount : amount / exchangeRates[from];
        const convertedAmount = to === 'USD' ? amountInUSD : amountInUSD * exchangeRates[to];
        
        // Format the result with appropriate decimal places
        toAmount.value = formatCurrency(convertedAmount, to);
    }
    
    /**
     * Swap the from and to currencies
     */
    function swapCurrencies() {
        const tempCurrency = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tempCurrency;
        
        updateRateInfo();
        performConversion();
    }
    
    /**
     * Update the exchange rate information display
     */
    function updateRateInfo() {
        const from = fromCurrency.value;
        const to = toCurrency.value;
        
        if (!exchangeRates[from] || !exchangeRates[to]) {
            exchangeRateInfo.textContent = 'Exchange rate not available';
            return;
        }
        
        // Calculate the exchange rate between the two currencies
        const rate = from === 'USD' 
            ? exchangeRates[to] 
            : to === 'USD' 
                ? 1 / exchangeRates[from] 
                : exchangeRates[to] / exchangeRates[from];
        
        currentRateElement.textContent = formatCurrency(rate, to);
        exchangeRateInfo.innerHTML = `1 ${from} = <span id="current-rate">${formatCurrency(rate, to)}</span> ${to}`;
    }
    
    /**
     * Handle amount input to automatically perform conversion
     */
    function handleAmountInput() {
        performConversion();
    }
    
    /**
     * Format currency value based on currency code
     */
    function formatCurrency(value, currencyCode) {
        // Determine appropriate decimal places based on currency
        let decimalPlaces = 2;
        if (currencyCode === 'JPY' || currencyCode === 'KRW') {
            decimalPlaces = 0;
        } else if (value < 0.1) {
            decimalPlaces = 4;
        }
        
        return value.toFixed(decimalPlaces);
    }
    
    /**
     * Format date and time for display
     */
    function formatDateTime(date) {
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // 3D Currency Icon Animation
    // This would be implemented using Three.js to create a 3D currency symbol
    // that rotates or animates in some way
    function initCurrencyIcon() {
        // Get the container for the 3D icon
        const container = document.querySelector('.tool-icon');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Create a scene
        const scene = new THREE.Scene();
        
        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        
        // Create a renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);
        
        // Create a circle geometry (coin shape)
        const geometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
        
        // Create materials for the coin
        const material = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Gold color
            metalness: 0.7,
            roughness: 0.3,
        });
        
        // Create the coin mesh
        const coin = new THREE.Mesh(geometry, material);
        scene.add(coin);
        
        // Add a dollar sign to the coin
        const textGeometry = new THREE.TextGeometry('$', {
            font: new THREE.Font(), // This would need a font loaded
            size: 1,
            height: 0.1,
        });
        
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(-0.3, -0.5, 0.11);
        coin.add(text);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the coin
            coin.rotation.y += 0.01;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();
    }
    
    // Try to initialize the 3D icon, but don't break the app if it fails
    try {
        // Note: This is commented out because it requires a font to be loaded
        // and proper Three.js setup. In a real implementation, you would
        // uncomment this and ensure all dependencies are properly loaded.
        // initCurrencyIcon();
    } catch (error) {
        console.error('Error initializing 3D icon:', error);
    }
});