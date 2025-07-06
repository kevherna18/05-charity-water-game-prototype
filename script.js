// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Check if device is mobile based on screen width
function isMobile() {
    return window.innerWidth <= 768;
}

// Get drop size based on device - smaller on mobile
function getDropSize() {
    return isMobile() ? 25 : 40;
}

// Function to apply responsive styles to elements
function applyResponsiveStyles() {
    const headerLogo = document.querySelector('.header-logo');
    const logos = document.querySelectorAll('.logo');
    const gameHeader = document.querySelector('.game-header');
    const gameStats = document.querySelector('.game-stats');
    const gameArea = document.getElementById('gameArea');
    const screenContent = document.querySelectorAll('.screen-content');
    
    if (isMobile()) {
        // Make header logo smaller on mobile
        if (headerLogo) {
            headerLogo.style.height = '30px';
            headerLogo.style.width = 'auto';
        }
        
        // Make main logos smaller on mobile
        logos.forEach(logo => {
            logo.style.width = '150px';
            logo.style.height = '150px';
            logo.style.marginBottom = '1rem';
        });
        
        // Stack game header elements vertically on mobile
        if (gameHeader) {
            gameHeader.style.flexDirection = 'column';
            gameHeader.style.gap = '0.5rem';
            gameHeader.style.padding = '0.5rem';
            gameHeader.style.textAlign = 'center';
        }
        
        // Stack stats horizontally under logo on mobile
        if (gameStats) {
            gameStats.style.flexDirection = 'row';
            gameStats.style.gap = '1rem';
            gameStats.style.fontSize = '1rem';
            gameStats.style.justifyContent = 'center';
        }
        
        // Adjust game area for mobile
        if (gameArea) {
            gameArea.style.minHeight = 'calc(100vh - 120px)';
        }
        
        // Reduce padding on screen content for mobile
        screenContent.forEach(content => {
            content.style.padding = '1rem';
            content.style.margin = '0.5rem';
        });
        
    } else {
        // Reset to desktop sizes
        if (headerLogo) {
            headerLogo.style.height = '40px';
            headerLogo.style.width = 'auto';
        }
        
        logos.forEach(logo => {
            logo.style.width = '300px';
            logo.style.height = '300px';
            logo.style.marginBottom = '4.5rem';
        });
        
        if (gameHeader) {
            gameHeader.style.flexDirection = 'row';
            gameHeader.style.gap = '2rem';
            gameHeader.style.padding = '1rem';
            gameHeader.style.textAlign = 'left';
        }
        
        if (gameStats) {
            gameStats.style.flexDirection = 'row';
            gameStats.style.gap = '2rem';
            gameStats.style.fontSize = '1.5rem';
            gameStats.style.justifyContent = 'flex-end';
        }
        
        if (gameArea) {
            gameArea.style.minHeight = '0';
        }
        
        screenContent.forEach(content => {
            content.style.padding = '2rem';
            content.style.margin = '0';
        });
    }
}

// Apply responsive styles when page loads
window.addEventListener('load', applyResponsiveStyles);

// Apply responsive styles when window is resized
window.addEventListener('resize', applyResponsiveStyles);

// Get references to all screens
const startScreen = document.getElementById('startScreen');
const instructionsScreen = document.getElementById('instructionsScreen');
const gameScreen = document.getElementById('gameScreen');

