// =======================
// Initialisation du canvas
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

// =======================
// Variables globales
// =======================
let game; // IMPORTANT : déclaration du setInterval
let score = 0;
let direction = "RIGHT";

// =======================
// Serpent
// =======================
let snake = [
    { x: 9 * box, y: 10 * box }
];

// =======================
// Nourriture (banane)
// =======================
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

// =======================
// Image de la banane
// =======================
const bananaImg = new Image();
bananaImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAV0lEQVQ4T2NkoBAwUqifATEx8P///wMxUYYCTMewwMDAzMDEYRA1JiYiGQgYGRkZhhkAAh3AoFPCQcUQWcGwQwgU4zAxEjMHYIowu4SFCFp8AAC1B1DW61g7MgAAAABJRU5ErkJggg==";

// =======================
// Dessiner le serpent
// =======================
function drawSnake() {
    ctx.fillStyle = "red";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// =======================
// Gestion du clavier
// =======================
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
});

// =======================
// Détection collision corps
// =======================
function collision(head, body) {
    for (let i = 0; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }
    return false;
}

// =======================
// Déplacer le serpent
// =======================
function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    const newHead = { x: headX, y: headY };

    // Collision avec les murs
    if (
        headX < 0 ||
        headX >= canvas.width ||
        headY < 0 ||
        headY >= canvas.height
    ) {
        clearInterval(game);
        alert("Game Over ! Tu as touché le mur !");
        return;
    }

    // Collision avec le corps
    if (collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over ! Tu t'es mordu !");
        return;
    }

    // Manger la nourriture
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
// Boucle de jeu
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
    ctx.fillText("Score : " + score, 10, 20);

    drawSnake();
    moveSnake();
}

// =======================
// Lancer le jeu quand l'image est chargée
// =======================
bananaImg.onload = () => {
    game = setInterval(gameLoop, 200);
};

