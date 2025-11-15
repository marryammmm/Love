// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let timeLeft = 300; // 5 minutes in seconds (changed from 180)
let gameStarted = false;
let currentSlide = 0;
let passwordValue = '';
let currentBookPage = 0;
let videosStarted = false;

// Card emojis for the matching game
const cardEmojis = ['💗', '💖', '💝', '💕', '💓', '💞'];

// Wish messages
const wishMessages = [
    "💕 May we always be together, forever",
    "🌟 I wish you success in everything you do",
    "🎀 Semoga sayang sehat selalu yaa? supaya kita bisa keliling dunia bareng nantii!",
    "💖 I wish all the good things in this world akan selalu datang ke kamu yaa sayang kuu, karnaa u always deserve it!",
    "✨ Semogaaa hansi kuu sayangg nda akan pernah ngerasa sendiri dalam menghadapii rasa sedih yaaa? karnaaa hansii akan selaluuu punyaa ellyn!",
    "🌸 I wish we could grow old together dan akan adaa gdsky! XIXIXI"
];

// PIN pad functions
function addDigit(digit) {
    if (passwordValue.length < 2) {
        passwordValue += digit;
        updatePasswordDisplay();
    }
}

function deleteDigit() {
    if (passwordValue.length > 0) {
        passwordValue = passwordValue.slice(0, -1);
        updatePasswordDisplay();
    }
}

function clearPassword() {
    passwordValue = '';
    updatePasswordDisplay();
}

function updatePasswordDisplay() {
    const dots = document.querySelectorAll('.password-display .dot');
    dots.forEach((dot, index) => {
        if (index < passwordValue.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Login function
function checkLogin() {
    const name = document.getElementById('name').value.trim().toLowerCase();
    const errorMessage = document.getElementById('error-message');

    if (!name) {
        errorMessage.textContent = 'Masukkan nama kamu dulu sayang! 💕';
        return;
    }

    if (name !== 'hansi') {
        showHintPopup();
        return;
    }

    if (passwordValue === '20') {
        errorMessage.textContent = '';
        showPage('game-page');
        initGame();
    } else {
        errorMessage.textContent = 'Ayokk coba lagi sayang!! 💕';
        clearPassword();
    }
}

// Show page function
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Show hint popup for wrong name
function showHintPopup() {
    const popup = document.createElement('div');
    popup.className = 'hint-popup';
    popup.innerHTML = `
        <div class="hint-popup-content">
            <button class="hint-close-btn" onclick="closeHintPopup()">✕</button>
            <h3>Huhu namanya salah cintakuu🥺</h3>
            <p>Ellyn beri Hint:</p>
            <p class="hint-text">"Mirip nama pelatih Barcelona"</p>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
}

// Close hint popup
function closeHintPopup() {
    const popup = document.querySelector('.hint-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Initialize game
function initGame() {
    if (!gameStarted) {
        gameStarted = true;
        createCards();
        startTimer();
    }
}

// Create cards for the game
function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Create pairs of cards
    const cardPairs = [...cardEmojis, ...cardEmojis];
    
    // Shuffle cards
    cardPairs.sort(() => Math.random() - 0.5);
    
    // Create card elements
    cardPairs.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        // Assign photo based on emoji type
        let photoNumber;
        switch(emoji) {
            case '💗': photoNumber = 1; break;
            case '💖': photoNumber = 2; break;
            case '💝': photoNumber = 3; break;
            case '💕': photoNumber = 4; break;
            case '💓': photoNumber = 5; break;
            case '💞': photoNumber = 6; break;
            default: photoNumber = 1;
        }
        card.dataset.photo = photoNumber;
        
        card.innerHTML = `<span style="opacity: 0;">${emoji}</span>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Flip card function
function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('matched') || this.classList.contains('flipped')) {
        return;
    }

    this.classList.add('flipped');
    this.querySelector('span').style.opacity = '1';
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

// Check if cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        document.getElementById('matches').textContent = `${matchedPairs}/6`;
        
        if (matchedPairs === 6) {
            winGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('span').style.opacity = '0';
        card2.querySelector('span').style.opacity = '0';
    }
    
    flippedCards = [];
}

// Timer function
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            loseGame();
        }
    }, 1000);
}

