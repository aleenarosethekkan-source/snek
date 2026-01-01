const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = {};
let score = 0;
let direction = 'right';
let changingDirection = false;
let gameSpeed = 200; // ms per update
let lastUpdateTime = 0;
let gameOver = false;

function main(currentTime) {
    if (gameOver) {
        alert("Game Over! Your score: " + score);
        document.location.reload();
        return;
    }

    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastUpdateTime) / 1000;
    if (secondsSinceLastRender < 1 / (1000 / gameSpeed)) return;

    lastUpdateTime = currentTime;

    changingDirection = false;
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (hasGameEnded(head)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        if (gameSpeed > 50) {
          gameSpeed -= 5;
        }
        createFood();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = '#4CAF50'; // Snake color
    ctx.strokeStyle = '#388E3C'; // Snake border
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = '#f44336'; // Food color
    ctx.strokeStyle = '#d32f2f'; // Food border
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));

    // Ensure food doesn't spawn on the snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            createFood();
        }
    });
}

function hasGameEnded(head) {
    // Wall collision
    if (head.x < 0 || head.x * gridSize >= canvas.width || head.y < 0 || head.y * gridSize >= canvas.height) {
        return true;
    }
    // Self collision
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.key;
    const goingUp = direction === 'up';
    const goingDown = direction === 'down';
    const goingLeft = direction === 'left';
    const goingRight = direction === 'right';

    if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && !goingDown) {
        direction = 'up';
    }
    if ((keyPressed === 'ArrowDown' || keyPressed === 's') && !goingUp) {
        direction = 'down';
    }
    if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && !goingRight) {
        direction = 'left';
    }
    if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && !goingLeft) {
        direction = 'right';
    }
}

document.addEventListener('keydown', changeDirection);

createFood();
window.requestAnimationFrame(main);
