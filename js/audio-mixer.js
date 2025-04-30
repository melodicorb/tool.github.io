/**
 * Audio Mixer Tool - MultiTool Hub
 * Provides browser-based audio mixing functionality with track controls and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mixerBoard = document.getElementById('mixer-board');
    const noTracksMessage = document.getElementById('no-tracks-message');
    const btnAddTrack = document.getElementById('btn-add-track');
    const btnPlayAll = document.getElementById('btn-play-all');
    const btnStopAll = document.getElementById('btn-stop-all');
    const btnExportMix = document.getElementById('btn-export-mix');
    const masterOutput = document.getElementById('master-output');
    const masterVolume = document.getElementById('master-volume');
    const masterVolumeDisplay = document.getElementById('master-volume-display');
    
    // Audio Context
    let audioContext;
    let masterGainNode;
    let tracks = [];
    let trackCounter = 0;
    let isPlaying = false;
    let masterWavesurfer;
    
    // Initialize the tool
    init();
    
    /**
     * Initialize the Audio Mixer Tool
     */
    function init() {
        // Initialize event listeners
        btnAddTrack.addEventListener('click', addNewTrack);
        btnPlayAll.addEventListener('click', playAllTracks);
        btnStopAll.addEventListener('click', stopAllTracks);
        btnExportMix.addEventListener('click', exportMix);
        masterVolume.addEventListener('input', updateMasterVolume);
        
        // Initialize master wavesurfer
        masterWavesurfer = WaveSurfer.create({
            container: '#master-waveform',
            waveColor: '#4f46e5',
            progressColor: '#818cf8',
            cursorColor: '#4338ca',
            barWidth: 2,
            barRadius: 3,
            cursorWidth: 1,
            height: 80,
            barGap: 2
        });
        
        // Initialize Audio Context when user interacts
        document.addEventListener('click', initAudioContext, { once: true });
    }
    
    /**
     * Initialize Web Audio API context
     */
    function initAudioContext() {
        if (audioContext) return;
        
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            
            // Create master gain node
            masterGainNode = audioContext.createGain();
            masterGainNode.gain.value = masterVolume.value / 100;
            masterGainNode.connect(audioContext.destination);
            
            console.log('Audio context initialized');
        } catch (e) {
            console.error('Web Audio API is not supported in this browser', e);
            alert('Sorry, Web Audio API is not supported in your browser. Please try using a modern browser like Chrome or Firefox.');
        }
    }
    
    /**
     * Add a new audio track to the mixer
     */
    function addNewTrack() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Trigger file selection
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                createTrack(file);
            }
            document.body.removeChild(fileInput);
        });
    }
    
    /**
     * Create a new track with the selected audio file
     */
    function createTrack(file) {
        // Initialize audio context if not already done
        if (!audioContext) initAudioContext();
        
        // Hide no tracks message
        noTracksMessage.classList.add('hidden');
        masterOutput.classList.remove('hidden');
        
        // Create track ID
        const trackId = 'track-' + (++trackCounter);
        
        // Create track container
        const trackElement = document.createElement('div');
        trackElement.id = trackId;
        trackElement.className = 'track p-3 border border-gray-300 rounded-md';
        
        // Create track header
        const trackHeader = document.createElement('div');
        trackHeader.className = 'flex justify-between items-center mb-2';
        
        // Track title
        const trackTitle = document.createElement('div');
        trackTitle.className = 'font-medium text-indigo-700';
        trackTitle.textContent = file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name;
        
        // Track controls
        const trackControls = document.createElement('div');
        trackControls.className = 'flex space-x-2';
        
        // Play button
        const playButton = document.createElement('button');
        playButton.className = 'p-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition';
        playButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        
        // Stop button
        const stopButton = document.createElement('button');
        stopButton.className = 'p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition';
        stopButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v6H9z"></path></svg>';
        
        // Mute button
        const muteButton = document.createElement('button');
        muteButton.className = 'p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition';
        muteButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>';
        
        // Solo button
        const soloButton = document.createElement('button');
        soloButton.className = 'p-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition';
        soloButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>';
        
        // Remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition';
        removeButton.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
        
        // Add buttons to controls
        trackControls.appendChild(playButton);
        trackControls.appendChild(stopButton);
        trackControls.appendChild(muteButton);
        trackControls.appendChild(soloButton);
        trackControls.appendChild(removeButton);
        
        // Add title and controls to header
        trackHeader.appendChild(trackTitle);
        trackHeader.appendChild(trackControls);
        
        // Create waveform container
        const waveformContainer = document.createElement('div');
        waveformContainer.id = trackId + '-waveform';
        waveformContainer.className = 'h-24 bg-white rounded border border-gray-200 mb-3';
        
        // Create track controls
        const trackSettings = document.createElement('div');
        trackSettings.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        
        // Volume control
        const volumeControl = document.createElement('div');
        volumeControl.className = 'flex items-center space-x-2';
        volumeControl.innerHTML = `
            <label class="w-16 text-sm">Volume:</label>
            <input type="range" id="${trackId}-volume" min="0" max="100" value="80" class="flex-grow">
            <span id="${trackId}-volume-display" class="w-12 text-right text-sm">80%</span>
        `;
        
        // Pan control
        const panControl = document.createElement('div');
        panControl.className = 'flex items-center space-x-2';
        panControl.innerHTML = `
            <label class="w-16 text-sm">Pan:</label>
            <input type="range" id="${trackId}-pan" min="-100" max="100" value="0" class="flex-grow">
            <span id="${trackId}-pan-display" class="w-12 text-right text-sm">C</span>
        `;
        
        // Add controls to settings
        trackSettings.appendChild(volumeControl);
        trackSettings.appendChild(panControl);
        
        // Add all elements to track
        trackElement.appendChild(trackHeader);
        trackElement.appendChild(waveformContainer);
        trackElement.appendChild(trackSettings);
        
        // Add track to mixer board
        mixerBoard.appendChild(trackElement);
        
        // Create wavesurfer instance for this track
        const wavesurfer = WaveSurfer.create({
            container: '#' + trackId + '-waveform',
            waveColor: '#6366f1',
            progressColor: '#4f46e5',
            cursorColor: '#4338ca',
            barWidth: 2,
            barRadius: 3,
            cursorWidth: 1,
            height: 80,
            barGap: 2
        });
        
        // Load audio file
        wavesurfer.loadBlob(file);
        
        // Create audio nodes
        const track = {
            id: trackId,
            wavesurfer: wavesurfer,
            file: file,
            gainNode: null,
            panNode: null,
            isMuted: false,
            isSolo: false,
            volumeValue: 0.8,
            panValue: 0
        };
        
        // Add track to tracks array
        tracks.push(track);
        
        // Set up audio nodes when audio is decoded
        wavesurfer.on('ready', function() {
            // Create gain node for volume control
            track.gainNode = audioContext.createGain();
            track.gainNode.gain.value = track.volumeValue;
            
            // Create stereo panner for pan control
            track.panNode = audioContext.createStereoPanner();
            track.panNode.pan.value = track.panValue;
            
            // Connect nodes
            // wavesurfer -> gainNode -> panNode -> masterGain -> destination
            wavesurfer.backend.setFilters([track.gainNode, track.panNode, masterGainNode]);
            
            console.log(`Track ${trackId} loaded and ready`);
        });
        
        // Set up event listeners for track controls
        playButton.addEventListener('click', function() {
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
            } else {
                wavesurfer.play();
            }
        });
        
        stopButton.addEventListener('click', function() {
            wavesurfer.stop();
        });
        
        muteButton.addEventListener('click', function() {
            track.isMuted = !track.isMuted;
            if (track.isMuted) {
                track.gainNode.gain.value = 0;
                muteButton.classList.add('bg-red-100', 'text-red-700');
                muteButton.classList.remove('bg-gray-100', 'text-gray-700');
            } else {
                track.gainNode.gain.value = track.volumeValue;
                muteButton.classList.remove('bg-red-100', 'text-red-700');
                muteButton.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
        
        soloButton.addEventListener('click', function() {
            track.isSolo = !track.isSolo;
            updateSoloState();
            
            if (track.isSolo) {
                soloButton.classList.add('bg-yellow-500', 'text-white');
                soloButton.classList.remove('bg-yellow-100', 'text-yellow-700');
            } else {
                soloButton.classList.remove('bg-yellow-500', 'text-white');
                soloButton.classList.add('bg-yellow-100', 'text-yellow-700');
            }
        });
        
        removeButton.addEventListener('click', function() {
            // Stop and remove wavesurfer
            wavesurfer.stop();
            wavesurfer.destroy();
            
            // Remove track from DOM
            mixerBoard.removeChild(trackElement);
            
            // Remove track from tracks array
            tracks = tracks.filter(t => t.id !== trackId);
            
            // Show no tracks message if no tracks left
            if (tracks.length === 0) {
                noTracksMessage.classList.remove('hidden');
                masterOutput.classList.add('hidden');
            }
            
            // Update solo state
            updateSoloState();
        });
        
        // Volume control
        const volumeSlider = document.getElementById(trackId + '-volume');
        const volumeDisplay = document.getElementById(trackId + '-volume-display');
        
        volumeSlider.addEventListener('input', function() {
            const value = volumeSlider.value;
            volumeDisplay.textContent = value + '%';
            track.volumeValue = value / 100;
            
            // Only update gain if not muted
            if (!track.isMuted) {
                track.gainNode.gain.value = track.volumeValue;
            }
        });
        
        // Pan control
        const panSlider = document.getElementById(trackId + '-pan');
        const panDisplay = document.getElementById(trackId + '-pan-display');
        
        panSlider.addEventListener('input', function() {
            const value = panSlider.value;
            track.panValue = value / 100;
            track.panNode.pan.value = track.panValue;
            
            // Update display
            if (value < 0) {
                panDisplay.textContent = 'L' + Math.abs(value) + '%';
            } else if (value > 0) {
                panDisplay.textContent = 'R' + value + '%';
            } else {
                panDisplay.textContent = 'C';
            }
        });
    }
    
    /**
     * Update the solo state of all tracks
     */
    function updateSoloState() {
        const hasSoloTracks = tracks.some(track => track.isSolo);
        
        tracks.forEach(track => {
            if (hasSoloTracks) {
                // If any track is soloed, only soloed tracks should be audible
                if (track.isSolo && !track.isMuted) {
                    track.gainNode.gain.value = track.volumeValue;
                } else {
                    track.gainNode.gain.value = 0;
                }
            } else {
                // If no track is soloed, all non-muted tracks should be audible
                if (!track.isMuted) {
                    track.gainNode.gain.value = track.volumeValue;
                }
            }
        });
    }
    
    /**
     * Play all tracks simultaneously
     */
    function playAllTracks() {
        if (!audioContext) initAudioContext();
        
        if (tracks.length === 0) {
            alert('Please add at least one audio track first.');
            return;
        }
        
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Play all tracks from the beginning
        tracks.forEach(track => {
            track.wavesurfer.stop();
            track.wavesurfer.play();
        });
        
        isPlaying = true;
    }
    
    /**
     * Stop all tracks
     */
    function stopAllTracks() {
        tracks.forEach(track => {
            track.wavesurfer.stop();
        });
        
        isPlaying = false;
    }
    
    /**
     * Update master volume
     */
    function updateMasterVolume() {
        const value = masterVolume.value;
        masterVolumeDisplay.textContent = value + '%';
        
        if (masterGainNode) {
            masterGainNode.gain.value = value / 100;
        }
    }
    
    /**
     * Export the final mix
     */
    function exportMix() {
        if (tracks.length === 0) {
            alert('Please add at least one audio track first.');
            return;
        }
        
        alert('Export functionality is in development. This feature will allow you to download your mixed audio as a WAV file.');
        
        // Note: Implementing a full mix-down requires more complex audio processing
        // This would typically involve recording the output of the audio context
        // and then converting it to a downloadable file
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});