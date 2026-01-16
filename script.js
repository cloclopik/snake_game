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
let game;
let score;
let direction;
let snake;
let food;
let gameOver = false;

// =======================
// Initialisation
// =======================
function initGame() {
    score = 0;
    direction = "RIGHT";
    gameOver = false;

    snake = [{ x: 9 * box, y: 10 * box }];

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
// Fruit (canvas)
// =======================
function drawFood() {
    ctx.fillStyle = "#f9ca24";
    ctx.beginPath();
    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// =======================
// Serpent
// =======================
function drawSnake() {
    ctx.fillStyle = "#ff3f34";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });
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
// Contrôle tactile (SWIPE)
// =======================
let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
});

canvas.addEventListener("touchend", e => {
    if (gameOver) {
        initGame();
        return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

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
// Nourriture aléatoire
// =======================
function randomFood() {
    return {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };
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
        endGame();
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
// Fin
// =======================
function endGame() {
    gameOver = true;
    clearInterval(game);
}

// =======================
// Boucle principale
// =======================
function gameLoop() {
    drawGrid();
    drawFood();

    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("Score : " + score, 10, 20);

    drawSnake();
    moveSnake();

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

        ctx.font = "16px Arial";
        ctx.fillText(
            "Appuie sur Entrée ou tape pour rejouer",
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
