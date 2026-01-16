let snakeCanvas;
let snakeCtx;
let snake;
let food;
let direction;
let snakeInterval;

function startSnake() {
    snakeCanvas = document.getElementById("gameCanvas");
    snakeCtx = snakeCanvas.getContext("2d");

    snake = [{ x: 10, y: 10 }];
    food = spawnFood();
    direction = "RIGHT";

    clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 120);

    document.addEventListener("keydown", changeDirection);
}

function updateSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y--;
    if (direction === "DOWN") head.y++;
    if (direction === "LEFT") head.x--;
    if (direction === "RIGHT") head.x++;

    // Collision mur
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= 30 || head.y >= 30
    ) {
        gameOver();
        return;
    }

    // Collision corps
    for (let part of snake) {
        if (part.x === head.x && part.y === head.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    snakeCtx.clearRect(0, 0, 600, 600);

    // Snake
    snakeCtx.fillStyle = "lime";
    snake.forEach(p =>
        snakeCtx.fillRect(p.x * 20, p.y * 20, 20, 20)
    );

    // Food
    snakeCtx.fillStyle = "red";
    snakeCtx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30)
    };
}

function changeDirection(e) {
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function gameOver() {
    clearInterval(snakeInterval);
    alert("Game Over !");
    location.reload();
}