// Win game
function winGame() {
    clearInterval(timer);
    const resultDiv = document.getElementById('game-result');
    resultDiv.innerHTML = `
        <div class="game-result-content">
            <h2> WAA CONGRATS HANSI KU! U WIN ! </h2>
            <button onclick="showRewards()">Press this button to get the reward!</button>
        </div>
    `;
    resultDiv.classList.add('show');
}

// Lose game
function loseGame() {
    clearInterval(timer);
    const resultDiv = document.getElementById('game-result');
    resultDiv.innerHTML = `
        <div class="game-result-content">
            <h2>Coba lagi yuk hansi sayang! 💕</h2>
            <p style="color: #ff69b4; margin: 20px 0;">Jangan menyerah yaaa! Aku yakin hansi bisa! 💪</p>
            <button onclick="resetGame()">Coba Lagi!</button>
        </div>
    `;
    resultDiv.classList.add('show');
}

// Reset game
function resetGame() {
    matchedPairs = 0;
    timeLeft = 300; // 5 minutes (changed from 180)
    flippedCards = [];
    cards = [];
    gameStarted = false;
    document.getElementById('matches').textContent = '0/6';
    document.getElementById('timer').textContent = '5:00'; // Changed from 3:00
    const resultDiv = document.getElementById('game-result');
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('show');
    initGame();
}

// Show rewards page
function showRewards() {
    const resultDiv = document.getElementById('game-result');
    resultDiv.classList.remove('show');
    showPage('reward-page');
}

// Show Gallery Modal
function showGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.add('active');
    currentSlide = 0;
    currentBookPage = 0; // Reset book page
    videosStarted = false; // Reset video status
    showSlide(currentSlide);
    updatePageIndicator(); // Update page indicator
    
    // Show play overlay for iOS
    const overlay = document.getElementById('video-play-overlay');
    if (overlay) {
        // Check if we need to show overlay (for iOS/Safari)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isIOS || isSafari) {
            setTimeout(() => {
                overlay.classList.add('show');
            }, 300);
        } else {
            // Auto-start for other browsers
            startVideos();
        }
    }
    
    // Play background music with user interaction
    setTimeout(() => {
        const galleryMusic = document.getElementById('gallery-music');
        if (galleryMusic) {
            galleryMusic.currentTime = 11; // Start from 11 seconds (0:11)
            galleryMusic.volume = 0.5; // Set volume to 50%
            const playPromise = galleryMusic.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented. Click to play music:', error);
                });
            }
        }
    }, 100);
    
    // Setup video event listeners for autoplay and auto-advance
    setupVideoAutoplay();
}

// Start videos function for iOS
function startVideos() {
    const overlay = document.getElementById('video-play-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
    
    videosStarted = true;
    
    // Start playing the first video
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        const video = activeSlide.querySelector('video');
        if (video) {
            video.muted = true; // Keep muted for iOS
            video.play().catch(error => {
                console.log('Video play error:', error);
            });
        }
    }
    
    // Start background music
    const galleryMusic = document.getElementById('gallery-music');
    if (galleryMusic && galleryMusic.paused) {
        galleryMusic.currentTime = 11;
        galleryMusic.volume = 0.5;
        galleryMusic.play().catch(error => {
            console.log('Music play error:', error);
        });
    }
}

// Show Music Modal
function showMusic() {
    document.getElementById('music-modal').classList.add('active');
    // Pause all audio when opening
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => audio.pause());
}

