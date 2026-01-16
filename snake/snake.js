const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let snake;
let direction;
let food;
let score;
let gameLoop;

// INITIALISATION
function init() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    score = 0;
    document.getElementById("score").textContent = score;
    spawnFood();

    clearInterval(gameLoop);
    gameLoop = setInterval(update, 120);
}

// BOUCLE DU JEU
function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    draw();
}

// DEPLACEMENT
function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

// NOURRITURE (NE SPAWN PAS DANS LE SNAKE)
function spawnFood() {
    let valid = false;
    while (!valid) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        valid = !snake.some(part => part.x === food.x && part.y === food.y);
    }
}

// COLLISIONS
function checkCollision() {
    const head = snake[0];

    // murs
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= tileCount || head.y >= tileCount
    ) {
        return true;
    }

    // corps
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// GAME OVER
function gameOver() {
    clearInterval(gameLoop);
    alert("💀 Game Over !");
}

// DESSIN
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // nourriture
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize,
        tileSize
    );

    // snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(
            part.x * tileSize,
            part.y * tileSize,
            tileSize,
            tileSize
        );
    });
}

// CONTROLES
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// RESTART
function restart() {
    init();
}

// LANCEMENT
init();
