/**
 * Animation Avatar Maker Tool - MultiTool Hub
 * Provides functionality to create custom animated avatars with various features and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const avatarPreview = document.getElementById('avatar-preview');
    const characterButtons = document.querySelectorAll('.character-btn');
    const faceShape = document.getElementById('face-shape');
    const skinColor = document.getElementById('skin-color');
    const hairStyle = document.getElementById('hair-style');
    const hairColor = document.getElementById('hair-color');
    const eyes = document.getElementById('eyes');
    const eyeColor = document.getElementById('eye-color');
    const mouth = document.getElementById('mouth');
    const accessories = document.getElementById('accessories');
    const animationType = document.getElementById('animation-type');
    const animationSpeed = document.getElementById('animation-speed');
    const speedDisplay = document.getElementById('speed-display');
    const bgColor = document.getElementById('bg-color');
    const bgStyle = document.getElementById('bg-style');
    const btnReset = document.getElementById('btn-reset');
    const btnDownload = document.getElementById('btn-download');
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    
    // Avatar state
    let avatarState = {
        character: 'human',
        faceShape: 'round',
        skinColor: '#F8D5C2',
        hairStyle: 'short',
        hairColor: '#4A3728',
        eyes: 'round',
        eyeColor: '#3D85C6',
        mouth: 'smile',
        accessories: 'none',
        animationType: 'idle',
        animationSpeed: 5,
        bgColor: '#FFFFFF',
        bgStyle: 'solid',
        isAnimating: false
    };
    
    // Animation frame ID for cancellation
    let animationFrameId = null;
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Animation Avatar Maker Tool
     */
    function init() {
        // Set initial values
        faceShape.value = avatarState.faceShape;
        skinColor.value = avatarState.skinColor;
        hairStyle.value = avatarState.hairStyle;
        hairColor.value = avatarState.hairColor;
        eyes.value = avatarState.eyes;
        eyeColor.value = avatarState.eyeColor;
        mouth.value = avatarState.mouth;
        accessories.value = avatarState.accessories;
        animationType.value = avatarState.animationType;
        animationSpeed.value = avatarState.animationSpeed;
        speedDisplay.textContent = avatarState.animationSpeed;
        bgColor.value = avatarState.bgColor;
        bgStyle.value = avatarState.bgStyle;
        
        // Set up event listeners
        characterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const character = this.getAttribute('data-character');
                updateCharacter(character);
                
                // Update active state
                characterButtons.forEach(btn => btn.classList.remove('bg-gray-200'));
                this.classList.add('bg-gray-200');
            });
        });
        
        faceShape.addEventListener('change', updateFaceShape);
        skinColor.addEventListener('input', updateSkinColor);
        hairStyle.addEventListener('change', updateHairStyle);
        hairColor.addEventListener('input', updateHairColor);
        eyes.addEventListener('change', updateEyes);
        eyeColor.addEventListener('input', updateEyeColor);
        mouth.addEventListener('change', updateMouth);
        accessories.addEventListener('change', updateAccessories);
        animationType.addEventListener('change', updateAnimationType);
        animationSpeed.addEventListener('input', updateAnimationSpeed);
        bgColor.addEventListener('input', updateBgColor);
        bgStyle.addEventListener('change', updateBgStyle);
        btnReset.addEventListener('click', resetAvatar);
        btnDownload.addEventListener('click', downloadAvatar);
        btnPlay.addEventListener('click', playAnimation);
        btnPause.addEventListener('click', pauseAnimation);
        
        // Initial render
        renderAvatar();
    }
    
    /**
     * Update character type
     */
    function updateCharacter(character) {
        avatarState.character = character;
        renderAvatar();
    }
    
    /**
     * Update face shape
     */
    function updateFaceShape() {
        avatarState.faceShape = faceShape.value;
        renderAvatar();
    }
    
    /**
     * Update skin color
     */
    function updateSkinColor() {
        avatarState.skinColor = skinColor.value;
        renderAvatar();
    }
    
    /**
     * Update hair style
     */
    function updateHairStyle() {
        avatarState.hairStyle = hairStyle.value;
        renderAvatar();
    }
    
    /**
     * Update hair color
     */
    function updateHairColor() {
        avatarState.hairColor = hairColor.value;
        renderAvatar();
    }
    
    /**
     * Update eyes
     */
    function updateEyes() {
        avatarState.eyes = eyes.value;
        renderAvatar();
    }
    
    /**
     * Update eye color
     */
    function updateEyeColor() {
        avatarState.eyeColor = eyeColor.value;
        renderAvatar();
    }
    
    /**
     * Update mouth
     */
    function updateMouth() {
        avatarState.mouth = mouth.value;
        renderAvatar();
    }
    
    /**
     * Update accessories
     */
    function updateAccessories() {
        avatarState.accessories = accessories.value;
        renderAvatar();
    }
    
    /**
     * Update animation type
     */
    function updateAnimationType() {
        avatarState.animationType = animationType.value;
        if (avatarState.isAnimating) {
            pauseAnimation();
            playAnimation();
        } else {
            renderAvatar();
        }
    }
    
    /**
     * Update animation speed
     */
    function updateAnimationSpeed() {
        avatarState.animationSpeed = parseInt(animationSpeed.value);
        speedDisplay.textContent = avatarState.animationSpeed;
        if (avatarState.isAnimating) {
            pauseAnimation();
            playAnimation();
        }
    }
    
    /**
     * Update background color
     */
    function updateBgColor() {
        avatarState.bgColor = bgColor.value;
        renderAvatar();
    }
    
    /**
     * Update background style
     */
    function updateBgStyle() {
        avatarState.bgStyle = bgStyle.value;
        renderAvatar();
    }
    
    /**
     * Reset avatar to default settings
     */
    function resetAvatar() {
        // Reset to default values
        avatarState = {
            character: 'human',
            faceShape: 'round',
            skinColor: '#F8D5C2',
            hairStyle: 'short',
            hairColor: '#4A3728',
            eyes: 'round',
            eyeColor: '#3D85C6',
            mouth: 'smile',
            accessories: 'none',
            animationType: 'idle',
            animationSpeed: 5,
            bgColor: '#FFFFFF',
            bgStyle: 'solid',
            isAnimating: false
        };
        
        // Update UI elements
        characterButtons.forEach(btn => {
            if (btn.getAttribute('data-character') === 'human') {
                btn.classList.add('bg-gray-200');
            } else {
                btn.classList.remove('bg-gray-200');
            }
        });
        
        faceShape.value = avatarState.faceShape;
        skinColor.value = avatarState.skinColor;
        hairStyle.value = avatarState.hairStyle;
        hairColor.value = avatarState.hairColor;
        eyes.value = avatarState.eyes;
        eyeColor.value = avatarState.eyeColor;
        mouth.value = avatarState.mouth;
        accessories.value = avatarState.accessories;
        animationType.value = avatarState.animationType;
        animationSpeed.value = avatarState.animationSpeed;
        speedDisplay.textContent = avatarState.animationSpeed;
        bgColor.value = avatarState.bgColor;
        bgStyle.value = avatarState.bgStyle;
        
        // Stop any running animation
        pauseAnimation();
        
        // Render the reset avatar
        renderAvatar();
    }
    
    /**
     * Play animation
     */
    function playAnimation() {
        if (avatarState.isAnimating) return;
        
        avatarState.isAnimating = true;
        btnPlay.classList.add('bg-green-600');
        btnPlay.classList.remove('bg-green-500');
        btnPause.classList.add('bg-yellow-500');
        btnPause.classList.remove('bg-yellow-600');
        
        // Start animation loop
        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            
            // Calculate animation frame based on speed and time
            const frameDuration = 1000 / avatarState.animationSpeed;
            const frame = Math.floor(elapsed / frameDuration) % 4; // 4 frames per animation cycle
            
            // Render the current animation frame
            renderAnimationFrame(frame);
            
            // Continue animation loop
            if (avatarState.isAnimating) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    /**
     * Pause animation
     */
    function pauseAnimation() {
        if (!avatarState.isAnimating) return;
        
        avatarState.isAnimating = false;
        btnPlay.classList.remove('bg-green-600');
        btnPlay.classList.add('bg-green-500');
        btnPause.classList.remove('bg-yellow-500');
        btnPause.classList.add('bg-yellow-600');
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // Reset to static render
        renderAvatar();
    }
    
    /**
     * Render a specific animation frame
     */
    function renderAnimationFrame(frame) {
        // Clear previous content
        while (avatarPreview.firstChild) {
            avatarPreview.removeChild(avatarPreview.firstChild);
        }
        
        // Set background
        avatarPreview.style.backgroundColor = avatarState.bgColor;
        if (avatarState.bgStyle === 'gradient') {
            avatarPreview.style.background = `linear-gradient(135deg, ${avatarState.bgColor}, #FFFFFF)`;
        } else if (avatarState.bgStyle === 'pattern') {
            avatarPreview.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")';
            avatarPreview.style.backgroundColor = avatarState.bgColor;
        } else if (avatarState.bgStyle === 'transparent') {
            avatarPreview.style.background = 'transparent';
        }
        
        // Create SVG element for the avatar
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 100 100");
        
        // Apply animation transformations based on type and frame
        let transform = "";
        switch (avatarState.animationType) {
            case 'idle':
                // Subtle breathing animation
                const scaleFactors = [1, 1.02, 1, 0.98];
                transform = `scale(${scaleFactors[frame]})`;
                break;
            case 'wave':
                // Waving hand animation
                // This would be more complex in a real implementation
                const rotations = [0, 15, 30, 15];
                // We'd add a hand element and rotate it
                break;
            case 'jump':
                // Jumping animation
                const translations = [0, -5, -10, -5];
                transform = `translateY(${translations[frame]}px)`;
                break;
            case 'dance':
                // Dancing animation
                const danceTransforms = [
                    'rotate(0deg)',
                    'rotate(5deg) translateX(2px)',
                    'rotate(0deg)',
                    'rotate(-5deg) translateX(-2px)'
                ];
                transform = danceTransforms[frame];
                break;
            case 'spin':
                // Spinning animation
                const spinDegrees = [0, 90, 180, 270];
                transform = `rotate(${spinDegrees[frame]}deg)`;
                break;
        }
        
        // Create a group for the entire avatar with animation transform
        const avatarGroup = document.createElementNS(svgNS, "g");
        avatarGroup.setAttribute("transform", transform);
        avatarGroup.setAttribute("transform-origin", "center");
        
        // Draw the avatar based on the character type and features
        drawAvatar(svgNS, avatarGroup);
        
        // Add the avatar group to the SVG
        svg.appendChild(avatarGroup);
        
        // Add the SVG to the preview container
        avatarPreview.appendChild(svg);
    }
    
    /**
     * Render the avatar based on current state
     */
    function renderAvatar() {
        // Clear previous content
        while (avatarPreview.firstChild) {
            avatarPreview.removeChild(avatarPreview.firstChild);
        }
        
        // Set background
        avatarPreview.style.backgroundColor = avatarState.bgColor;
        if (avatarState.bgStyle === 'gradient') {
            avatarPreview.style.background = `linear-gradient(135deg, ${avatarState.bgColor}, #FFFFFF)`;
        } else if (avatarState.bgStyle === 'pattern') {
            avatarPreview.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")';
            avatarPreview.style.backgroundColor = avatarState.bgColor;
        } else if (avatarState.bgStyle === 'transparent') {
            avatarPreview.style.background = 'transparent';
        }
        
        // Create SVG element for the avatar
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 100 100");
        
        // Create a group for the entire avatar
        const avatarGroup = document.createElementNS(svgNS, "g");
        
        // Draw the avatar based on the character type and features
        drawAvatar(svgNS, avatarGroup);
        
        // Add the avatar group to the SVG
        svg.appendChild(avatarGroup);
        
        // Add the SVG to the preview container
        avatarPreview.appendChild(svg);
    }
    
    /**
     * Draw the avatar based on current state
     */
    function drawAvatar(svgNS, parent) {
        switch (avatarState.character) {
            case 'human':
                drawHumanAvatar(svgNS, parent);
                break;
            case 'robot':
                drawRobotAvatar(svgNS, parent);
                break;
            case 'animal':
                drawAnimalAvatar(svgNS, parent);
                break;
            case 'fantasy':
                drawFantasyAvatar(svgNS, parent);
                break;
        }
    }
    
    /**
     * Draw human avatar
     */
    function drawHumanAvatar(svgNS, parent) {
        // Draw face/head based on face shape
        let head;
        switch (avatarState.faceShape) {
            case 'round':
                head = document.createElementNS(svgNS, "circle");
                head.setAttribute("cx", "50");
                head.setAttribute("cy", "50");
                head.setAttribute("r", "25");
                break;
            case 'oval':
                head = document.createElementNS(svgNS, "ellipse");
                head.setAttribute("cx", "50");
                head.setAttribute("cy", "50");
                head.setAttribute("rx", "20");
                head.setAttribute("ry", "25");
                break;
            case 'square':
                head = document.createElementNS(svgNS, "rect");
                head.setAttribute("x", "30");
                head.setAttribute("y", "30");
                head.setAttribute("width", "40");
                head.setAttribute("height", "40");
                head.setAttribute("rx", "5");
                break;
            case 'heart':
                head = document.createElementNS(svgNS, "path");
                head.setAttribute("d", "M50,85 C70,65 90,50 90,35 C90,20 75,15 65,15 C55,15 50,25 50,25 C50,25 45,15 35,15 C25,15 10,20 10,35 C10,50 30,65 50,85 Z");
                head.setAttribute("transform", "scale(0.5) translate(50, 15)");
                break;
            case 'diamond':
                head = document.createElementNS(svgNS, "polygon");
                head.setAttribute("points", "50,25 75,50 50,75 25,50");
                break;
        }
        head.setAttribute("fill", avatarState.skinColor);
        parent.appendChild(head);
        
        // Draw hair based on hair style
        let hair;
        switch (avatarState.hairStyle) {
            case 'short':
                hair = document.createElementNS(svgNS, "path");
                hair.setAttribute("d", "M25,45 C25,25 40,15 50,15 C60,15 75,25 75,45");
                hair.setAttribute("fill", avatarState.hairColor);
                hair.setAttribute("stroke", "none");
                break;
            case 'long':
                hair = document.createElementNS(svgNS, "path");
                hair.setAttribute("d", "M25,45 C25,25 40,15 50,15 C60,15 75,25 75,45 L75,70 C65,80 35,80 25,70 Z");
                hair.setAttribute("fill", avatarState.hairColor);
                hair.setAttribute("stroke", "none");
                break;
            case 'curly':
                hair = document.createElementNS(svgNS, "path");
                hair.setAttribute("d", "M25,50 C15,30 25,15 50,15 C75,15 85,30 75,50 C85,40 85,60 75,70 C65,80 35,80 25,70 C15,60 15,40 25,50 Z");
                hair.setAttribute("fill", avatarState.hairColor);
                hair.setAttribute("stroke", "none");
                break;
            case 'mohawk':
                hair = document.createElementNS(svgNS, "path");
                hair.setAttribute("d", "M45,15 L55,15 L55,40 L45,40 Z");
                hair.setAttribute("fill", avatarState.hairColor);
                hair.setAttribute("stroke", "none");
                break;
            // Bald has no hair
        }
        if (hair && avatarState.hairStyle !== 'bald') {
            parent.appendChild(hair);
        }
        
        // Draw eyes
        let leftEye, rightEye;
        switch (avatarState.eyes) {
            case 'round':
                leftEye = document.createElementNS(svgNS, "circle");
                leftEye.setAttribute("cx", "40");
                leftEye.setAttribute("cy", "45");
                leftEye.setAttribute("r", "5");
                
                rightEye = document.createElementNS(svgNS, "circle");
                rightEye.setAttribute("cx", "60");
                rightEye.setAttribute("cy", "45");
                rightEye.setAttribute("r", "5");
                break;
            case 'almond':
                leftEye = document.createElementNS(svgNS, "ellipse");
                leftEye.setAttribute("cx", "40");
                leftEye.setAttribute("cy", "45");
                leftEye.setAttribute("rx", "6");
                leftEye.setAttribute("ry", "4");
                
                rightEye = document.createElementNS(svgNS, "ellipse");
                rightEye.setAttribute("cx", "60");
                rightEye.setAttribute("cy", "45");
                rightEye.setAttribute("rx", "6");
                rightEye.setAttribute("ry", "4");
                break;
            case 'wide':
                leftEye = document.createElementNS(svgNS, "ellipse");
                leftEye.setAttribute("cx", "40");
                leftEye.setAttribute("cy", "45");
                leftEye.setAttribute("rx", "7");
                leftEye.setAttribute("ry", "5");
                
                rightEye = document.createElementNS(svgNS, "ellipse");
                rightEye.setAttribute("cx", "60");
                rightEye.setAttribute("cy", "45");
                rightEye.setAttribute("rx", "7");
                rightEye.setAttribute("ry", "5");
                break;
            case 'narrow':
                leftEye = document.createElementNS(svgNS, "ellipse");
                leftEye.setAttribute("cx", "40");
                leftEye.setAttribute("cy", "45");
                leftEye.setAttribute("rx", "5");
                leftEye.setAttribute("ry", "3");
                
                rightEye = document.createElementNS(svgNS, "ellipse");
                rightEye.setAttribute("cx", "60");
                rightEye.setAttribute("cy", "45");
                rightEye.setAttribute("rx", "5");
                rightEye.setAttribute("ry", "3");
                break;
            case 'anime':
                leftEye = document.createElementNS(svgNS, "path");
                leftEye.setAttribute("d", "M35,45 Q40,40 45,45 Q40,50 35,45 Z");
                
                rightEye = document.createElementNS(svgNS, "path");
                rightEye.setAttribute("d", "M55,45 Q60,40 65,45 Q60,50 55,45 Z");
                break;
        }
        leftEye.setAttribute("fill", avatarState.eyeColor);
        rightEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(leftEye);
        parent.appendChild(rightEye);
        
        // Draw mouth
        let mouth;
        switch (avatarState.mouth) {
            case 'smile':
                mouth = document.createElementNS(svgNS, "path");
                mouth.setAttribute("d", "M40,60 Q50,70 60,60");
                mouth.setAttribute("fill", "none");
                mouth.setAttribute("stroke", "#000000");
                mouth.setAttribute("stroke-width", "2");
                break;
            case 'neutral':
                mouth = document.createElementNS(svgNS, "line");
                mouth.setAttribute("x1", "40");
                mouth.setAttribute("y1", "60");
                mouth.setAttribute("x2", "60");
                mouth.setAttribute("y2", "60");
                mouth.setAttribute("stroke", "#000000");
                mouth.setAttribute("stroke-width", "2");
                break;
            case 'frown':
                mouth = document.createElementNS(svgNS, "path");
                mouth.setAttribute("d", "M40,65 Q50,55 60,65");
                mouth.setAttribute("fill", "none");
                mouth.setAttribute("stroke", "#000000");
                mouth.setAttribute("stroke-width", "2");
                break;
            case 'open':
                mouth = document.createElementNS(svgNS, "ellipse");
                mouth.setAttribute("cx", "50");
                mouth.setAttribute("cy", "60");
                mouth.setAttribute("rx", "10");
                mouth.setAttribute("ry", "5");
                mouth.setAttribute("fill", "#000000");
                break;
            case 'smirk':
                mouth = document.createElementNS(svgNS, "path");
                mouth.setAttribute("d", "M40,60 Q45,65 60,60");
                mouth.setAttribute("fill", "none");
                mouth.setAttribute("stroke", "#000000");
                mouth.setAttribute("stroke-width", "2");
                break;
        }
        parent.appendChild(mouth);
        
        // Draw accessories
        if (avatarState.accessories !== 'none') {
            let accessory;
            switch (avatarState.accessories) {
                case 'glasses':
                    accessory = document.createElementNS(svgNS, "g");
                    
                    const leftLens = document.createElementNS(svgNS, "circle");
                    leftLens.setAttribute("cx", "40");
                    leftLens.setAttribute("cy", "45");
                    leftLens.setAttribute("r", "7");
                    leftLens.setAttribute("fill", "none");
                    leftLens.setAttribute("stroke", "#000000");
                    leftLens.setAttribute("stroke-width", "1.5");
                    
                    const rightLens = document.createElementNS(svgNS, "circle");
                    rightLens.setAttribute("cx", "60");
                    rightLens.setAttribute("cy", "45");
                    rightLens.setAttribute("r", "7");
                    rightLens.setAttribute("fill", "none");
                    rightLens.setAttribute("stroke", "#000000");
                    rightLens.setAttribute("stroke-width", "1.5");
                    
                    const bridge = document.createElementNS(svgNS, "line");
                    bridge.setAttribute("x1", "47");
                    bridge.setAttribute("y1", "45");
                    bridge.setAttribute("x2", "53");
                    bridge.setAttribute("y2", "45");
                    bridge.setAttribute("stroke", "#000000");
                    bridge.setAttribute("stroke-width", "1.5");
                    
                    accessory.appendChild(leftLens);
                    accessory.appendChild(rightLens);
                    accessory.appendChild(bridge);
                    break;
                case 'hat':
                    accessory = document.createElementNS(svgNS, "path");
                    accessory.setAttribute("d", "M30,30 L70,30 L65,15 L35,15 Z");
                    accessory.setAttribute("fill", "#333333");
                    break;
                case 'earrings':
                    accessory = document.createElementNS(svgNS, "g");
                    
                    const leftEarring = document.createElementNS(svgNS, "circle");
                    leftEarring.setAttribute("cx", "25");
                    leftEarring.setAttribute("cy", "50");
                    leftEarring.setAttribute("r", "2");
                    leftEarring.setAttribute("fill", "#FFD700");
                    
                    const rightEarring = document.createElementNS(svgNS, "circle");
                    rightEarring.setAttribute("cx", "75");
                    rightEarring.setAttribute("cy", "50");
                    rightEarring.setAttribute("r", "2");
                    rightEarring.setAttribute("fill", "#FFD700");
                    
                    accessory.appendChild(leftEarring);
                    accessory.appendChild(rightEarring);
                    break;
                case 'mask':
                    accessory = document.createElementNS(svgNS, "path");
                    accessory.setAttribute("d", "M35,45 Q50,55 65,45 Q65,55 50,60 Q35,55 35,45 Z");
                    accessory.setAttribute("fill", "#CCCCCC");
                    accessory.setAttribute("stroke", "#999999");
                    accessory.setAttribute("stroke-width", "1");
                    break;
            }
            parent.appendChild(accessory);
        }
    }
    
    /**
     * Draw robot avatar
     */
    function drawRobotAvatar(svgNS, parent) {
        // Robot head (rectangular with rounded corners)
        const head = document.createElementNS(svgNS, "rect");
        head.setAttribute("x", "30");
        head.setAttribute("y", "30");
        head.setAttribute("width", "40");
        head.setAttribute("height", "40");
        head.setAttribute("rx", "5");
        head.setAttribute("fill", avatarState.skinColor);
        head.setAttribute("stroke", "#333333");
        head.setAttribute("stroke-width", "2");
        parent.appendChild(head);
        
        // Antenna
        const antenna = document.createElementNS(svgNS, "line");
        antenna.setAttribute("x1", "50");
        antenna.setAttribute("y1", "30");
        antenna.setAttribute("x2", "50");
        antenna.setAttribute("y2", "20");
        antenna.setAttribute("stroke", "#333333");
        antenna.setAttribute("stroke-width", "2");
        parent.appendChild(antenna);
        
        const antennaTip = document.createElementNS(svgNS, "circle");
        antennaTip.setAttribute("cx", "50");
        antennaTip.setAttribute("cy", "18");
        antennaTip.setAttribute("r", "3");
        antennaTip.setAttribute("fill", "#FF0000");
        parent.appendChild(antennaTip);
        
        // Robot eyes
        const leftEye = document.createElementNS(svgNS, "rect");
        leftEye.setAttribute("x", "38");
        leftEye.setAttribute("y", "42");
        leftEye.setAttribute("width", "8");
        leftEye.setAttribute("height", "5");
        leftEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(leftEye);
        
        const rightEye = document.createElementNS(svgNS, "rect");
        rightEye.setAttribute("x", "54");
        rightEye.setAttribute("y", "42");
        rightEye.setAttribute("width", "8");
        rightEye.setAttribute("height", "5");
        rightEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(rightEye);
        
        // Robot mouth
        const mouth = document.createElementNS(svgNS, "rect");
        mouth.setAttribute("x", "40");
        mouth.setAttribute("y", "55");
        mouth.setAttribute("width", "20");
        mouth.setAttribute("height", "3");
        mouth.setAttribute("fill", "#333333");
        parent.appendChild(mouth);
        
        // Add accessories if selected
        if (avatarState.accessories === 'glasses') {
            const glasses = document.createElementNS(svgNS, "path");
            glasses.setAttribute("d", "M36,42 H44 M56,42 H64 M44,42 C44,39 56,39 56,42");
            glasses.setAttribute("fill", "none");
            glasses.setAttribute("stroke", "#000000");
            glasses.setAttribute("stroke-width", "1");
            parent.appendChild(glasses);
        }
    }
    
    /**
     * Draw animal avatar
     */
    function drawAnimalAvatar(svgNS, parent) {
        // Animal head (circular)
        const head = document.createElementNS(svgNS, "circle");
        head.setAttribute("cx", "50");
        head.setAttribute("cy", "50");
        head.setAttribute("r", "25");
        head.setAttribute("fill", avatarState.skinColor);
        parent.appendChild(head);
        
        // Animal ears
        const leftEar = document.createElementNS(svgNS, "path");
        leftEar.setAttribute("d", "M35,30 L25,15 L40,25 Z");
        leftEar.setAttribute("fill", avatarState.skinColor);
        parent.appendChild(leftEar);
        
        const rightEar = document.createElementNS(svgNS, "path");
        rightEar.setAttribute("d", "M65,30 L75,15 L60,25 Z");
        rightEar.setAttribute("fill", avatarState.skinColor);
        parent.appendChild(rightEar);
        
        // Animal eyes
        const leftEye = document.createElementNS(svgNS, "ellipse");
        leftEye.setAttribute("cx", "40");
        leftEye.setAttribute("cy", "45");
        leftEye.setAttribute("rx", "5");
        leftEye.setAttribute("ry", "6");
        leftEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(leftEye);
        
        const rightEye = document.createElementNS(svgNS, "ellipse");
        rightEye.setAttribute("cx", "60");
        rightEye.setAttribute("cy", "45");
        rightEye.setAttribute("rx", "5");
        rightEye.setAttribute("ry", "6");
        rightEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(rightEye);
        
        // Animal nose
        const nose = document.createElementNS(svgNS, "ellipse");
        nose.setAttribute("cx", "50");
        nose.setAttribute("cy", "55");
        nose.setAttribute("rx", "5");
        nose.setAttribute("ry", "3");
        nose.setAttribute("fill", "#000000");
        parent.appendChild(nose);
        
        // Animal mouth
        const mouth = document.createElementNS(svgNS, "path");
        mouth.setAttribute("d", "M45,60 L50,65 L55,60");
        mouth.setAttribute("fill", "none");
        mouth.setAttribute("stroke", "#000000");
        mouth.setAttribute("stroke-width", "1");
        parent.appendChild(mouth);
    }
    
    /**
     * Draw fantasy avatar
     */
    function drawFantasyAvatar(svgNS, parent) {
        // Fantasy head (diamond shape)
        const head = document.createElementNS(svgNS, "polygon");
        head.setAttribute("points", "50,25 75,50 50,75 25,50");
        head.setAttribute("fill", avatarState.skinColor);
        parent.appendChild(head);
        
        // Fantasy eyes (star-shaped)
        const leftEye = document.createElementNS(svgNS, "polygon");
        leftEye.setAttribute("points", "40,45 42,40 44,45 49,46 44,48 42,53 40,48 35,46");
        leftEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(leftEye);
        
        const rightEye = document.createElementNS(svgNS, "polygon");
        rightEye.setAttribute("points", "60,45 62,40 64,45 69,46 64,48 62,53 60,48 55,46");
        rightEye.setAttribute("fill", avatarState.eyeColor);
        parent.appendChild(rightEye);
        
        // Fantasy mouth
        const mouth = document.createElementNS(svgNS, "path");
        mouth.setAttribute("d", "M45,60 Q50,65 55,60");
        mouth.setAttribute("fill", "none");
        mouth.setAttribute("stroke", "#000000");
        mouth.setAttribute("stroke-width", "1.5");
        parent.appendChild(mouth);
        
        // Fantasy special feature (glowing aura)
        const aura = document.createElementNS(svgNS, "circle");
        aura.setAttribute("cx", "50");
        aura.setAttribute("cy", "50");
        aura.setAttribute("r", "30");
        aura.setAttribute("fill", "none");
        aura.setAttribute("stroke", avatarState.hairColor);
        aura.setAttribute("stroke-width", "2");
        aura.setAttribute("stroke-opacity", "0.5");
        aura.setAttribute("filter", "blur(2px)");
        parent.insertBefore(aura, parent.firstChild); // Add aura behind the avatar
    }
    
    /**
     * Download avatar as an image (PNG for static, GIF for animated)
     */
    function downloadAvatar() {
        // Check if animation is active
        if (avatarState.animationType !== 'idle' && avatarState.isAnimating) {
            downloadAnimatedAvatar();
        } else {
            downloadStaticAvatar();
        }
    }
    
    /**
     * Download static avatar as PNG
     */
    function downloadStaticAvatar() {
        // Create a canvas element to convert SVG to image
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Set background
        ctx.fillStyle = avatarState.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Get SVG data
        const svgData = new XMLSerializer().serializeToString(avatarPreview.querySelector('svg'));
        const img = new Image();
        
        // Create a Blob from the SVG data
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function() {
            // Draw the SVG onto the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            
            // Convert canvas to downloadable image
            const imgURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'my-avatar.png';
            link.href = imgURL;
            link.click();
        };
        
        img.src = url;
    }
    
    /**
     * Download animated avatar as GIF
     */
    function downloadAnimatedAvatar() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = 'Creating animated avatar...';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.padding = '10px 20px';
        loadingIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
        loadingIndicator.style.color = 'white';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.zIndex = '9999';
        document.body.appendChild(loadingIndicator);
        
        // Load GIF.js if not already loaded
        if (typeof GIF === 'undefined') {
            const gifScript = document.createElement('script');
            gifScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js';
            gifScript.onload = function() {
                createAnimatedGif(loadingIndicator);
            };
            document.head.appendChild(gifScript);
        } else {
            createAnimatedGif(loadingIndicator);
        }
    }
    
    /**
     * Create and download animated GIF
     */
    function createAnimatedGif(loadingIndicator) {
        // Create GIF using gif.js
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 256,
            height: 256,
            workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
        });
        
        // Get animation properties
        const frames = 20; // Number of frames to capture
        
        // Create a container for the animated avatar
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
        
        // Function to capture frames
        const captureFrames = (frameCount) => {
            if (frameCount >= frames) {
                // All frames captured, finish GIF
                document.body.removeChild(container);
                
                gif.on('finished', function(blob) {
                    // Remove loading indicator
                    document.body.removeChild(loadingIndicator);
                    
                    // Create download link
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'animated-avatar.gif';
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.click();
                });
                
                gif.render();
                return;
            }
            
            // Create a copy of the SVG for this frame
            const svgData = new XMLSerializer().serializeToString(avatarPreview.querySelector('svg'));
            const svgCopy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgCopy.setAttribute('width', '256');
            svgCopy.setAttribute('height', '256');
            svgCopy.setAttribute('viewBox', '0 0 100 100');
            svgCopy.innerHTML = avatarPreview.querySelector('svg').innerHTML;
            
            // Apply animation frame based on animation type
            const progress = frameCount / frames;
            const animationElement = svgCopy.querySelector('g');
            
            switch (avatarState.animationType) {
                case 'bounce':
                    const yOffset = -10 * Math.sin(progress * Math.PI * 2);
                    animationElement.style.transform = `translateY(${yOffset}px)`;
                    break;
                case 'spin':
                    const rotation = progress * 360;
                    animationElement.style.transform = `rotate(${rotation}deg)`;
                    break;
                case 'wave':
                    const waveOffset = 5 * Math.sin(progress * Math.PI * 4);
                    animationElement.style.transform = `translateX(${waveOffset}px)`;
                    break;
                case 'pulse':
                    const scale = 1 + 0.1 * Math.sin(progress * Math.PI * 2);
                    animationElement.style.transform = `scale(${scale})`;
                    break;
            }
            
            container.innerHTML = '';
            container.appendChild(svgCopy);
            
            // Create a canvas with background color
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            
            // Set background
            ctx.fillStyle = avatarState.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 256, 256);
                gif.addFrame(canvas, { delay: 50, copy: true });
                
                // Capture next frame
                setTimeout(() => captureFrames(frameCount + 1), 10);
            };
            
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgCopy.outerHTML)));
        };
        
        // Start capturing frames
        captureFrames(0);
    }
});