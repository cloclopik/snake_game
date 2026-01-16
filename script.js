// =======================
// Canvas
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =======================
// Paramètres par niveau
// =======================
const levels = {
    1: { grid: 14, speed: 260 },
    2: { grid: 18, speed: 220 },
    3: { grid: 22, speed: 180 }
};

let gridCount, box, speed, level;

// =======================
// Variables jeu
// =======================
let snake;
let direction;
let food;
let game;
let gameOver = false;

// =======================
// Lancement depuis menu
// =======================
function startGame(selectedLevel) {
    level = selectedLevel;

    gridCount = levels[level].grid;
    speed = levels[level].speed;
    box = canvas.width / gridCount;

    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    initGame();
}

// =======================
// Initialisation
// =======================
function initGame() {
    snake = [{ x: Math.floor(gridCount / 2) * box, y: Math.floor(gridCount / 2) * box }];
    direction = "RIGHT";
    food = randomFood();
    gameOver = false;

    clearInterval(game);
    game = setInterval(gameLoop, speed);
}

// =======================
// Grille
// =======================
function drawGrid() {
    for (let y = 0; y < gridCount; y++) {
        for (let x = 0; x < gridCount; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#6ab04c" : "#badc58";
            ctx.fillRect(x * box, y * box, box, box);
        }
    }
}

// =======================
// Fruit (point noir)
// =======================
function drawFood() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        food.x + box * 0.25,
        food.y + box * 0.25,
        box * 0.5,
        box * 0.5
    );
}

// =======================
// Serpent (tête stylée)
// =======================
function drawSnake() {
    snake.forEach((part, index) => {
        if (index === 0) {
            ctx.fillStyle = "#c0392b";
            ctx.fillRect(part.x, part.y, box, box);

            ctx.fillStyle = "white";
            const eye = box * 0.15;
            ctx.fillRect(part.x + box * 0.2, part.y + box * 0.25, eye, eye);
            ctx.fillRect(part.x + box * 0.6, part.y + box * 0.25, eye, eye);
        } else {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(part.x, part.y, box, box);
        }
    });
}

// =======================
// Nourriture aléatoire
// =======================
function randomFood() {
    return {
        x: Math.floor(Math.random() * gridCount) * box,
        y: Math.floor(Math.random() * gridCount) * box
    };
}

// =======================
// Clavier
// =======================
document.addEventListener("keydown", e => {
    if (gameOver && e.key === "Enter") initGame();

    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// =======================
// Tactile (swipe)
// =======================
let sx = 0, sy = 0;

canvas.addEventListener("touchstart", e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (dy > 0 && direction !== "UP") direction = "DOWN";
        else if (dy < 0 && direction !== "DOWN") direction = "UP";
    }
});

// =======================
// Collision
// =======================
function collision(head) {
    return snake.some(p => p.x === head.x && p.y === head.y);
}

// =======================
// Déplacement
// =======================
function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead)
    ) {
        gameOver = true;
        clearInterval(game);
        return;
    }

    if (headX === food.x && headY === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// =======================
// Boucle
// =======================
function gameLoop() {
    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();
}
