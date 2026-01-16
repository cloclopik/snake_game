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
// Image banane
// =======================
const bananaImg = new Image();
bananaImg.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAV0lEQVQ4T2NkoBAwUqifATEx8P///wMxUYYCTMewwMDAzMDEYRA1JiYiGQgYGRkZhhkAAh3AoFPCQcUQWcGwQwgU4zAxEjMHYIowu4SFCFp8AAC1B1DW61g7MgAAAABJRU5ErkJggg==";

// =======================
// Initialisation
// =======================
function initGame() {
    score = 0;
    direction = "RIGHT";
    gameOver = false;

    snake = [{ x: 9 * box, y: 10 * box }];

    food = {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };

    clearInterval(game);
    game = setInterval(gameLoop, 150);
}

// =======================
// Dessin de la grille
// =======================
function drawGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#6ab04c" : "#badc58";
            ctx.fillRect(x * box, y * box, box, box);
        }
    }
}

// =======================
// Dessin du serpent
// =======================
function drawSnake() {
    ctx.fillStyle = "#ff3f34";
    for (let part of snake) {
        ctx.fillRect(part.x, part.y, box, box);
    }
}

// =======================
// Clavier
// =======================
document.addEventListener("keydown", (e) => {
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
// Collision
// =======================
function collision(head, body) {
    return body.some(part => head.x === part.x && head.y === part.y);
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

    // Mur
    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height
    ) {
        endGame();
        return;
    }

    // Corps
    if (collision(newHead, snake)) {
        endGame();
        return;
    }

    // Nourriture
    if (headX === food.x && headY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };
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

    ctx.drawImage(bananaImg, food.x, food.y, box, box);

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
            "Appuie sur Entrée pour rejouer",
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

