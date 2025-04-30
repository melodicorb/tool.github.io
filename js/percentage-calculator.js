/**
 * Percentage Calculator JavaScript
 * Handles all functionality for the percentage calculator tool
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calcMode = document.getElementById('calc-mode');
    const calculatorSections = document.querySelectorAll('.calculator-section');
    
    // Basic percentage calculator elements
    const percentValue = document.getElementById('percent-value');
    const baseValue = document.getElementById('base-value');
    const calculateBasicBtn = document.getElementById('calculate-basic');
    const basicResult = document.getElementById('basic-result');
    
    // Percentage increase/decrease calculator elements
    const originalValue = document.getElementById('original-value');
    const newValue = document.getElementById('new-value');
    const calculateIncreaseBtn = document.getElementById('calculate-increase');
    const increaseResult = document.getElementById('increase-result');
    
    // Percentage difference calculator elements
    const value1 = document.getElementById('value-1');
    const value2 = document.getElementById('value-2');
    const calculateDifferenceBtn = document.getElementById('calculate-difference');
    const differenceResult = document.getElementById('difference-result');
    
    // History elements
    const historyList = document.getElementById('history-list');
    
    // Initialize history from localStorage
    let calculationHistory = JSON.parse(localStorage.getItem('percentageCalculatorHistory')) || [];
    
    // Update history display
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
                <p class="font-medium">${item.mode}</p>
                <p class="text-gray-600">${item.calculation}</p>
                <p class="text-indigo-600 font-bold">${item.result}</p>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    // Save calculation to history
    function saveToHistory(mode, calculation, result) {
        const historyItem = {
            mode,
            calculation,
            result,
            timestamp: new Date().toISOString()
        };
        
        calculationHistory.push(historyItem);
        
        // Limit history to 20 items
        if (calculationHistory.length > 20) {
            calculationHistory.shift();
        }
        
        // Save to localStorage
        localStorage.setItem('percentageCalculatorHistory', JSON.stringify(calculationHistory));
        
        // Update display
        updateHistoryDisplay();
    }
    
    // Format number with commas and fixed decimal places
    function formatNumber(num, decimals = 2) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    }
    
    // Show calculator section based on selected mode
    function showCalculator(mode) {
        calculatorSections.forEach(section => {
            section.classList.add('hidden');
        });
        
        document.getElementById(`${mode}-calculator`).classList.remove('hidden');
    }
    
    // Calculate basic percentage
    function calculateBasicPercentage() {
        const percent = parseFloat(percentValue.value);
        const base = parseFloat(baseValue.value);
        
        if (isNaN(percent) || isNaN(base)) {
            basicResult.textContent = 'Please enter valid numbers';
            return;
        }
        
        const result = (percent / 100) * base;
        basicResult.textContent = formatNumber(result);
        
        saveToHistory(
            'Basic Percentage',
            `${percent}% of ${formatNumber(base)}`,
            formatNumber(result)
        );
    }
    
    // Calculate percentage increase/decrease
    function calculatePercentageChange() {
        const original = parseFloat(originalValue.value);
        const newVal = parseFloat(newValue.value);
        
        if (isNaN(original) || isNaN(newVal)) {
            increaseResult.textContent = 'Please enter valid numbers';
            return;
        }
        
        if (original === 0) {
            increaseResult.textContent = 'Original value cannot be zero';
            return;
        }
        
        const change = ((newVal - original) / Math.abs(original)) * 100;
        const changeType = change >= 0 ? 'increase' : 'decrease';
        increaseResult.textContent = `${formatNumber(Math.abs(change))}% ${changeType}`;
        
        saveToHistory(
            'Percentage Change',
            `From ${formatNumber(original)} to ${formatNumber(newVal)}`,
            `${formatNumber(Math.abs(change))}% ${changeType}`
        );
    }
    
    // Calculate percentage difference
    function calculatePercentageDifference() {
        const val1 = parseFloat(value1.value);
        const val2 = parseFloat(value2.value);
        
        if (isNaN(val1) || isNaN(val2)) {
            differenceResult.textContent = 'Please enter valid numbers';
            return;
        }
        
        if (val1 === 0 && val2 === 0) {
            differenceResult.textContent = 'Both values cannot be zero';
            return;
        }
        
        const avg = (Math.abs(val1) + Math.abs(val2)) / 2;
        const diff = Math.abs(val1 - val2);
        const percentDiff = (diff / avg) * 100;
        
        differenceResult.textContent = `${formatNumber(percentDiff)}%`;
        
        saveToHistory(
            'Percentage Difference',
            `Between ${formatNumber(val1)} and ${formatNumber(val2)}`,
            `${formatNumber(percentDiff)}%`
        );
    }
    
    // Event Listeners
    calcMode.addEventListener('change', function() {
        showCalculator(this.value);
    });
    
    calculateBasicBtn.addEventListener('click', calculateBasicPercentage);
    calculateIncreaseBtn.addEventListener('click', calculatePercentageChange);
    calculateDifferenceBtn.addEventListener('click', calculatePercentageDifference);
    
    // Handle Enter key press in input fields
    percentValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateBasicPercentage();
    });
    
    baseValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateBasicPercentage();
    });
    
    originalValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePercentageChange();
    });
    
    newValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePercentageChange();
    });
    
    value1.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePercentageDifference();
    });
    
    value2.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculatePercentageDifference();
    });
    
    // Initialize
    updateHistoryDisplay();
    showCalculator('basic');
});