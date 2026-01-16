const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 25;
let snake, direction, food, gameInterval;

function startSnakeGame() {
    clearInterval(gameInterval);

    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";

    food = spawnFood();

    document.onkeydown = changeDirection;

    gameInterval = setInterval(drawSnake, 120);
}

function spawnFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grille verte
    for (let x = 0; x < canvas.width; x += box) {
        for (let y = 0; y < canvas.height; y += box) {
            ctx.fillStyle = (x / box + y / box) % 2 === 0 ? "#6aaa64" : "#4e8234";
            ctx.fillRect(x, y, box, box);
        }
    }

    // Fruit
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#00ffcc" : "#00aa00";
        ctx.fillRect(part.x, part.y, box, box);
    });

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Collision mur
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(s => s.x === head.x && s.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert("Game Over");
        location.reload();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}
