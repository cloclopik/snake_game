// =======================
// Canvas
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = canvas.width / box;

// =======================
// Variables
// =======================
let snake;
let direction;
let food;
let score;
let game;
let gameOver;

// =======================
// Initialisation
// =======================
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    gameOver = false;
    food = randomFood();

    clearInterval(game);
    game = setInterval(gameLoop, 150);
}

// =======================
// Grille verte
// =======================
function drawGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle =
                (x + y) % 2 === 0 ? "#6ab04c" : "#badc58";
            ctx.fillRect(x * box, y * box, box, box);
        }
    }
}

// =======================
// Fruit = POINT NOIR
// =======================
function drawFood() {
    ctx.fillStyle = "black";
    ctx.fillRect(
        food.x + box / 4,
        food.y + box / 4,
        box / 2,
        box / 2
    );
}

// =======================
// Serpent
// =======================
function drawSnake() {
    ctx.fillStyle = "red";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });
}

// =======================
// Nourriture aléatoire
// =======================
function randomFood() {
    return {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };
}

// =======================
// Clavier
// =======================
document.addEventListener("keydown", e => {
    if (gameOver && e.key === "Enter") {
        initGame();
        return;
    }

    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// =======================
// Tactile (Swipe)
// =======================
let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    if (gameOver) {
        initGame();
        return;
    }

    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

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
function collision(head, body) {
    return body.some(p => p.x === head.x && p.y === head.y);
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
        collision(newHead, snake)
    ) {
        gameOver = true;
        clearInterval(game);
        return;
    }

    if (headX === food.x && headY === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// =======================
// Boucle principale
// =======================
function gameLoop() {
    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Score : " + score, 10, 20);

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.font = "14px Arial";
        ctx.fillText(
            "Entrée ou toucher l'écran pour rejouer",
            canvas.width / 2,
            canvas.height / 2 + 25
        );
        ctx.textAlign = "left";
    }
}

// =======================
// Démarrage
// =======================
initGame();
