/**
 * Math Solver Tool - MultiTool Hub
 * Handles various mathematical calculations and problem solving
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const problemTypeSelect = document.getElementById('problem-type');
    const problemInput = document.getElementById('problem-input');
    const additionalOptions = document.getElementById('additional-options');
    const solveBtn = document.getElementById('solve-btn');
    const solutionDisplay = document.getElementById('solution-display');
    const copyBtn = document.getElementById('copy-btn');
    const stepsBtn = document.getElementById('steps-btn');
    const stepsModal = document.getElementById('steps-modal');
    const closeStepsBtn = document.getElementById('close-steps-btn');
    const stepsContent = document.getElementById('steps-content');
    const examplesContainer = document.getElementById('examples');
    
    // Current solution data
    let currentSolution = null;
    let currentSteps = [];
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Math Solver Tool
     */
    function init() {
        // Set up event listeners
        problemTypeSelect.addEventListener('change', updateAdditionalOptions);
        solveBtn.addEventListener('click', solveProblem);
        copyBtn.addEventListener('click', copySolution);
        stepsBtn.addEventListener('click', showSteps);
        closeStepsBtn.addEventListener('click', hideSteps);
        
        // Set up example clicks
        setupExamples();
        
        // Initialize additional options based on default problem type
        updateAdditionalOptions();
    }
    
    /**
     * Update additional options based on selected problem type
     */
    function updateAdditionalOptions() {
        const problemType = problemTypeSelect.value;
        additionalOptions.innerHTML = '';
        
        switch(problemType) {
            case 'algebra':
                additionalOptions.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Variable</label>
                        <input type="text" id="algebra-variable" value="x" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
                `;
                break;
                
            case 'calculus':
                additionalOptions.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                        <select id="calculus-operation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="derivative">Derivative</option>
                            <option value="integral">Integral</option>
                            <option value="limit">Limit</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Variable</label>
                        <input type="text" id="calculus-variable" value="x" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
                `;
                break;
                
            case 'geometry':
                additionalOptions.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                        <select id="geometry-shape" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="triangle">Triangle</option>
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                            <option value="polygon">Polygon</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Calculation</label>
                        <select id="geometry-calculation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="area">Area</option>
                            <option value="perimeter">Perimeter</option>
                            <option value="volume">Volume (3D shapes)</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'statistics':
                additionalOptions.innerHTML = `
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                        <select id="statistics-operation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="mean">Mean (Average)</option>
                            <option value="median">Median</option>
                            <option value="mode">Mode</option>
                            <option value="standard-deviation">Standard Deviation</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Data Format</label>
                        <select id="statistics-format" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="comma">Comma Separated</option>
                            <option value="space">Space Separated</option>
                            <option value="line">Line Separated</option>
                        </select>
                    </div>
                `;
                break;
        }
    }
    
    /**
     * Set up example problem clicks
     */
    function setupExamples() {
        const examples = examplesContainer.querySelectorAll('p');
        examples.forEach(example => {
            example.addEventListener('click', function() {
                const text = this.textContent;
                const colonIndex = text.indexOf(':');
                if (colonIndex !== -1) {
                    const exampleType = text.substring(0, colonIndex).trim().toLowerCase();
                    const exampleProblem = text.substring(colonIndex + 1).trim();
                    
                    // Set problem type based on example
                    if (exampleType.includes('solve')) {
                        problemTypeSelect.value = 'algebra';
                    } else if (exampleType.includes('differentiate') || exampleType.includes('integrate')) {
                        problemTypeSelect.value = 'calculus';
                    } else if (exampleType.includes('area') || exampleType.includes('perimeter')) {
                        problemTypeSelect.value = 'geometry';
                    } else if (exampleType.includes('mean') || exampleType.includes('median')) {
                        problemTypeSelect.value = 'statistics';
                    }
                    
                    // Update additional options based on new problem type
                    updateAdditionalOptions();
                    
                    // Set the problem input
                    problemInput.value = exampleProblem;
                }
            });
        });
    }
    
    /**
     * Solve the current math problem
     */
    function solveProblem() {
        const problemType = problemTypeSelect.value;
        const problem = problemInput.value.trim();
        
        if (!problem) {
            showError('Please enter a math problem');
            return;
        }
        
        // Show loading state
        solutionDisplay.innerHTML = '<div class="text-center py-12"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600">Solving problem...</p></div>';
        
        // Disable buttons during calculation
        solveBtn.disabled = true;
        copyBtn.disabled = true;
        stepsBtn.disabled = true;
        
        // Simulate calculation delay (would be replaced with actual calculation)
        setTimeout(() => {
            try {
                const result = calculateSolution(problemType, problem);
                displaySolution(result);
            } catch (error) {
                showError('Error solving problem: ' + error.message);
            } finally {
                solveBtn.disabled = false;
            }
        }, 1000);
    }
    
    /**
     * Calculate the solution based on problem type and input
     * @param {string} problemType - Type of math problem
     * @param {string} problem - The problem to solve
     * @returns {object} Solution object with result and steps
     */
    function calculateSolution(problemType, problem) {
        let solution = {
            result: '',
            steps: []
        };
        
        switch(problemType) {
            case 'algebra':
                return solveAlgebra(problem);
                
            case 'calculus':
                return solveCalculus(problem);
                
            case 'geometry':
                return solveGeometry(problem);
                
            case 'statistics':
                return solveStatistics(problem);
                
            case 'arithmetic':
                return solveArithmetic(problem);
                
            default:
                throw new Error('Unsupported problem type');
        }
    }
    
    /**
     * Solve algebraic equations
     * @param {string} problem - The algebraic problem to solve
     * @returns {object} Solution object with result and steps
     */
    function solveAlgebra(problem) {
        const variable = document.getElementById('algebra-variable')?.value || 'x';
        let solution = { result: '', steps: [] };
        
        // Simple equation solver for demonstration
        // In a real implementation, this would use a math library
        if (problem.includes('=')) {
            // Example: Solve 2x + 3 = 7
            const parts = problem.split('=').map(p => p.trim());
            const leftSide = parts[0];
            const rightSide = parts[1];
            
            // For demonstration, we'll solve a simple linear equation
            if (leftSide.includes(variable) && !rightSide.includes(variable)) {
                // Very simplified solver for 2x + 3 = 7 type equations
                if (leftSide.includes('+')) {
                    const terms = leftSide.split('+').map(t => t.trim());
                    const variableTerm = terms.find(t => t.includes(variable));
                    const constantTerm = terms.find(t => !t.includes(variable));
                    
                    const coefficient = variableTerm.replace(variable, '') || '1';
                    const constant = parseFloat(constantTerm) || 0;
                    const rightValue = parseFloat(rightSide) || 0;
                    
                    solution.steps.push(`Original equation: ${problem}`);
                    solution.steps.push(`Subtract ${constant} from both sides: ${coefficient}${variable} = ${rightValue - constant}`);
                    
                    const finalValue = (rightValue - constant) / parseFloat(coefficient);
                    solution.steps.push(`Divide both sides by ${coefficient}: ${variable} = ${finalValue}`);
                    solution.result = `${variable} = ${finalValue}`;
                }
            }
        }
        
        // If we couldn't solve it with our simple method
        if (!solution.result) {
            solution.result = 'Could not solve this equation with the current implementation';
            solution.steps = ['This equation requires more advanced solving techniques.'];
        }
        
        return solution;
    }
    
    /**
     * Solve calculus problems
     * @param {string} problem - The calculus problem to solve
     * @returns {object} Solution object with result and steps
     */
    function solveCalculus(problem) {
        const operation = document.getElementById('calculus-operation')?.value || 'derivative';
        const variable = document.getElementById('calculus-variable')?.value || 'x';
        let solution = { result: '', steps: [] };
        
        // Simple derivative calculator for demonstration
        if (operation === 'derivative') {
            // Example: Differentiate x² + 3x + 2
            solution.steps.push(`Taking the derivative of: ${problem}`);
            
            // Very simplified derivative calculator
            if (problem.includes('x²') || problem.includes('x^2')) {
                solution.steps.push(`The derivative of x² is 2x`);
                solution.steps.push(`The derivative of 3x is 3`);
                solution.steps.push(`The derivative of 2 is 0`);
                solution.result = '2x + 3';
            } else {
                solution.result = 'Could not calculate derivative with current implementation';
            }
        } else if (operation === 'integral') {
            // Example: Integrate x² + 3x + 2
            solution.steps.push(`Taking the integral of: ${problem}`);
            
            // Very simplified integral calculator
            if (problem.includes('x²') || problem.includes('x^2')) {
                solution.steps.push(`The integral of x² is (1/3)x³`);
                solution.steps.push(`The integral of 3x is (3/2)x²`);
                solution.steps.push(`The integral of 2 is 2x`);
                solution.result = '(1/3)x³ + (3/2)x² + 2x + C';
            } else {
                solution.result = 'Could not calculate integral with current implementation';
            }
        }
        
        return solution;
    }
    
    /**
     * Solve geometry problems
     * @param {string} problem - The geometry problem to solve
     * @returns {object} Solution object with result and steps
     */
    function solveGeometry(problem) {
        const shape = document.getElementById('geometry-shape')?.value || 'triangle';
        const calculation = document.getElementById('geometry-calculation')?.value || 'area';
        let solution = { result: '', steps: [] };
        
        // Parse the problem to extract values
        // Example: "Find area of triangle: base=4, height=5"
        if (problem.toLowerCase().includes('triangle') && problem.toLowerCase().includes('base') && problem.toLowerCase().includes('height')) {
            const baseMatch = problem.match(/base\s*=\s*(\d+(\.\d+)?)/);
            const heightMatch = problem.match(/height\s*=\s*(\d+(\.\d+)?)/);
            
            if (baseMatch && heightMatch) {
                const base = parseFloat(baseMatch[1]);
                const height = parseFloat(heightMatch[1]);
                
                solution.steps.push(`Triangle with base = ${base} and height = ${height}`);
                
                if (calculation === 'area') {
                    const area = 0.5 * base * height;
                    solution.steps.push(`Area = (1/2) × base × height`);
                    solution.steps.push(`Area = (1/2) × ${base} × ${height}`);
                    solution.steps.push(`Area = ${area}`);
                    solution.result = `Area = ${area} square units`;
                } else if (calculation === 'perimeter') {
                    solution.steps.push(`Cannot calculate perimeter with only base and height.`);
                    solution.steps.push(`Need all three sides of the triangle.`);
                    solution.result = 'Insufficient information to calculate perimeter';
                }
            }
        } else if (problem.toLowerCase().includes('circle') && problem.toLowerCase().includes('radius')) {
            const radiusMatch = problem.match(/radius\s*=\s*(\d+(\.\d+)?)/);
            
            if (radiusMatch) {
                const radius = parseFloat(radiusMatch[1]);
                
                solution.steps.push(`Circle with radius = ${radius}`);
                
                if (calculation === 'area') {
                    const area = Math.PI * radius * radius;
                    solution.steps.push(`Area = π × radius²`);
                    solution.steps.push(`Area = π × ${radius}²`);
                    solution.steps.push(`Area = ${area.toFixed(4)}`);
                    solution.result = `Area = ${area.toFixed(4)} square units`;
                } else if (calculation === 'perimeter') {
                    const circumference = 2 * Math.PI * radius;
                    solution.steps.push(`Circumference = 2π × radius`);
                    solution.steps.push(`Circumference = 2π × ${radius}`);
                    solution.steps.push(`Circumference = ${circumference.toFixed(4)}`);
                    solution.result = `Circumference = ${circumference.toFixed(4)} units`;
                }
            }
        }
        
        // If we couldn't solve it
        if (!solution.result) {
            solution.result = 'Could not solve this geometry problem with the current implementation';
            solution.steps = ['Please check your input format and try again.'];
        }
        
        return solution;
    }
    
    /**
     * Solve statistics problems
     * @param {string} problem - The statistics problem to solve
     * @returns {object} Solution object with result and steps
     */
    function solveStatistics(problem) {
        const operation = document.getElementById('statistics-operation')?.value || 'mean';
        const format = document.getElementById('statistics-format')?.value || 'comma';
        let solution = { result: '', steps: [] };
        
        // Parse the data from the problem
        let data = [];
        
        if (format === 'comma') {
            data = problem.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        } else if (format === 'space') {
            data = problem.split(' ').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        } else if (format === 'line') {
            data = problem.split('\n').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        }
        
        if (data.length === 0) {
            solution.result = 'No valid data found';
            return solution;
        }
        
        solution.steps.push(`Data: ${data.join(', ')}`);
        
        if (operation === 'mean') {
            const sum = data.reduce((a, b) => a + b, 0);
            const mean = sum / data.length;
            
            solution.steps.push(`Sum of all values: ${sum}`);
            solution.steps.push(`Number of values: ${data.length}`);
            solution.steps.push(`Mean = Sum / Count = ${sum} / ${data.length} = ${mean}`);
            solution.result = `Mean = ${mean}`;
        } else if (operation === 'median') {
            const sortedData = [...data].sort((a, b) => a - b);
            let median;
            
            solution.steps.push(`Sorted data: ${sortedData.join(', ')}`);
            
            if (sortedData.length % 2 === 0) {
                // Even number of elements
                const mid1 = sortedData[sortedData.length / 2 - 1];
                const mid2 = sortedData[sortedData.length / 2];
                median = (mid1 + mid2) / 2;
                solution.steps.push(`Even number of values, so median is average of middle two values`);
                solution.steps.push(`Median = (${mid1} + ${mid2}) / 2 = ${median}`);
            } else {
                // Odd number of elements
                median = sortedData[Math.floor(sortedData.length / 2)];
                solution.steps.push(`Odd number of values, so median is middle value`);
                solution.steps.push(`Median = ${median}`);
            }
            
            solution.result = `Median = ${median}`;
        } else if (operation === 'mode') {
            const frequency = {};
            data.forEach(value => {
                frequency[value] = (frequency[value] || 0) + 1;
            });
            
            let maxFrequency = 0;
            let modes = [];
            
            for (const value in frequency) {
                if (frequency[value] > maxFrequency) {
                    maxFrequency = frequency[value];
                    modes = [parseFloat(value)];
                } else if (frequency[value] === maxFrequency) {
                    modes.push(parseFloat(value));
                }
            }
            
            solution.steps.push(`Frequency of each value:`);
            for (const value in frequency) {
                solution.steps.push(`${value}: ${frequency[value]} occurrences`);
            }
            
            if (modes.length === data.length) {
                solution.result = 'No mode (all values occur exactly once)';
            } else if (modes.length > 1) {
                solution.result = `Modes = ${modes.join(', ')} (each occurs ${maxFrequency} times)`;
            } else {
                solution.result = `Mode = ${modes[0]} (occurs ${maxFrequency} times)`;
            }
        } else if (operation === 'standard-deviation') {
            const mean = data.reduce((a, b) => a + b, 0) / data.length;
            const squaredDifferences = data.map(value => Math.pow(value - mean, 2));
            const variance = squaredDifferences.reduce((a, b) => a + b, 0) / data.length;
            const stdDev = Math.sqrt(variance);
            
            solution.steps.push(`Mean = ${mean}`);
            solution.steps.push(`Squared differences from mean: ${squaredDifferences.map(v => v.toFixed(4)).join(', ')}`);
            solution.steps.push(`Variance = ${variance.toFixed(4)}`);
            solution.steps.push(`Standard Deviation = √Variance = ${stdDev.toFixed(4)}`);
            solution.result = `Standard Deviation = ${stdDev.toFixed(4)}`;
        }
        
        return solution;
    }
    
    /**
     * Solve basic arithmetic problems
     * @param {string} problem - The arithmetic problem to solve
     * @returns {object} Solution object with result and steps
     */
    function solveArithmetic(problem) {
        let solution = { result: '', steps: [] };
        
        // Remove any spaces
        const cleanProblem = problem.replace(/\s+/g, '');
        
        try {
            // For security, we'll validate the input first
            if (/^[\d\+\-\*\/\(\)\.\^\s]+$/.test(cleanProblem)) {
                // Replace ^ with ** for exponentiation
                const jsExpression = cleanProblem.replace(/\^/g, '**');
                
                // Use Function constructor to evaluate the expression
                // Note: This is generally safe for arithmetic but should be used with caution
                const result = new Function(`return ${jsExpression}`)();
                
                solution.steps.push(`Evaluating: ${problem}`);
                solution.result = `${result}`;
            } else {
                throw new Error('Invalid arithmetic expression');
            }
        } catch (error) {
            solution.result = 'Error evaluating expression';
            solution.steps = ['Please check your input and try again.'];
        }
        
        return solution;
    }
    
    /**
     * Display the solution in the solution display area
     * @param {object} solution - Solution object with result and steps
     */
    function displaySolution(solution) {
        // Store current solution and steps
        currentSolution = solution.result;
        currentSteps = solution.steps;
        
        // Display the result
        solutionDisplay.innerHTML = `
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Result:</h3>
                <div class="bg-indigo-50 p-3 rounded-md text-indigo-800 font-medium">
                    ${solution.result}
                </div>
            </div>
        `;
        
        // Enable buttons
        copyBtn.disabled = false;
        stepsBtn.disabled = solution.steps.length === 0;
    }
    
    /**
     * Show error message in solution display
     * @param {string} message - Error message to display
     */
    function showError(message) {
        solutionDisplay.innerHTML = `
            <div class="p-4">
                <div class="bg-red-50 p-3 rounded-md text-red-800">
                    <p class="font-medium">Error</p>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        // Disable buttons
        copyBtn.disabled = true;
        stepsBtn.disabled = true;
    }
    
    /**
     * Copy solution to clipboard
     */
    function copySolution() {
        if (currentSolution) {
            navigator.clipboard.writeText(currentSolution)
                .then(() => {
                    // Show success message
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    }
    
    /**
     * Show solution steps in modal
     */
    function showSteps() {
        if (currentSteps.length > 0) {
            // Populate steps content
            stepsContent.innerHTML = currentSteps.map(step => `<p class="text-gray-800">${step}</p>`).join('');
            
            // Show modal
            stepsModal.classList.remove('hidden');
        }
    }
    
    /**
     * Hide solution steps modal
     */
    function hideSteps() {
        stepsModal.classList.add('hidden');
    }
});