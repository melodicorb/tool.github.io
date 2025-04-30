/**
 * Emoji Finder Tool
 * Allows users to search, filter, and copy emojis
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const emojiContainer = document.getElementById('emoji-container');
    const searchInput = document.getElementById('emoji-search');
    const categorySelect = document.getElementById('emoji-category');
    const recentEmojisContainer = document.getElementById('recent-emojis');
    const noRecentText = document.getElementById('no-recent');
    const copyNotification = document.getElementById('copy-notification');

    // State variables
    let allEmojis = [];
    let filteredEmojis = [];
    let recentEmojis = [];
    
    // Load emojis data
    fetchEmojis();
    loadRecentEmojis();

    // Event listeners
    searchInput.addEventListener('input', filterEmojis);
    categorySelect.addEventListener('change', filterEmojis);

    /**
     * Fetch emoji data from a JSON file or API
     */
    async function fetchEmojis() {
        try {
            // This is a sample emoji dataset - in a real application, you might want to use a more complete dataset
            // or fetch from an API
            const emojiData = [
                // Smileys & Emotion
                { emoji: '😀', name: 'grinning face', category: 'smileys' },
                { emoji: '😃', name: 'grinning face with big eyes', category: 'smileys' },
                { emoji: '😄', name: 'grinning face with smiling eyes', category: 'smileys' },
                { emoji: '😁', name: 'beaming face with smiling eyes', category: 'smileys' },
                { emoji: '😆', name: 'grinning squinting face', category: 'smileys' },
                { emoji: '😅', name: 'grinning face with sweat', category: 'smileys' },
                { emoji: '🤣', name: 'rolling on the floor laughing', category: 'smileys' },
                { emoji: '😂', name: 'face with tears of joy', category: 'smileys' },
                { emoji: '🙂', name: 'slightly smiling face', category: 'smileys' },
                { emoji: '🙃', name: 'upside-down face', category: 'smileys' },
                { emoji: '😉', name: 'winking face', category: 'smileys' },
                { emoji: '😊', name: 'smiling face with smiling eyes', category: 'smileys' },
                { emoji: '😇', name: 'smiling face with halo', category: 'smileys' },
                { emoji: '🥰', name: 'smiling face with hearts', category: 'smileys' },
                { emoji: '😍', name: 'smiling face with heart-eyes', category: 'smileys' },
                { emoji: '🤩', name: 'star-struck', category: 'smileys' },
                { emoji: '😘', name: 'face blowing a kiss', category: 'smileys' },
                { emoji: '😗', name: 'kissing face', category: 'smileys' },
                { emoji: '😚', name: 'kissing face with closed eyes', category: 'smileys' },
                { emoji: '😙', name: 'kissing face with smiling eyes', category: 'smileys' },
                { emoji: '🥲', name: 'smiling face with tear', category: 'smileys' },
                { emoji: '😋', name: 'face savoring food', category: 'smileys' },
                { emoji: '😛', name: 'face with tongue', category: 'smileys' },
                { emoji: '😜', name: 'winking face with tongue', category: 'smileys' },
                { emoji: '😝', name: 'squinting face with tongue', category: 'smileys' },
                { emoji: '🤑', name: 'money-mouth face', category: 'smileys' },
                { emoji: '🤗', name: 'hugging face', category: 'smileys' },
                { emoji: '🤭', name: 'face with hand over mouth', category: 'smileys' },
                { emoji: '🤫', name: 'shushing face', category: 'smileys' },
                { emoji: '🤔', name: 'thinking face', category: 'smileys' },
                { emoji: '🤐', name: 'zipper-mouth face', category: 'smileys' },
                { emoji: '🤨', name: 'face with raised eyebrow', category: 'smileys' },
                { emoji: '😐', name: 'neutral face', category: 'smileys' },
                { emoji: '😑', name: 'expressionless face', category: 'smileys' },
                { emoji: '😶', name: 'face without mouth', category: 'smileys' },
                { emoji: '😏', name: 'smirking face', category: 'smileys' },
                { emoji: '😒', name: 'unamused face', category: 'smileys' },
                { emoji: '🙄', name: 'face with rolling eyes', category: 'smileys' },
                { emoji: '😬', name: 'grimacing face', category: 'smileys' },
                { emoji: '😮‍💨', name: 'face exhaling', category: 'smileys' },
                { emoji: '🤥', name: 'lying face', category: 'smileys' },
                
                // People & Body
                { emoji: '👋', name: 'waving hand', category: 'people' },
                { emoji: '🤚', name: 'raised back of hand', category: 'people' },
                { emoji: '🖐️', name: 'hand with fingers splayed', category: 'people' },
                { emoji: '✋', name: 'raised hand', category: 'people' },
                { emoji: '🖖', name: 'vulcan salute', category: 'people' },
                { emoji: '👌', name: 'OK hand', category: 'people' },
                { emoji: '🤌', name: 'pinched fingers', category: 'people' },
                { emoji: '🤏', name: 'pinching hand', category: 'people' },
                { emoji: '✌️', name: 'victory hand', category: 'people' },
                { emoji: '🤞', name: 'crossed fingers', category: 'people' },
                { emoji: '🫰', name: 'hand with index finger and thumb crossed', category: 'people' },
                { emoji: '🤟', name: 'love-you gesture', category: 'people' },
                { emoji: '🤘', name: 'sign of the horns', category: 'people' },
                { emoji: '👈', name: 'backhand index pointing left', category: 'people' },
                { emoji: '👉', name: 'backhand index pointing right', category: 'people' },
                { emoji: '👆', name: 'backhand index pointing up', category: 'people' },
                { emoji: '🖕', name: 'middle finger', category: 'people' },
                { emoji: '👇', name: 'backhand index pointing down', category: 'people' },
                { emoji: '☝️', name: 'index pointing up', category: 'people' },
                { emoji: '👍', name: 'thumbs up', category: 'people' },
                { emoji: '👎', name: 'thumbs down', category: 'people' },
                { emoji: '✊', name: 'raised fist', category: 'people' },
                { emoji: '👊', name: 'oncoming fist', category: 'people' },
                { emoji: '🤛', name: 'left-facing fist', category: 'people' },
                { emoji: '🤜', name: 'right-facing fist', category: 'people' },
                
                // Animals & Nature
                { emoji: '🐶', name: 'dog face', category: 'animals' },
                { emoji: '🐱', name: 'cat face', category: 'animals' },
                { emoji: '🐭', name: 'mouse face', category: 'animals' },
                { emoji: '🐹', name: 'hamster face', category: 'animals' },
                { emoji: '🐰', name: 'rabbit face', category: 'animals' },
                { emoji: '🦊', name: 'fox face', category: 'animals' },
                { emoji: '🐻', name: 'bear face', category: 'animals' },
                { emoji: '🐼', name: 'panda face', category: 'animals' },
                { emoji: '🦁', name: 'lion face', category: 'animals' },
                { emoji: '🐮', name: 'cow face', category: 'animals' },
                { emoji: '🐷', name: 'pig face', category: 'animals' },
                { emoji: '🐸', name: 'frog face', category: 'animals' },
                { emoji: '🐵', name: 'monkey face', category: 'animals' },
                { emoji: '🐔', name: 'chicken', category: 'animals' },
                { emoji: '🐧', name: 'penguin', category: 'animals' },
                { emoji: '🐦', name: 'bird', category: 'animals' },
                { emoji: '🐤', name: 'baby chick', category: 'animals' },
                { emoji: '🦆', name: 'duck', category: 'animals' },
                { emoji: '🦅', name: 'eagle', category: 'animals' },
                { emoji: '🦉', name: 'owl', category: 'animals' },
                { emoji: '🦇', name: 'bat', category: 'animals' },
                { emoji: '🐺', name: 'wolf', category: 'animals' },
                { emoji: '🐗', name: 'boar', category: 'animals' },
                { emoji: '🐴', name: 'horse face', category: 'animals' },
                { emoji: '🦄', name: 'unicorn', category: 'animals' },
                
                // Food & Drink
                { emoji: '🍎', name: 'red apple', category: 'food' },
                { emoji: '🍐', name: 'pear', category: 'food' },
                { emoji: '🍊', name: 'tangerine', category: 'food' },
                { emoji: '🍋', name: 'lemon', category: 'food' },
                { emoji: '🍌', name: 'banana', category: 'food' },
                { emoji: '🍉', name: 'watermelon', category: 'food' },
                { emoji: '🍇', name: 'grapes', category: 'food' },
                { emoji: '🍓', name: 'strawberry', category: 'food' },
                { emoji: '🫐', name: 'blueberries', category: 'food' },
                { emoji: '🍈', name: 'melon', category: 'food' },
                { emoji: '🍒', name: 'cherries', category: 'food' },
                { emoji: '🍑', name: 'peach', category: 'food' },
                { emoji: '🥭', name: 'mango', category: 'food' },
                { emoji: '🍍', name: 'pineapple', category: 'food' },
                { emoji: '🥥', name: 'coconut', category: 'food' },
                { emoji: '🥝', name: 'kiwi fruit', category: 'food' },
                { emoji: '🍅', name: 'tomato', category: 'food' },
                { emoji: '🥑', name: 'avocado', category: 'food' },
                { emoji: '🍆', name: 'eggplant', category: 'food' },
                { emoji: '🥔', name: 'potato', category: 'food' },
                { emoji: '🥕', name: 'carrot', category: 'food' },
                { emoji: '🌽', name: 'ear of corn', category: 'food' },
                { emoji: '🌮', name: 'taco', category: 'food' },
                { emoji: '🍔', name: 'hamburger', category: 'food' },
                { emoji: '🍟', name: 'french fries', category: 'food' },
                
                // Travel & Places
                { emoji: '🚗', name: 'car', category: 'travel' },
                { emoji: '🚕', name: 'taxi', category: 'travel' },
                { emoji: '🚙', name: 'sport utility vehicle', category: 'travel' },
                { emoji: '🚌', name: 'bus', category: 'travel' },
                { emoji: '🚎', name: 'trolleybus', category: 'travel' },
                { emoji: '🏎️', name: 'racing car', category: 'travel' },
                { emoji: '🚓', name: 'police car', category: 'travel' },
                { emoji: '🚑', name: 'ambulance', category: 'travel' },
                { emoji: '🚒', name: 'fire engine', category: 'travel' },
                { emoji: '🚐', name: 'minibus', category: 'travel' },
                { emoji: '✈️', name: 'airplane', category: 'travel' },
                { emoji: '🚀', name: 'rocket', category: 'travel' },
                { emoji: '🛸', name: 'flying saucer', category: 'travel' },
                { emoji: '🚁', name: 'helicopter', category: 'travel' },
                { emoji: '⛵', name: 'sailboat', category: 'travel' },
                { emoji: '🚢', name: 'ship', category: 'travel' },
                { emoji: '🛳️', name: 'passenger ship', category: 'travel' },
                { emoji: '🚆', name: 'train', category: 'travel' },
                { emoji: '🚇', name: 'metro', category: 'travel' },
                { emoji: '🚂', name: 'locomotive', category: 'travel' },
                { emoji: '🏙️', name: 'cityscape', category: 'travel' },
                { emoji: '🌄', name: 'sunrise over mountains', category: 'travel' },
                { emoji: '🌅', name: 'sunrise', category: 'travel' },
                { emoji: '🌃', name: 'night with stars', category: 'travel' },
                { emoji: '🏝️', name: 'desert island', category: 'travel' },
                
                // Activities
                { emoji: '⚽', name: 'soccer ball', category: 'activities' },
                { emoji: '🏀', name: 'basketball', category: 'activities' },
                { emoji: '🏈', name: 'american football', category: 'activities' },
                { emoji: '⚾', name: 'baseball', category: 'activities' },
                { emoji: '🥎', name: 'softball', category: 'activities' },
                { emoji: '🎾', name: 'tennis', category: 'activities' },
                { emoji: '🏐', name: 'volleyball', category: 'activities' },
                { emoji: '🏉', name: 'rugby football', category: 'activities' },
                { emoji: '🥏', name: 'flying disc', category: 'activities' },
                { emoji: '🎱', name: 'pool 8 ball', category: 'activities' },
                { emoji: '🏓', name: 'ping pong', category: 'activities' },
                { emoji: '🏸', name: 'badminton', category: 'activities' },
                { emoji: '🥊', name: 'boxing glove', category: 'activities' },
                { emoji: '🥋', name: 'martial arts uniform', category: 'activities' },
                { emoji: '⛳', name: 'flag in hole', category: 'activities' },
                { emoji: '⛸️', name: 'ice skate', category: 'activities' },
                { emoji: '🎣', name: 'fishing pole', category: 'activities' },
                { emoji: '🤿', name: 'diving mask', category: 'activities' },
                { emoji: '🎽', name: 'running shirt', category: 'activities' },
                { emoji: '🎮', name: 'video game', category: 'activities' },
                { emoji: '♟️', name: 'chess pawn', category: 'activities' },
                { emoji: '🎨', name: 'artist palette', category: 'activities' },
                { emoji: '🎭', name: 'performing arts', category: 'activities' },
                { emoji: '🎪', name: 'circus tent', category: 'activities' },
                { emoji: '🎬', name: 'clapper board', category: 'activities' },
                
                // Objects
                { emoji: '⌚', name: 'watch', category: 'objects' },
                { emoji: '📱', name: 'mobile phone', category: 'objects' },
                { emoji: '💻', name: 'laptop', category: 'objects' },
                { emoji: '⌨️', name: 'keyboard', category: 'objects' },
                { emoji: '🖥️', name: 'desktop computer', category: 'objects' },
                { emoji: '🖨️', name: 'printer', category: 'objects' },
                { emoji: '🖱️', name: 'computer mouse', category: 'objects' },
                { emoji: '🖲️', name: 'trackball', category: 'objects' },
                { emoji: '🕹️', name: 'joystick', category: 'objects' },
                { emoji: '🗜️', name: 'clamp', category: 'objects' },
                { emoji: '💽', name: 'computer disk', category: 'objects' },
                { emoji: '💾', name: 'floppy disk', category: 'objects' },
                { emoji: '💿', name: 'optical disk', category: 'objects' },
                { emoji: '📀', name: 'dvd', category: 'objects' },
                { emoji: '📷', name: 'camera', category: 'objects' },
                { emoji: '📹', name: 'video camera', category: 'objects' },
                { emoji: '🎥', name: 'movie camera', category: 'objects' },
                { emoji: '📺', name: 'television', category: 'objects' },
                { emoji: '📻', name: 'radio', category: 'objects' },
                { emoji: '🎙️', name: 'studio microphone', category: 'objects' },
                { emoji: '🎚️', name: 'level slider', category: 'objects' },
                { emoji: '🎛️', name: 'control knobs', category: 'objects' },
                { emoji: '🎧', name: 'headphone', category: 'objects' },
                { emoji: '📞', name: 'telephone receiver', category: 'objects' },
                { emoji: '☎️', name: 'telephone', category: 'objects' },
                
                // Symbols
                { emoji: '❤️', name: 'red heart', category: 'symbols' },
                { emoji: '🧡', name: 'orange heart', category: 'symbols' },
                { emoji: '💛', name: 'yellow heart', category: 'symbols' },
                { emoji: '💚', name: 'green heart', category: 'symbols' },
                { emoji: '💙', name: 'blue heart', category: 'symbols' },
                { emoji: '💜', name: 'purple heart', category: 'symbols' },
                { emoji: '🖤', name: 'black heart', category: 'symbols' },
                { emoji: '🤍', name: 'white heart', category: 'symbols' },
                { emoji: '🤎', name: 'brown heart', category: 'symbols' },
                { emoji: '💔', name: 'broken heart', category: 'symbols' },
                { emoji: '❣️', name: 'heart exclamation', category: 'symbols' },
                { emoji: '💕', name: 'two hearts', category: 'symbols' },
                { emoji: '💞', name: 'revolving hearts', category: 'symbols' },
                { emoji: '💓', name: 'beating heart', category: 'symbols' },
                { emoji: '💗', name: 'growing heart', category: 'symbols' },
                { emoji: '💖', name: 'sparkling heart', category: 'symbols' },
                { emoji: '💘', name: 'heart with arrow', category: 'symbols' },
                { emoji: '💝', name: 'heart with ribbon', category: 'symbols' },
                { emoji: '💟', name: 'heart decoration', category: 'symbols' },
                { emoji: '☮️', name: 'peace symbol', category: 'symbols' },
                { emoji: '✝️', name: 'latin cross', category: 'symbols' },
                { emoji: '☪️', name: 'star and crescent', category: 'symbols' },
                { emoji: '🕉️', name: 'om', category: 'symbols' },
                { emoji: '☸️', name: 'wheel of dharma', category: 'symbols' },
                { emoji: '✡️', name: 'star of David', category: 'symbols' },
                
                // Flags
                { emoji: '🏁', name: 'chequered flag', category: 'flags' },
                { emoji: '🚩', name: 'triangular flag', category: 'flags' },
                { emoji: '🎌', name: 'crossed flags', category: 'flags' },
                { emoji: '🏴', name: 'black flag', category: 'flags' },
                { emoji: '🏳️', name: 'white flag', category: 'flags' },
                { emoji: '🏳️‍🌈', name: 'rainbow flag', category: 'flags' },
                { emoji: '🏳️‍⚧️', name: 'transgender flag', category: 'flags' },
                { emoji: '🏴‍☠️', name: 'pirate flag', category: 'flags' },
                { emoji: '🇺🇳', name: 'United Nations flag', category: 'flags' },
                { emoji: '🇦🇫', name: 'flag: Afghanistan', category: 'flags' },
                { emoji: '🇦🇽', name: 'flag: Åland Islands', category: 'flags' },
                { emoji: '🇦🇱', name: 'flag: Albania', category: 'flags' },
                { emoji: '🇩🇿', name: 'flag: Algeria', category: 'flags' },
                { emoji: '🇦🇸', name: 'flag: American Samoa', category: 'flags' },
                { emoji: '🇦🇩', name: 'flag: Andorra', category: 'flags' },
                { emoji: '🇦🇴', name: 'flag: Angola', category: 'flags' },
                { emoji: '🇦🇮', name: 'flag: Anguilla', category: 'flags' },
                { emoji: '🇦🇶', name: 'flag: Antarctica', category: 'flags' },
                { emoji: '🇦🇬', name: 'flag: Antigua & Barbuda', category: 'flags' },
                { emoji: '🇦🇷', name: 'flag: Argentina', category: 'flags' }
            ];
            
            allEmojis = emojiData;
            filteredEmojis = allEmojis;
            
            // Remove loading indicator
            emojiContainer.innerHTML = '';
            
            // Display all emojis initially
            displayEmojis(filteredEmojis);
        } catch (error) {
            console.error('Error fetching emojis:', error);
            emojiContainer.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load emojis. Please try again later.</p>`;
        }
    }

    /**
     * Filter emojis based on search input and category selection
     */
    function filterEmojis() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        filteredEmojis = allEmojis.filter(emoji => {
            // Filter by search term
            const matchesSearch = emoji.name.toLowerCase().includes(searchTerm);
            
            // Filter by category
            const matchesCategory = selectedCategory === 'all' || emoji.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        displayEmojis(filteredEmojis);
    }

    /**
     * Display emojis in the container
     * @param {Array} emojisToDisplay - Array of emoji objects to display
     */
    function displayEmojis(emojisToDisplay) {
        if (emojisToDisplay.length === 0) {
            emojiContainer.innerHTML = `<p class="text-gray-500 text-center col-span-full">No emojis found. Try a different search term or category.</p>`;
            return;
        }

        emojiContainer.innerHTML = '';
        
        emojisToDisplay.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item bg-gray-50 hover:bg-gray-100 rounded-lg p-3 text-center cursor-pointer transition-transform transform hover:scale-105';
            emojiElement.innerHTML = `
                <div class="text-3xl mb-1">${emoji.emoji}</div>
                <div class="text-xs text-gray-600 truncate" title="${emoji.name}">${emoji.name}</div>
            `;
            
            // Add click event to copy emoji
            emojiElement.addEventListener('click', () => copyEmoji(emoji));
            
            emojiContainer.appendChild(emojiElement);
        });
    }

    /**
     * Copy emoji to clipboard and add to recent emojis
     * @param {Object} emoji - The emoji object to copy
     */
    function copyEmoji(emoji) {
        // Copy to clipboard
        navigator.clipboard.writeText(emoji.emoji)
            .then(() => {
                // Show notification
                showCopyNotification();
                
                // Add to recent emojis
                addToRecentEmojis(emoji);
            })
            .catch(err => {
                console.error('Failed to copy emoji:', err);
                // Fallback method for clipboard
                const textArea = document.createElement('textarea');
                textArea.value = emoji.emoji;
                textArea.style.position = 'fixed';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showCopyNotification();
                    addToRecentEmojis(emoji);
                } catch (err) {
                    console.error('Fallback: Failed to copy emoji:', err);
                }
                
                document.body.removeChild(textArea);
            });
    }

    /**
     * Show copy notification and hide after a delay
     */
    function showCopyNotification() {
        copyNotification.classList.remove('translate-y-20');
        copyNotification.classList.add('translate-y-0');
        
        setTimeout(() => {
            copyNotification.classList.remove('translate-y-0');
            copyNotification.classList.add('translate-y-20');
        }, 2000);
    }

    /**
     * Add emoji to recent emojis list
     * @param {Object} emoji - The emoji object to add to recents
     */
    function addToRecentEmojis(emoji) {
        // Remove if already exists
        recentEmojis = recentEmojis.filter(e => e.emoji !== emoji.emoji);
        
        // Add to beginning of array
        recentEmojis.unshift(emoji);
        
        // Limit to 10 recent emojis
        if (recentEmojis.length > 10) {
            recentEmojis.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));
        
        // Update display
        displayRecentEmojis();
    }

    /**
     * Load recent emojis from localStorage
     */
    function loadRecentEmojis() {
        const savedEmojis = localStorage.getItem('recentEmojis');
        if (savedEmojis) {
            try {
                recentEmojis = JSON.parse(savedEmojis);
                displayRecentEmojis();
            } catch (error) {
                console.error('Error parsing recent emojis:', error);
                recentEmojis = [];
            }
        }
    }

    /**
     * Display recent emojis in the container
     */
    function displayRecentEmojis() {
        if (recentEmojis.length === 0) {
            noRecentText.style.display = 'block';
            recentEmojisContainer.innerHTML = '';
            return;
        }
        
        noRecentText.style.display = 'none';
        recentEmojisContainer.innerHTML = '';
        
        recentEmojis.forEach(emoji => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'recent-emoji bg-gray-100 hover:bg-gray-200 rounded-lg p-2 text-2xl cursor-pointer transition-transform transform hover:scale-105';
            emojiElement.textContent = emoji.emoji;
            emojiElement.title = emoji.name;
            
            // Add click event to copy emoji
            emojiElement.addEventListener('click', () => copyEmoji(emoji));
            
            recentEmojisContainer.appendChild(emojiElement);
        });
    }
});