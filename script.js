// Canvas et contexte
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;

// Serpent
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Score
let score = 0;

// Nourriture
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

// Direction initiale
let direction = "RIGHT";

// Image de banane en base64
const bananaImg = new Image();
bananaImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAV0lEQVQ4T2NkoBAwUqifATEx8P///wMxUYYCTMewwMDAzMDEYRA1JiYiGQgYGRkZhhkAAh3AoFPCQcUQWcGwQwgU4zAxEjMHYIowu4SFCFp8AAC1B1DW61g7MgAAAABJRU5ErkJggg==";

// Dessiner le serpent
function drawSnake() {
    ctx.fillStyle = "red";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Détecter touches clavier
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
});

// Collision avec corps
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Déplacer le serpent
function moveSnake() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    let newHead = { x: headX, y: headY };

    // Collision avec les murs
    if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
        clearInterval(game);
        alert("Game Over ! Tu as touché le mur !");
        return;
    }

    // Collision avec le corps
    if (collision(newHead, snake)) {
        clearInterval(game);
        alert("Game Over ! Tu as touché ton corps !");
        return;
    }

    // Manger la nourriture
    if (headX === food.x && headY === food.y) {
        score++;
        food.x = Math.floor(Math.random() * 20) * box;
        food.y = Math.floor(Math.random() * 20) * box;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

// Boucle de jeu
function gameLoop() {
    // Fond
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessiner la banane
    ctx.drawImage(bananaImg, food.x, food.y, box, box);

    // Afficher le score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    drawSnake();
    moveSnake();
}

// Attendre que l’image soit chargée
bananaImg.onload = function() {
    game = setInterval(gameLoop, 200);
};
