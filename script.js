// =======================
// Canvas
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

// =======================
// Variables globales
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
// Initialisation / Reset
// =======================
function initGame() {
    score = 0;
    direction = "RIGHT";
    gameOver = false;

    snake = [
        { x: 9 * box, y: 10 * box }
    ];

    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };

    clearInterval(game);
    game = setInterval(gameLoop, 150);
}

// =======================
// Dessin du serpent
// =======================
function drawSnake() {
    ctx.fillStyle = "red";
    for (let part of snake) {
        ctx.fillRect(part.x, part.y, box, box);
    }
}

// =======================
// Contrôles clavier
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
// Collision avec soi-même
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
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// =======================
// Fin de partie
// =======================
function endGame() {
    gameOver = true;
    clearInterval(game);
}

// =======================
// Boucle principale
// =======================
function gameLoop() {
    // Fond
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Banane
    ctx.drawImage(bananaImg, food.x, food.y, box, box);

    // Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score : " + score, 10, 25);

    drawSnake();
    moveSnake();

    // Game Over
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = "16px Arial";
        ctx.fillText(
            "Appuie sur Entrée pour rejouer",
            canvas.width / 2,
            canvas.height / 2 + 20
        );

        ctx.textAlign = "left";
    }
}

// =======================
// Démarrage
// =======================
initGame();
