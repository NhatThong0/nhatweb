// Khởi tạo canvas và context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Kích thước ô
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Biến game
let snake = [{ x: 10, y: 10 }];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// Elements DOM
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');
const newRecordElement = document.getElementById('newRecord');
const playAgainBtn = document.getElementById('playAgainBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Khởi tạo game
function init() {
    updateHighScore();
    generateFood();
    drawGame();
}

// Tạo thức ăn ngẫu nhiên
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Đảm bảo thức ăn không xuất hiện trên thân rắn
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Vẽ game
function drawGame() {
    // Xóa canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Vẽ thức ăn
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    
    // Vẽ rắn
    ctx.shadowBlur = 5;
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Đầu rắn
            ctx.fillStyle = '#4ecdc4';
            ctx.shadowColor = '#4ecdc4';
        } else {
            // Thân rắn
            ctx.fillStyle = '#45b7d1';
            ctx.shadowColor = '#45b7d1';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    ctx.shadowBlur = 0;
}

// Di chuyển rắn
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Kiểm tra va chạm với tường
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Kiểm tra va chạm với thân rắn
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Kiểm tra ăn thức ăn
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }
}

// Cập nhật điểm
function updateScore() {
    scoreElement.textContent = score;
}

// Cập nhật điểm cao nhất
function updateHighScore() {
    highScoreElement.textContent = highScore;
}

// Game loop chính
function gameStep() {
    if (!gameRunning) return;
    
    moveSnake();
    drawGame();
}

// Bắt đầu game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    gameLoop = setInterval(gameStep, 150);
}

// Tạm dừng game
function pauseGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Reset game
function resetGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    
    updateScore();
    generateFood();
    drawGame();
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    gameOverModal.style.display = 'none';
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    finalScoreElement.textContent = score;
    
    // Kiểm tra kỷ lục mới
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        updateHighScore();
        newRecordElement.style.display = 'block';
    } else {
        newRecordElement.style.display = 'none';
    }
    
    gameOverModal.style.display = 'block';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Xử lý phím
function handleKeyPress(e) {
    if (!gameRunning) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = e.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

closeModalBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
});

// Đóng modal khi click bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === gameOverModal) {
        gameOverModal.style.display = 'none';
    }
});

// Khởi tạo game khi trang load
window.addEventListener('load', init);