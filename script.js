// =======================
// Canvas
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =======================
// Paramètres dynamiques
// =======================
let level = 1;
let gridCount = 20;     // nombre de cases par ligne
let box = canvas.width / gridCount;
let speed = 200;        // vitesse plus lente

// =======================
// Variables jeu
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
function initGame(resetLevel = false) {
    if (resetLevel) {
        level = 1;
        gridCount = 20;
        speed = 200;
    }

    box = canvas.width / gridCount;

    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    gameOver = false;
    food = randomFood();

    document.getElementById("levelText").textContent = "Niveau : " + level;

    clearInterval(game);
    game = setInterval(gameLoop, speed);
}

// =======================
// Grille
// =======================
function drawGrid() {
    for (let y = 0; y < gridCount; y++) {
        for (let x = 0; x < gridCount; x++) {
            ctx.fillStyle =
                (x + y) % 2 === 0 ? "#6ab04c" : "#badc58";
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
// Serpent (tête spéciale)
// =======================
function drawSnake() {
    snake.forEach((part, index) => {
        if (index === 0) {
            // Tête
            ctx.fillStyle = "#c0392b";
            ctx.fillRect(part.x, part.y, box, box);

            // Yeux
            ctx.fillStyle = "white";
            const eyeSize = box * 0.15;

            let eye1X = part.x + box * 0.25;
            let eye2X = part.x + box * 0.6;
            let eyeY = part.y + box * 0.25;

            if (direction === "UP") eyeY = part.y + box * 0.15;
            if (direction === "DOWN") eyeY = part.y + box * 0.6;

            ctx.fillRect(eye1X, eyeY, eyeSize, eyeSize);
            ctx.fillRect(eye2X, eyeY, eyeSize, eyeSize);
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
    if (gameOver && e.key === "Enter") {
        initGame(true);
        return;
    }

    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// =======================
// Tactile (swipe)
// =======================
let startX = 0;
let startY = 0;

canvas.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    if (gameOver) {
        initGame(true);
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

        // Passage au niveau suivant
        if (score % 5 === 0) {
            level++;
            gridCount += 2;      // plus de cases
            speed -= 10;         // légèrement plus rapide
            initGame();
            return;
        }

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
}

// =======================
// Démarrage
// =======================
initGame(true);