// Get references to all buttons
const playButton = document.getElementById('playButton');
const instructionsButton = document.getElementById('instructionsButton');
const backToStartButton = document.getElementById('backToStartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const startGameButton = document.getElementById('startGameButton');

// Get reference to game area
const gameArea = document.getElementById('gameArea');

// Function to show a specific screen and hide others
function showScreen(screenToShow) {
    // Hide all screens first
    startScreen.classList.remove('active');
    instructionsScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    
    // Show the selected screen
    screenToShow.classList.add('active');
    
    console.log(`Showing screen: ${screenToShow.id}`);
    
    // Stop the game when switching screens
    if (screenToShow !== gameScreen) {
        stopGame();
    }
}

// Add event listeners to buttons
playButton.addEventListener('click', function() {
    console.log('Play button clicked');
    showScreen(gameScreen);
});

instructionsButton.addEventListener('click', function() {
    console.log('Instructions button clicked');
    showScreen(instructionsScreen);
});

backToStartButton.addEventListener('click', function() {
    console.log('Back to start button clicked');
    showScreen(startScreen);
});

backToMenuButton.addEventListener('click', function() {
    console.log('Back to menu button clicked');
    showScreen(startScreen);
});

// Add event listener for start game button
startGameButton.addEventListener('click', function() {
    console.log('Start game button clicked');
    if (!gameRunning) {
        startGame();
        startGameButton.style.display = 'none';
    }
});

// Initialize game variables
let score = 0;
let lives = 3;
let gameRunning = false;
let waterDrops = [];
let greenDrops = [];
let animationId;

// Function to update score display
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Function to update lives display
function updateLives(change) {
    lives += change;
    document.getElementById('lives').textContent = `Lives: ${lives}`;
    
    // Check if game over
    if (lives <= 0) {
        console.log('Game Over!');
        gameRunning = false;
        
        // Create confetti effect before showing popup
        createConfetti();
        
        // Small delay before showing popup to let confetti start
        setTimeout(() => {
            showGameOverPopup();
            resetGameButton();
        }, 500);
    }
}

// Function to reset the start game button
function resetGameButton() {
    startGameButton.textContent = 'Start Game';
    startGameButton.disabled = false;
    startGameButton.style.display = 'block';
}

// Function to create a water drop
function createWaterDrop() {
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    
    let x, y;
    const dropSize = getDropSize(); // Use responsive drop size
    
    // Smaller center avoidance area on mobile
    const centerAvoidanceX = isMobile() ? 120 : 200;
    const centerAvoidanceY = isMobile() ? 80 : 100;
    
    // Avoid spawning in the center area (where start button would be)
    do {
        x = Math.random() * (gameArea.clientWidth - dropSize);
        y = Math.random() * (gameArea.clientHeight - dropSize);
    } while (
        // Check if drop would spawn in center area
        x > (gameArea.clientWidth / 2) - centerAvoidanceX && 
        x < (gameArea.clientWidth / 2) + centerAvoidanceX &&
        y > (gameArea.clientHeight / 2) - centerAvoidanceY && 
        y < (gameArea.clientHeight / 2) + centerAvoidanceY
    );
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    drop.style.width = `${dropSize}px`;
    drop.style.height = `${dropSize}px`;
    
    // Random speed and direction - slower on mobile
    const speedMultiplier = isMobile() ? 2 : 4;
    const speedX = (Math.random() - 0.5) * speedMultiplier;
    const speedY = (Math.random() - 0.5) * speedMultiplier;
    
    // Store drop data
    const dropData = {
        element: drop,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        size: dropSize
    };
    
    // Add hover event for desktop
    drop.addEventListener('mouseenter', function() {
        collectWaterDrop(dropData);
    });
    
    // Add touch event for mobile
    drop.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent scrolling
        collectWaterDrop(dropData);
    });
    
    gameArea.appendChild(drop);
    waterDrops.push(dropData);
}

// Function to create a green drop
function createGreenDrop() {
    const drop = document.createElement('div');
    drop.className = 'green-drop';
    
    let x, y;
    const dropSize = getDropSize(); // Use responsive drop size
    
    // Smaller center avoidance area on mobile
    const centerAvoidanceX = isMobile() ? 120 : 200;
    const centerAvoidanceY = isMobile() ? 80 : 100;
    
    // Avoid spawning in the center area (where start button would be)
    do {
        x = Math.random() * (gameArea.clientWidth - dropSize);
        y = Math.random() * (gameArea.clientHeight - dropSize);
    } while (
        // Check if drop would spawn in center area
        x > (gameArea.clientWidth / 2) - centerAvoidanceX && 
        x < (gameArea.clientWidth / 2) + centerAvoidanceX &&
        y > (gameArea.clientHeight / 2) - centerAvoidanceY && 
        y < (gameArea.clientHeight / 2) + centerAvoidanceY
    );
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    drop.style.width = `${dropSize}px`;
    drop.style.height = `${dropSize}px`;
    
    // Random speed and direction - slower on mobile
    const speedMultiplier = isMobile() ? 2 : 4;
    const speedX = (Math.random() - 0.5) * speedMultiplier;
    const speedY = (Math.random() - 0.5) * speedMultiplier;
    
    // Store drop data
    const dropData = {
        element: drop,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        size: dropSize
    };
    
    // Add hover event for desktop
    drop.addEventListener('mouseenter', function() {
        collectGreenDrop(dropData);
    });
    
    // Add touch event for mobile
    drop.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent scrolling
        collectGreenDrop(dropData);
    });
    
    gameArea.appendChild(drop);
    greenDrops.push(dropData);
}

