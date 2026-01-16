const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const tiles = canvas.width / tileSize;

let snake, direction, food, score, speed, loop;

// ---------- GAME FLOW ----------

function startGame(selectedSpeed) {
    speed = selectedSpeed;
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("gameover").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    init();
}

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

    clearInterval(loop);
    loop = setInterval(update, speed);
}

function restart() {
    document.getElementById("gameover").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    init();
}

// ---------- UPDATE ----------

function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    draw();
}

// ---------- LOGIC ----------

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

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tiles),
        y: Math.floor(Math.random() * tiles)
    };
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= tiles || head.y >= tiles) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(loop);
    document.getElementById("finalScore").textContent = score;
    document.getElementById("game").classList.add("hidden");
    document.getElementById("gameover").classList.remove("hidden");
}

// ---------- DRAW ----------

function draw() {
    drawGrid();

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Snake
    snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#00ff00" : "#009900";
        ctx.fillRect(p.x * tileSize, p.y * tileSize, tileSize, tileSize);
    });
}

function drawGrid() {
    for (let y = 0; y < tiles; y++) {
        for (let x = 0; x < tiles; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#1e7f1e" : "#145214";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

// ---------- CONTROLS ----------

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
});
