// Scientific Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const display = document.getElementById('calculator-display');
    const formulaDisplay = document.getElementById('formula-display');
    const historyList = document.getElementById('history-list');
    const calcButtons = document.querySelectorAll('.calc-btn');
    const memoryButtons = document.querySelectorAll('.memory-btn');
    const radDegButton = document.querySelector('[data-action="rad-deg"]');
    
    // Calculator State
    let currentInput = '0';
    let currentFormula = '';
    let calculationHistory = [];
    let memory = 0;
    let lastResult = 0;
    let isNewCalculation = true;
    let isInRadianMode = true; // true for radians, false for degrees
    
    // Initialize from localStorage if available
    initializeCalculator();
    
    // Add event listeners to calculator buttons
    calcButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
    
    // Add event listeners to memory buttons
    memoryButtons.forEach(button => {
        button.addEventListener('click', handleMemoryOperation);
    });
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    /**
     * Initialize calculator state and UI
     */
    function initializeCalculator() {
        // Try to load history from localStorage
        try {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                calculationHistory = JSON.parse(savedHistory);
                updateHistoryDisplay();
            }
            
            const savedMemory = localStorage.getItem('calculatorMemory');
            if (savedMemory) {
                memory = parseFloat(savedMemory);
            }
        } catch (e) {
            console.error('Error loading calculator data:', e);
        }
        
        updateDisplay();
    }
    
    /**
     * Handle calculator button clicks
     */
    function handleButtonClick(e) {
        const button = e.target;
        const action = button.getAttribute('data-action');
        const value = button.getAttribute('data-value');
        
        if (value) {
            inputDigit(value);
        } else if (action) {
            performAction(action);
        }
        
        updateDisplay();
    }
    
    /**
     * Handle keyboard input
     */
    function handleKeyboardInput(e) {
        // Number keys (0-9) and decimal
        if (/^[0-9.]$/.test(e.key)) {
            inputDigit(e.key);
        }
        
        // Operators
        switch (e.key) {
            case '+':
                performAction('add');
                break;
            case '-':
                performAction('subtract');
                break;
            case '*':
                performAction('multiply');
                break;
            case '/':
                performAction('divide');
                break;
            case 'Enter':
            case '=':
                performAction('equals');
                break;
            case 'Backspace':
                performAction('backspace');
                break;
            case 'Escape':
                performAction('clear');
                break;
            case '%':
                performAction('percent');
                break;
        }
        
        updateDisplay();
    }
    
    /**
     * Handle memory operations (MC, MR, M+, M-, MS)
     */
    function handleMemoryOperation(e) {
        const action = e.target.getAttribute('data-action');
        
        switch (action) {
            case 'mc': // Memory Clear
                memory = 0;
                break;
            case 'mr': // Memory Recall
                currentInput = memory.toString();
                isNewCalculation = true;
                break;
            case 'm+': // Memory Add
                memory += parseFloat(currentInput);
                isNewCalculation = true;
                break;
            case 'm-': // Memory Subtract
                memory -= parseFloat(currentInput);
                isNewCalculation = true;
                break;
            case 'ms': // Memory Store
                memory = parseFloat(currentInput);
                isNewCalculation = true;
                break;
        }
        
        // Save memory to localStorage
        localStorage.setItem('calculatorMemory', memory.toString());
        
        updateDisplay();
    }
    
    /**
     * Input a digit or decimal point
     */
    function inputDigit(digit) {
        if (isNewCalculation) {
            currentInput = digit === '.' ? '0.' : digit;
            isNewCalculation = false;
        } else {
            // Handle decimal point
            if (digit === '.' && currentInput.includes('.')) {
                return; // Prevent multiple decimal points
            }
            
            // Replace initial 0 unless it's a decimal point
            if (currentInput === '0' && digit !== '.') {
                currentInput = digit;
            } else {
                currentInput += digit;
            }
        }
    }
    
    /**
     * Perform calculator actions
     */
    function performAction(action) {
        const inputValue = parseFloat(currentInput);
        
        switch (action) {
            case 'clear':
                currentInput = '0';
                currentFormula = '';
                isNewCalculation = true;
                break;
                
            case 'backspace':
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                break;
                
            case 'equals':
                if (currentFormula) {
                    try {
                        // Prepare formula for evaluation
                        let formula = currentFormula + currentInput;
                        
                        // Store the formula for history
                        const displayFormula = formula;
                        
                        // Replace mathematical symbols for evaluation
                        formula = formula.replace(/×/g, '*').replace(/÷/g, '/');
                        
                        // Evaluate the expression
                        const result = eval(formula);
                        
                        // Add to history
                        addToHistory(displayFormula, result);
                        
                        // Update display
                        currentInput = result.toString();
                        lastResult = result;
                        currentFormula = '';
                    } catch (e) {
                        currentInput = 'Error';
                    }
                }
                isNewCalculation = true;
                break;
                
            case 'add':
                currentFormula += currentInput + ' + ';
                isNewCalculation = true;
                break;
                
            case 'subtract':
                currentFormula += currentInput + ' - ';
                isNewCalculation = true;
                break;
                
            case 'multiply':
                currentFormula += currentInput + ' × ';
                isNewCalculation = true;
                break;
                
            case 'divide':
                currentFormula += currentInput + ' ÷ ';
                isNewCalculation = true;
                break;
                
            case 'percent':
                currentInput = (inputValue / 100).toString();
                break;
                
            case 'square':
                currentInput = (inputValue * inputValue).toString();
                addToHistory(`${inputValue}²`, currentInput);
                isNewCalculation = true;
                break;
                
            case 'sqrt':
                if (inputValue >= 0) {
                    currentInput = Math.sqrt(inputValue).toString();
                    addToHistory(`√${inputValue}`, currentInput);
                } else {
                    currentInput = 'Error';
                }
                isNewCalculation = true;
                break;
                
            case 'reciprocal':
                if (inputValue !== 0) {
                    currentInput = (1 / inputValue).toString();
                    addToHistory(`1/${inputValue}`, currentInput);
                } else {
                    currentInput = 'Error';
                }
                isNewCalculation = true;
                break;
                
            case 'sin':
                const sinValue = isInRadianMode ? inputValue : (inputValue * Math.PI / 180);
                currentInput = Math.sin(sinValue).toString();
                addToHistory(`sin(${inputValue}${isInRadianMode ? '' : '°'})`, currentInput);
                isNewCalculation = true;
                break;
                
            case 'cos':
                const cosValue = isInRadianMode ? inputValue : (inputValue * Math.PI / 180);
                currentInput = Math.cos(cosValue).toString();
                addToHistory(`cos(${inputValue}${isInRadianMode ? '' : '°'})`, currentInput);
                isNewCalculation = true;
                break;
                
            case 'tan':
                const tanValue = isInRadianMode ? inputValue : (inputValue * Math.PI / 180);
                currentInput = Math.tan(tanValue).toString();
                addToHistory(`tan(${inputValue}${isInRadianMode ? '' : '°'})`, currentInput);
                isNewCalculation = true;
                break;
                
            case 'log':
                if (inputValue > 0) {
                    currentInput = Math.log10(inputValue).toString();
                    addToHistory(`log(${inputValue})`, currentInput);
                } else {
                    currentInput = 'Error';
                }
                isNewCalculation = true;
                break;
                
            case 'ln':
                if (inputValue > 0) {
                    currentInput = Math.log(inputValue).toString();
                    addToHistory(`ln(${inputValue})`, currentInput);
                } else {
                    currentInput = 'Error';
                }
                isNewCalculation = true;
                break;
                
            case 'power':
                currentFormula += currentInput + ' ^ ';
                isNewCalculation = true;
                break;
                
            case 'factorial':
                if (inputValue >= 0 && Number.isInteger(inputValue) && inputValue <= 170) {
                    currentInput = factorial(inputValue).toString();
                    addToHistory(`${inputValue}!`, currentInput);
                } else {
                    currentInput = 'Error';
                }
                isNewCalculation = true;
                break;
                
            case 'pi':
                currentInput = Math.PI.toString();
                isNewCalculation = true;
                break;
                
            case 'e':
                currentInput = Math.E.toString();
                isNewCalculation = true;
                break;
                
            case 'abs':
                currentInput = Math.abs(inputValue).toString();
                addToHistory(`|${inputValue}|`, currentInput);
                isNewCalculation = true;
                break;
                
            case 'exp':
                currentInput += 'e+';
                break;
                
            case 'toggle-sign':
                currentInput = (inputValue * -1).toString();
                break;
                
            case 'rad-deg':
                isInRadianMode = !isInRadianMode;
                radDegButton.textContent = isInRadianMode ? 'RAD' : 'DEG';
                break;
        }
    }
    
    /**
     * Calculate factorial
     */
    function factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    /**
     * Add calculation to history
     */
    function addToHistory(formula, result) {
        // Format the result to avoid extremely long decimals
        const formattedResult = parseFloat(result).toPrecision(10).replace(/\.?0+$/, '');
        
        calculationHistory.unshift({
            formula: formula,
            result: formattedResult,
            timestamp: new Date().toISOString()
        });
        
        // Limit history to 20 items
        if (calculationHistory.length > 20) {
            calculationHistory.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        
        // Update history display
        updateHistoryDisplay();
    }
    
    /**
     * Update the calculator display
     */
    function updateDisplay() {
        // Format the display value
        let displayValue = currentInput;
        
        // Handle error state
        if (displayValue === 'Error') {
            display.textContent = 'Error';
            return;
        }
        
        // Format large numbers with commas
        if (!isNaN(parseFloat(displayValue)) && displayValue !== '0.') {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-7 && num !== 0)) {
                // Use scientific notation for very large or small numbers
                displayValue = num.toExponential(6);
            } else {
                // Format with commas and limit decimal places
                const parts = displayValue.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                displayValue = parts.join('.');
            }
        }
        
        display.textContent = displayValue;
        formulaDisplay.textContent = currentFormula;
    }
    
    /**
     * Update the history display
     */
    function updateHistoryDisplay() {
        if (calculationHistory.length === 0) {
            historyList.innerHTML = '<p class="text-gray-500 text-center italic">Your calculation history will appear here.</p>';
            return;
        }
        
        historyList.innerHTML = '';
        
        calculationHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'p-2 border-b border-gray-100 hover:bg-gray-50';
            
            const formula = document.createElement('div');
            formula.className = 'text-gray-600 text-sm';
            formula.textContent = item.formula;
            
            const result = document.createElement('div');
            result.className = 'text-gray-800 font-semibold';
            result.textContent = '= ' + item.result;
            
            historyItem.appendChild(formula);
            historyItem.appendChild(result);
            
            // Add click event to reuse the result
            historyItem.addEventListener('click', () => {
                currentInput = item.result;
                isNewCalculation = true;
                updateDisplay();
            });
            
            historyList.appendChild(historyItem);
        });
    }
});