// Function to collect a water drop
function collectWaterDrop(dropData) {
    // Remove from screen
    dropData.element.remove();
    
    // Remove from array
    const index = waterDrops.indexOf(dropData);
    if (index > -1) {
        waterDrops.splice(index, 1);
    }
    
    // Add one point for water drop
    updateScore(1);
    
    console.log('Water drop collected!');
    
    // Create a new water drop to replace it
    if (gameRunning) {
        createWaterDrop();
    }
}

// Function to collect a green drop (reduces lives)
function collectGreenDrop(dropData) {
    // Remove from screen
    dropData.element.remove();
    
    // Remove from array
    const index = greenDrops.indexOf(dropData);
    if (index > -1) {
        greenDrops.splice(index, 1);
    }
    
    // Lose one life for green drop
    updateLives(-1);
    
    console.log('Green drop touched - life lost!');
    
    // Create a new green drop to replace it
    if (gameRunning) {
        createGreenDrop();
    }
}

// Function to move water drops
function moveWaterDrops() {
    // Move blue water drops
    waterDrops.forEach(drop => {
        // Update position
        drop.x += drop.speedX;
        drop.y += drop.speedY;
        
        // Bounce off edges using actual drop size
        if (drop.x <= 0 || drop.x >= gameArea.clientWidth - drop.size) {
            drop.speedX = -drop.speedX;
            drop.x = Math.max(0, Math.min(drop.x, gameArea.clientWidth - drop.size));
        }
        
        if (drop.y <= 0 || drop.y >= gameArea.clientHeight - drop.size) {
            drop.speedY = -drop.speedY;
            drop.y = Math.max(0, Math.min(drop.y, gameArea.clientHeight - drop.size));
        }
        
        // Update element position
        drop.element.style.left = `${drop.x}px`;
        drop.element.style.top = `${drop.y}px`;
    });
    
    // Move green water drops
    greenDrops.forEach(drop => {
        // Update position
        drop.x += drop.speedX;
        drop.y += drop.speedY;
        
        // Bounce off edges using actual drop size
        if (drop.x <= 0 || drop.x >= gameArea.clientWidth - drop.size) {
            drop.speedX = -drop.speedX;
            drop.x = Math.max(0, Math.min(drop.x, gameArea.clientWidth - drop.size));
        }
        
        if (drop.y <= 0 || drop.y >= gameArea.clientHeight - drop.size) {
            drop.speedY = -drop.speedY;
            drop.y = Math.max(0, Math.min(drop.y, gameArea.clientHeight - drop.size));
        }
        
        // Update element position
        drop.element.style.left = `${drop.x}px`;
        drop.element.style.top = `${drop.y}px`;
    });
}

