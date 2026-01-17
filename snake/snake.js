const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tileSize;
let tiles;
let snake;
let direction;
let food;
let score;
let speed;
let loop;

const levels = {
    easy:   { grid: 15, speed: 160 },
    normal: { grid: 20, speed: 100 },
    hard:   { grid: 25, speed: 60 }
};

function startGame(level) {
    tiles = levels[level].grid;
    speed = levels[level].speed;

    // adapte la taille des cases selon la difficulté
    tileSize = Math.floor(400 / tiles);

    canvas.width = tiles * tileSize;
    canvas.height = tiles * tileSize;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    init();
}

function init() {
    snake = [
        {x: Math.floor(tiles/2), y: Math.floor(tiles/2)},
        {x: Math.floor(tiles/2)-1, y: Math.floor(tiles/2)},
        {x: Math.floor(tiles/2)-2, y: Math.floor(tiles/2)}
    ];

    direction = {x:1, y:0};
    score = 0;
    document.getElementById("score").textContent = score;

    spawnFoodSafe();

    clearInterval(loop);
    loop = setInterval(update, speed);
}

function spawnFoodSafe() {
    do {
        food = {
            x: Math.floor(Math.random()*tiles),
            y: Math.floor(Math.random()*tiles)
        };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    draw();
}

function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        spawnFoodSafe();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= tiles || head.y >= tiles)
        return true;

    return snake.slice(1).some(p => p.x === head.x && p.y === head.y);
}

function gameOver() {
    clearInterval(loop);
    document.getElementById("finalScore").textContent = score;
    document.getElementById("game").classList.add("hidden");
    document.getElementById("gameover").classList.remove("hidden");
}

function restart() {
    document.getElementById("gameover").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    init();
}

function backToDifficulty() {
    clearInterval(loop);
    document.getElementById("game").classList.add("hidden");
    document.getElementById("gameover").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
}

function draw() {
    drawGrid();

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#00ff00" : "#009900";
        ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
    });
}

function drawGrid() {
    for (let y = 0; y < tiles; y++) {
        for (let x = 0; x < tiles; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#2ecc71" : "#27ae60";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = {x:0,y:-1};
    if (e.key === "ArrowDown" && direction.y === 0) direction = {x:0,y:1};
    if (e.key === "ArrowLeft" && direction.x === 0) direction = {x:-1,y:0};
    if (e.key === "ArrowRight" && direction.x === 0) direction = {x:1,y:0};
});