// Show Wishes Modal
function showWishes() {
    document.getElementById('wishes-modal').classList.add('active');
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    // Stop gallery music and videos when closing gallery
    if (modalId === 'gallery-modal') {
        const galleryMusic = document.getElementById('gallery-music');
        if (galleryMusic) {
            galleryMusic.pause();
            galleryMusic.currentTime = 0;
        }
        // Pause all videos in slideshow
        const videos = document.querySelectorAll('.slide video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
            // Remove event listeners
            video.removeEventListener('ended', handleVideoEnd);
        });
        
        // Hide overlay
        const overlay = document.getElementById('video-play-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        videosStarted = false;
        stopAutoSlideshow();
    }
    
    // Pause all audio when closing music modal
    if (modalId === 'music-modal') {
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}

// Slideshow functions
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    
    if (n >= slides.length) {
        currentSlide = 0;
    }
    if (n < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Pause all videos before changing slide
    slides.forEach(slide => {
        slide.classList.remove('active');
        const video = slide.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });
    
    slides[currentSlide].classList.add('active');
    
    // Play the active video if videos have been started
    if (videosStarted) {
        const activeSlide = slides[currentSlide];
        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo) {
            activeVideo.currentTime = 0;
            activeVideo.muted = true; // Ensure muted for iOS
            const playPromise = activeVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Video autoplay prevented:', error);
                    // Show overlay again if autoplay fails
                    const overlay = document.getElementById('video-play-overlay');
                    if (overlay) {
                        overlay.classList.add('show');
                    }
                });
            }
        }
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    const slides = document.querySelectorAll('.slide');
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    showSlide(currentSlide);
}

// Setup video autoplay and auto-advance
function setupVideoAutoplay() {
    const videos = document.querySelectorAll('.slide video');
    
    videos.forEach((video, index) => {
        // Remove previous event listeners
        video.removeEventListener('ended', handleVideoEnd);
        
        // Add event listener for when video ends
        video.addEventListener('ended', handleVideoEnd);
    });
}

// Handle video end event
function handleVideoEnd(event) {
    const slides = document.querySelectorAll('.slide');
    
    // Move to next slide
    currentSlide++;
    
    // Loop back to first slide if at the end
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    
    showSlide(currentSlide);
}

// Auto slideshow variables
let autoSlideshowInterval;

// Start auto slideshow
function startAutoSlideshow() {
    stopAutoSlideshow(); // Clear any existing interval
    autoSlideshowInterval = setInterval(() => {
        changeSlide(1);
    }, 3000); // Change slide every 3 seconds
}

// Stop auto slideshow
function stopAutoSlideshow() {
    if (autoSlideshowInterval) {
        clearInterval(autoSlideshowInterval);
        autoSlideshowInterval = null;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        event.target.classList.remove('active');
        
        // Stop gallery music, slideshow, and videos
        if (modalId === 'gallery-modal') {
            const galleryMusic = document.getElementById('gallery-music');
            if (galleryMusic) {
                galleryMusic.pause();
                galleryMusic.currentTime = 0;
            }
            // Pause all videos in slideshow
            const videos = document.querySelectorAll('.slide video');
            videos.forEach(video => {
                video.pause();
                video.currentTime = 0;
                // Remove event listeners
                video.removeEventListener('ended', handleVideoEnd);
            });
            stopAutoSlideshow();
        }
        
        // Pause all audio
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            if (audio.id !== 'gallery-music') {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }
}

// Allow Enter key to submit login - removed password field listener
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkLogin();
            }
        });
    }
});

// Book navigation functions
function nextPage() {
    const pages = document.querySelectorAll('.book-page');
    if (currentBookPage < pages.length - 1) {
        pages[currentBookPage].classList.remove('active');
        currentBookPage++;
        pages[currentBookPage].classList.add('active');
        updatePageIndicator();
    }
}

function previousPage() {
    const pages = document.querySelectorAll('.book-page');
    if (currentBookPage > 0) {
        pages[currentBookPage].classList.remove('active');
        currentBookPage--;
        pages[currentBookPage].classList.add('active');
        updatePageIndicator();
    }
}

function updatePageIndicator() {
    const currentPageElement = document.getElementById('current-page');
    if (currentPageElement) {
        currentPageElement.textContent = currentBookPage + 1;
    }
}

// Gift functions
function openGift(giftNumber) {
    const popup = document.getElementById('wish-popup');
    const wishText = document.getElementById('wish-text');
    
    // Set the wish message based on gift number
    wishText.textContent = wishMessages[giftNumber - 1];
    
    // Show popup
    popup.classList.add('show');
}

function closeWishPopup() {
    const popup = document.getElementById('wish-popup');
    popup.classList.remove('show');
}

// Close wish popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('wish-popup');
    if (event.target === popup) {
        closeWishPopup();
    }
});