// Game animation loop
function gameLoop() {
    if (gameRunning) {
        moveWaterDrops();
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Function to start the game
function startGame() {
    console.log('Starting game...');
    gameRunning = true;
    
    // Reset game state
    score = 0;
    lives = 3;
    updateScore(0);
    updateLives(0);
    
    // Clear existing water drops
    waterDrops.forEach(drop => drop.element.remove());
    waterDrops = [];
    greenDrops.forEach(drop => drop.element.remove());
    greenDrops = [];
    
    // Create fewer drops on mobile for better performance
    const waterDropCount = isMobile() ? 8 : 10;
    const greenDropCount = isMobile() ? 15 : 20;
    
    // Create initial water drops
    for (let i = 0; i < waterDropCount; i++) {
        createWaterDrop();
    }
    
    // Create initial green drops
    for (let i = 0; i < greenDropCount; i++) {
        createGreenDrop();
    }
    
    // Start animation loop
    gameLoop();
}

// Function to show game over popup
function showGameOverPopup() {
    // Create popup overlay that covers the entire game area
    const popup = document.createElement('div');
    popup.id = 'gameOverPopup';
    popup.style.position = 'absolute';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '1000';
    
    // Create popup content with responsive sizing
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = 'white';
    popupContent.style.padding = isMobile() ? '1rem' : '30px';
    popupContent.style.borderRadius = '10px';
    popupContent.style.textAlign = 'center';
    popupContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    popupContent.style.maxWidth = isMobile() ? '90%' : '400px';
    popupContent.style.width = '100%';
    popupContent.style.margin = isMobile() ? '1rem' : '0';
    
    // Responsive font sizes
    const titleSize = isMobile() ? '1.2rem' : '2rem';
    const scoreSize = isMobile() ? '1rem' : '1.2rem';
    const messageSize = isMobile() ? '0.9rem' : '1rem';
    const buttonPadding = isMobile() ? '0.5rem 1rem' : '10px 20px';
    const buttonSize = isMobile() ? '0.9rem' : '1rem';
    
    // Add message and learn more button to popup
    popupContent.innerHTML = `
        <h2 style="color: #000000; margin-bottom: 1rem; font-size: ${titleSize};">Game Over!</h2>
        <p style="color: #000000; font-size: ${scoreSize}; margin-bottom: 1rem;">Final Score: ${score}</p>
        <p style="color: #000000; font-size: ${messageSize}; margin-bottom: 1rem;">Help Charity Water end the water crisis!</p>
        <button id="learnMoreButton" style="margin: 0.5rem; padding: ${buttonPadding}; font-size: ${buttonSize}; background-color: #FFC907; color: white; border: none; border-radius: 5px; cursor: pointer; touch-action: manipulation;">Learn More</button>`;
    
    // Add content to popup
    popup.appendChild(popupContent);
    
    // Add popup to game area
    gameArea.appendChild(popup);
    
    // Add event listener to learn more button
    document.getElementById('learnMoreButton').addEventListener('click', function() {
        console.log('Learn more button clicked');
        // Open Charity Water website in new tab
        window.open('https://www.charitywater.org/', '_blank');
        // Hide popup and return to start screen
        hideGameOverPopup();
        showScreen(startScreen);
    });
};

// Function to hide game over popup
function hideGameOverPopup() {
    const popup = document.getElementById('gameOverPopup');
    if (popup) {
        popup.remove();
    }
}

// Function to stop the game
function stopGame() {
    console.log('Stopping game...');
    gameRunning = false;
    
    // Cancel animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Clear all water drops
    waterDrops.forEach(drop => drop.element.remove());
    waterDrops = [];
    greenDrops.forEach(drop => drop.element.remove());
    greenDrops = [];
    
    // Reset button and hide popup
    resetGameButton();
    hideGameOverPopup();
}

// Function to create confetti effect
function createConfetti() {
    const colors = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F5402C', '#8BD1CB'];
    const confettiCount = isMobile() ? 30 : 50; // Fewer pieces on mobile for performance
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        
        // Random color from charity water brand colors
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random starting position across the top of the screen
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        
        // Random size
        const size = Math.random() * 8 + 4; // 4-12px
        
        // Style the confetti piece
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.left = `${startX}px`;
        confettiPiece.style.top = `${startY}px`;
        confettiPiece.style.width = `${size}px`;
        confettiPiece.style.height = `${size}px`;
        confettiPiece.style.backgroundColor = randomColor;
        confettiPiece.style.borderRadius = '50%';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.zIndex = '9999';
        
        // Add to body
        document.body.appendChild(confettiPiece);
        
        // Animate the confetti piece
        animateConfettiPiece(confettiPiece, startX, startY);
    }
    
    // Clean up confetti after animation
    setTimeout(() => {
        const confettiPieces = document.querySelectorAll('.confetti-piece');
        confettiPieces.forEach(piece => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        });
    }, 3000);
}

// Function to animate individual confetti piece
function animateConfettiPiece(piece, startX, startY) {
    let x = startX;
    let y = startY;
    let rotation = 0;
    
    // Random fall speed and horizontal drift
    const fallSpeed = Math.random() * 3 + 2; // 2-5 pixels per frame
    const drift = (Math.random() - 0.5) * 2; // -1 to 1 pixels per frame
    const rotationSpeed = Math.random() * 10 + 5; // 5-15 degrees per frame
    
    function updateConfetti() {
        y += fallSpeed;
        x += drift;
        rotation += rotationSpeed;
        
        // Update position and rotation
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.transform = `rotate(${rotation}deg)`;
        
        // Continue animation if piece is still visible
        if (y < window.innerHeight + 20) {
            requestAnimationFrame(updateConfetti);
        }
    }
    
    // Start animation
    requestAnimationFrame(updateConfetti);
}

console.log('Game initialized successfully');
