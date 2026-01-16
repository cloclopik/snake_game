const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");

// =======================
// Niveaux
// =======================
const levels = {
    1: { grid: 12, speed: 320 },
    2: { grid: 16, speed: 260 },
    3: { grid: 20, speed: 220 }
};

let gridCount, box, speed;
let snake, direction, food, game;

// =======================
// DÉMARRAGE
// =======================
function startGame(level) {
    const config = levels[level];

    gridCount = config.grid;
    speed = config.speed;
    box = canvas.width / gridCount;

    menu.style.display = "none";
    canvas.style.display = "block";

    initGame();
}
window.startGame = startGame;

// =======================
function initGame() {
    snake = [{
        x: Math.floor(gridCount / 2) * box,
        y: Math.floor(gridCount / 2) * box
    }];
    direction = "RIGHT";
    food = randomFood();

    clearInterval(game);
    game = setInterval(gameLoop, speed);
}

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
function drawFood() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        food.x + box * 0.3,
        food.y + box * 0.3,
        box * 0.4,
        box * 0.4
    );
}

// =======================
function drawSnake() {
    snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#c0392b" : "#e74c3c";
        ctx.fillRect(p.x, p.y, box, box);

        if (i === 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(p.x + box * 0.2, p.y + box * 0.25, box * 0.15, box * 0.15);
            ctx.fillRect(p.x + box * 0.6, p.y + box * 0.25, box * 0.15, box * 0.15);
        }
    });
}

// =======================
function randomFood() {
    return {
        x: Math.floor(Math.random() * gridCount) * box,
        y: Math.floor(Math.random() * gridCount) * box
    };
}

// =======================
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// =======================
function collision(head) {
    return snake.some(p => p.x === head.x && p.y === head.y);
}

// =======================
function moveSnake() {
    let { x, y } = snake[0];

    if (direction === "LEFT") x -= box;
    if (direction === "RIGHT") x += box;
    if (direction === "UP") y -= box;
    if (direction === "DOWN") y += box;

    const head = { x, y };

    if (
        x < 0 || y < 0 ||
        x >= canvas.width || y >= canvas.height ||
        collision(head)
    ) {
        clearInterval(game);
        menu.style.display = "block";
        canvas.style.display = "none";
        return;
    }

    if (x === food.x && y === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// =======================
function gameLoop() {
    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();
}
