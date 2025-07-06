// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

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
        showGameOverPopup();
        resetGameButton();
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
    
    // Avoid spawning in the center area (where start button would be)
    do {
        x = Math.random() * (gameArea.clientWidth - 40);
        y = Math.random() * (gameArea.clientHeight - 40);
    } while (
        // Check if drop would spawn in center area (avoid 200px radius from center)
        x > (gameArea.clientWidth / 2) - 200 && 
        x < (gameArea.clientWidth / 2) + 200 &&
        y > (gameArea.clientHeight / 2) - 100 && 
        y < (gameArea.clientHeight / 2) + 100
    );
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    
    // Random speed and direction
    const speedX = (Math.random() - 0.5) * 4; // Random speed between -2 and 2
    const speedY = (Math.random() - 0.5) * 4;
    
    // Store drop data
    const dropData = {
        element: drop,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY
    };
    
    // Add hover event to collect water drop
    drop.addEventListener('mouseenter', function() {
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
    
    // Avoid spawning in the center area (where start button would be)
    do {
        x = Math.random() * (gameArea.clientWidth - 40);
        y = Math.random() * (gameArea.clientHeight - 40);
    } while (
        // Check if drop would spawn in center area (avoid 200px radius from center)
        x > (gameArea.clientWidth / 2) - 200 && 
        x < (gameArea.clientWidth / 2) + 200 &&
        y > (gameArea.clientHeight / 2) - 100 && 
        y < (gameArea.clientHeight / 2) + 100
    );
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    
    // Random speed and direction
    const speedX = (Math.random() - 0.5) * 4; // Random speed between -2 and 2
    const speedY = (Math.random() - 0.5) * 4;
    
    // Store drop data
    const dropData = {
        element: drop,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY
    };
    
    // Add hover event to lose life on green drop
    drop.addEventListener('mouseenter', function() {
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
        
        // Bounce off edges
        if (drop.x <= 0 || drop.x >= gameArea.clientWidth - 40) {
            drop.speedX = -drop.speedX;
            drop.x = Math.max(0, Math.min(drop.x, gameArea.clientWidth - 40));
        }
        
        if (drop.y <= 0 || drop.y >= gameArea.clientHeight - 40) {
            drop.speedY = -drop.speedY;
            drop.y = Math.max(0, Math.min(drop.y, gameArea.clientHeight - 40));
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
        
        // Bounce off edges
        if (drop.x <= 0 || drop.x >= gameArea.clientWidth - 40) {
            drop.speedX = -drop.speedX;
            drop.x = Math.max(0, Math.min(drop.x, gameArea.clientWidth - 40));
        }
        
        if (drop.y <= 0 || drop.y >= gameArea.clientHeight - 40) {
            drop.speedY = -drop.speedY;
            drop.y = Math.max(0, Math.min(drop.y, gameArea.clientHeight - 40));
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
    
    // Create more initial water drops
    for (let i = 0; i < 10; i++) {
        createWaterDrop();
    }
    
    // Create more initial green drops
    for (let i = 0; i < 20; i++) {
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
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = 'white';
    popupContent.style.padding = '30px';
    popupContent.style.borderRadius = '10px';
    popupContent.style.textAlign = 'center';
    popupContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    
    // Add message and learn more button to popup
    popupContent.innerHTML = `
        <h2 style="color: #000000; margin-bottom: 20px;">Game Over!</h2>
        <p style="color: #000000; font-size: 18px; margin-bottom: 20px;">Final Score: ${score}</p>
        <p style="color: #000000; font-size: 16px; margin-bottom: 20px;">Help Charity Water end the water crisis!</p>
        <button id="learnMoreButton" style="margin: 10px; padding: 10px 20px; font-size: 16px; background-color: #FFC907; color: white; border: none; border-radius: 5px; cursor: pointer;">Learn More</button>`;
    
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

console.log('Game initialized successfully');
