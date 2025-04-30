/**
 * Calm Sounds - A tool for playing relaxing ambient sounds
 * Part of MultiTool Hub
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const volumeControl = document.getElementById('volume-control');
    const nowPlaying = document.getElementById('now-playing');
    const soundList = document.getElementById('sound-list');
    const activeSounds = document.getElementById('active-sounds');
    const clearMixer = document.getElementById('clear-mixer');
    const timerDuration = document.getElementById('timer-duration');
    const startTimer = document.getElementById('start-timer');
    const timerDisplay = document.getElementById('timer-display');
    const canvas = document.getElementById('sound-visualization');
    const categoryButtons = document.querySelectorAll('#nature-sounds, #ambient-sounds, #meditation-sounds, #water-sounds, #white-noise, #sleep-sounds');
    const presetButtons = document.querySelectorAll('.sound-preset');
    
    // Audio Context
    let audioContext;
    let analyser;
    let canvasContext;
    let animationFrame;
    
    // Sound Library - Organized by categories
    const soundLibrary = {
        nature: [
            { id: 'forest-birds', name: 'Forest Birds', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
            { id: 'morning-birds', name: 'Morning Birds', url: 'https://assets.mixkit.co/sfx/preview/mixkit-morning-birds-singing-in-the-forest-2432.mp3' },
            { id: 'forest-ambience', name: 'Forest Ambience', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-ambience-1228.mp3' },
            { id: 'crickets', name: 'Crickets', url: 'https://assets.mixkit.co/sfx/preview/mixkit-crickets-and-insects-in-the-wild-ambience-39.mp3' }
        ],
        ambient: [
            { id: 'cafe-ambience', name: 'Cafe Ambience', url: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-ambience-102.mp3' },
            { id: 'city-ambience', name: 'City Ambience', url: 'https://assets.mixkit.co/sfx/preview/mixkit-city-ambience-loop-1185.mp3' },
            { id: 'keyboard-typing', name: 'Keyboard Typing', url: 'https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3' },
            { id: 'office-ambience', name: 'Office Ambience', url: 'https://assets.mixkit.co/sfx/preview/mixkit-office-ambience-447.mp3' }
        ],
        meditation: [
            { id: 'singing-bowl', name: 'Singing Bowl', url: 'https://assets.mixkit.co/sfx/preview/mixkit-tibetan-singing-bowl-hits-2427.mp3' },
            { id: 'meditation-bells', name: 'Meditation Bells', url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-595.mp3' },
            { id: 'om-chanting', name: 'Om Chanting', url: 'https://assets.mixkit.co/sfx/preview/mixkit-spiritual-moment-of-peace-577.mp3' },
            { id: 'gentle-piano', name: 'Gentle Piano', url: 'https://assets.mixkit.co/sfx/preview/mixkit-gentle-piano-melody-loop-740.mp3' }
        ],
        water: [
            { id: 'ocean-waves', name: 'Ocean Waves', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
            { id: 'light-rain', name: 'Light Rain', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
            { id: 'heavy-rain', name: 'Heavy Rain', url: 'https://assets.mixkit.co/sfx/preview/mixkit-heavy-rain-loop-2394.mp3' },
            { id: 'stream', name: 'Stream', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-stream-ambience-1186.mp3' }
        ],
        'white-noise': [
            { id: 'white-noise', name: 'White Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-loop-1236.mp3' },
            { id: 'pink-noise', name: 'Pink Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-pink-noise-ambience-loop-1237.mp3' },
            { id: 'brown-noise', name: 'Brown Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-brown-noise-ambience-loop-1238.mp3' },
            { id: 'fan-noise', name: 'Fan Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-air-conditioner-hum-loop-1239.mp3' }
        ],
        sleep: [
            { id: 'lullaby', name: 'Lullaby', url: 'https://assets.mixkit.co/sfx/preview/mixkit-lullaby-music-box-melody-708.mp3' },
            { id: 'heartbeat', name: 'Heartbeat', url: 'https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-monitor-beep-1216.mp3' },
            { id: 'night-ambience', name: 'Night Ambience', url: 'https://assets.mixkit.co/sfx/preview/mixkit-night-forest-ambience-2482.mp3' },
            { id: 'soft-wind', name: 'Soft Wind', url: 'https://assets.mixkit.co/sfx/preview/mixkit-soft-wind-breeze-loop-1187.mp3' }
        ]
    };
    
    // Sound presets
    const soundPresets = [
        {
            name: 'Peaceful Forest',
            description: 'Birds + Light Rain',
            sounds: [
                { id: 'forest-birds', volume: 70 },
                { id: 'light-rain', volume: 40 }
            ]
        },
        {
            name: 'Ocean Retreat',
            description: 'Waves + Seagulls',
            sounds: [
                { id: 'ocean-waves', volume: 80 },
                { id: 'morning-birds', volume: 30 }
            ]
        },
        {
            name: 'Rainy Cafe',
            description: 'Rain + Cafe Ambience',
            sounds: [
                { id: 'light-rain', volume: 60 },
                { id: 'cafe-ambience', volume: 50 }
            ]
        },
        {
            name: 'Meditation Space',
            description: 'Singing Bowls + Wind',
            sounds: [
                { id: 'singing-bowl', volume: 65 },
                { id: 'soft-wind', volume: 45 }
            ]
        }
    ];
    
    // Active sounds collection
    let activeSoundNodes = {};
    let currentCategory = 'nature';
    let timerInterval = null;
    
    // Initialize the application
    function init() {
        // Initialize audio context
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            
            // Set up canvas for visualization
            if (canvas) {
                canvasContext = canvas.getContext('2d');
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
        }
        
        // Populate initial sound list
        populateSoundList(currentCategory);
        
        // Set up event listeners
        setupEventListeners();
    }
    
    // Populate sound list based on category
    function populateSoundList(category) {
        if (!soundLibrary[category]) return;
        
        // Clear current list
        soundList.innerHTML = '';
        
        // Add sounds from the selected category
        soundLibrary[category].forEach(sound => {
            const soundItem = document.createElement('div');
            soundItem.className = 'sound-item p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer';
            soundItem.dataset.soundId = sound.id;
            
            soundItem.innerHTML = `
                <div class="flex items-center">
                    <div class="w-8 h-8 flex-shrink-0 mr-3 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium">${sound.name}</h4>
                        <p class="text-xs text-gray-500">${getCategoryName(category)}</p>
                    </div>
                </div>
            `;
            
            soundItem.addEventListener('click', () => {
                playSound(sound.id, sound.name, sound.url);
            });
            
            soundList.appendChild(soundItem);
        });
    }
    
    // Get friendly category name
    function getCategoryName(category) {
        const names = {
            'nature': 'Nature',
            'ambient': 'Ambient',
            'meditation': 'Meditation',
            'water': 'Water',
            'white-noise': 'White Noise',
            'sleep': 'Sleep'
        };
        return names[category] || category;
    }
    
    // Play a sound
    function playSound(id, name, url) {
        // Update now playing display
        nowPlaying.textContent = name;
        
        // Check if sound is already active
        if (activeSoundNodes[id]) {
            // Just update the UI if already playing
            return;
        }
        
        // Create new audio node
        const audio = new Audio(url);
        audio.loop = true;
        
        // Create audio source and gain node
        const source = audioContext.createMediaElementSource(audio);
        const gainNode = audioContext.createGain();
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(analyser);
        
        // Set volume from main control
        gainNode.gain.value = volumeControl.value / 100;
        
        // Start playing
        audio.play().catch(e => console.error('Error playing audio:', e));
        
        // Store active sound
        activeSoundNodes[id] = {
            audio: audio,
            source: source,
            gain: gainNode,
            name: name
        };
        
        // Add to mixer UI
        addSoundToMixer(id, name);
        
        // Start visualization if not already running
        if (!animationFrame) {
            visualize();
        }
    }
    
    // Add sound to the mixer UI
    function addSoundToMixer(id, name) {
        // Check if already in mixer
        if (document.querySelector(`.active-sound-item[data-sound-id="${id}"]`)) {
            return;
        }
        
        const soundItem = document.createElement('div');
        soundItem.className = 'active-sound-item flex items-center space-x-3';
        soundItem.dataset.soundId = id;
        
        soundItem.innerHTML = `
            <div class="w-6 h-6 flex-shrink-0 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
            </div>
            <span class="text-sm font-medium">${name}</span>
            <input type="range" class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer sound-volume" min="0" max="100" value="70" data-sound-id="${id}">
            <button class="text-red-500 hover:text-red-700 remove-sound" data-sound-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        
        // Add event listeners for volume control and remove button
        const volumeSlider = soundItem.querySelector('.sound-volume');
        volumeSlider.addEventListener('input', (e) => {
            if (activeSoundNodes[id]) {
                activeSoundNodes[id].gain.gain.value = e.target.value / 100;
            }
        });
        
        const removeButton = soundItem.querySelector('.remove-sound');
        removeButton.addEventListener('click', () => {
            removeSound(id);
        });
        
        activeSounds.appendChild(soundItem);
    }
    
    // Remove a sound from playback and UI
    function removeSound(id) {
        if (activeSoundNodes[id]) {
            // Stop and disconnect audio
            activeSoundNodes[id].audio.pause();
            activeSoundNodes[id].source.disconnect();
            activeSoundNodes[id].gain.disconnect();
            
            // Remove from active sounds
            delete activeSoundNodes[id];
            
            // Remove from UI
            const soundItem = document.querySelector(`.active-sound-item[data-sound-id="${id}"]`);
            if (soundItem) {
                soundItem.remove();
            }
            
            // Update now playing if this was the current sound
            if (nowPlaying.textContent === activeSoundNodes[id]?.name) {
                const remainingSounds = Object.values(activeSoundNodes);
                if (remainingSounds.length > 0) {
                    nowPlaying.textContent = remainingSounds[0].name;
                } else {
                    nowPlaying.textContent = 'No sound playing';
                    // Stop visualization if no sounds are playing
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = null;
                        clearCanvas();
                    }
                }
            }
        }
    }
    
    // Clear all sounds
    function clearAllSounds() {
        // Stop all active sounds
        Object.keys(activeSoundNodes).forEach(id => {
            removeSound(id);
        });
        
        // Clear mixer UI
        activeSounds.innerHTML = '';
        nowPlaying.textContent = 'No sound playing';
        
        // Stop visualization
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            clearCanvas();
        }
    }
    
    // Apply a preset
    function applyPreset(preset) {
        // Clear current sounds
        clearAllSounds();
        
        // Add each sound in the preset
        preset.sounds.forEach(sound => {
            // Find the sound in the library
            let soundData = null;
            for (const category in soundLibrary) {
                const found = soundLibrary[category].find(s => s.id === sound.id);
                if (found) {
                    soundData = found;
                    break;
                }
            }
            
            if (soundData) {
                // Play the sound
                playSound(soundData.id, soundData.name, soundData.url);
                
                // Set its volume
                setTimeout(() => {
                    if (activeSoundNodes[sound.id]) {
                        activeSoundNodes[sound.id].gain.gain.value = sound.volume / 100;
                        
                        // Update slider in UI
                        const volumeSlider = document.querySelector(`.sound-volume[data-sound-id="${sound.id}"]`);
                        if (volumeSlider) {
                            volumeSlider.value = sound.volume;
                        }
                    }
                }, 100);
            }
        });
    }
    
    // Start timer
    function startSoundTimer(minutes) {
        // Clear any existing timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        if (minutes <= 0) {
            timerDisplay.classList.add('hidden');
            return;
        }
        
        // Calculate end time
        const endTime = new Date().getTime() + (minutes * 60 * 1000);
        
        // Show timer display
        timerDisplay.classList.remove('hidden');
        
        // Update timer display immediately
        updateTimerDisplay(endTime);
        
        // Set interval to update display
        timerInterval = setInterval(() => {
            const remaining = updateTimerDisplay(endTime);
            
            // If timer is done, stop all sounds
            if (remaining <= 0) {
                clearAllSounds();
                clearInterval(timerInterval);
                timerInterval = null;
                timerDisplay.classList.add('hidden');
            }
        }, 1000);
    }
    
    // Update timer display and return remaining seconds
    function updateTimerDisplay(endTime) {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        // If timer is done
        if (distance <= 0) {
            timerDisplay.textContent = '00:00';
            return 0;
        }
        
        // Calculate minutes and seconds
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display time remaining
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        return distance / 1000;
    }
    
    // Visualize the audio
    function visualize() {
        if (!analyser || !canvasContext) return;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function draw() {
            animationFrame = requestAnimationFrame(draw);
            
            analyser.getByteFrequencyData(dataArray);
            
            clearCanvas();
            
            // No sound playing
            if (Object.keys(activeSoundNodes).length === 0) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
                return;
            }
            
            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                
                // Create gradient
                const gradient = canvasContext.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)'); // Indigo
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0.4)'); // Darker indigo
                
                canvasContext.fillStyle = gradient;
                canvasContext.fillRect(x, height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        }
        
        draw();
    }
    
    // Clear the canvas
    function clearCanvas() {
        if (canvasContext && canvas) {
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Extract category from button id
                const category = button.id.replace('-sounds', '');
                currentCategory = category;
                populateSoundList(category);
                
                // Update active state
                categoryButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-indigo-500'));
                button.classList.add('ring-2', 'ring-indigo-500');
            });
        });
        
        // Volume control
        volumeControl.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            // Apply to all active sounds
            Object.values(activeSoundNodes).forEach(node => {
                node.gain.gain.value = volume;
            });
        });
        
        // Play button
        playBtn.addEventListener('click', () => {
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Play all paused sounds
            Object.values(activeSoundNodes).forEach(node => {
                if (node.audio.paused) {
                    node.audio.play();
                }
            });
            
            // Start visualization if needed
            if (Object.keys(activeSoundNodes).length > 0 && !animationFrame) {
                visualize();
            }
        });
        
        // Pause button
        pauseBtn.addEventListener('click', () => {
            // Pause all sounds
            Object.values(activeSoundNodes).forEach(node => {
                node.audio.pause();
            });
            
            // Stop visualization
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        });
        
        // Stop button
        stopBtn.addEventListener('click', clearAllSounds);
        
        // Clear mixer button
        clearMixer.addEventListener('click', clearAllSounds);
        
        // Timer controls
        startTimer.addEventListener('click', () => {
            const minutes = parseInt(timerDuration.value, 10);
            startSoundTimer(minutes);
        });
        
        // Preset buttons
        presetButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                if (index < soundPresets.length) {
                    applyPreset(soundPresets[index]);
                }
            });
        });
        
        // Handle window resize for canvas
        window.addEventListener('resize', () => {
            if (canvas) {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
            }
        });
    }
    
    // Initialize on page load
    init();
});

// Update footer year
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});