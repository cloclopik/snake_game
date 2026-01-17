let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let snake, dir, food, speed, gridSize, score, gameInterval, difficulty;

function startGame(diff) {
    difficulty = diff;

    document.getElementById("difficultyMenu").style.display = "none";
    canvas.style.display = "block";

    if (diff === "easy") {
        gridSize = 20;
        speed = 150;
    } else if (diff === "medium") {
        gridSize = 15;
        speed = 100;
    } else {
        gridSize = 10;
        speed = 100; 
    }

    canvas.width = gridSize * 30;
    canvas.height = gridSize * 30;

    restartGame();
}

function restartGame() {
    clearInterval(gameInterval);

    snake = [{x:5, y:5}];
    dir = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;

    spawnFood();

    gameInterval = setInterval(gameLoop, speed);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function gameLoop() {
    let head = {...snake[0]};

    if (dir === "UP") head.y--;
    if (dir === "DOWN") head.y++;
    if (dir === "LEFT") head.x--;
    if (dir === "RIGHT") head.x++;

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width/gridSize || head.y >= canvas.height/gridSize) {
        gameOver();
        return;
    }

    for (let s of snake) {
        if (head.x === s.x && head.y === s.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        spawnFood();

        if (difficulty === "hard") {
            speed = Math.max(50, speed - 5);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x*gridSize, food.y*gridSize, gridSize, gridSize);

    for (let i=0; i<snake.length; i++) {
        ctx.fillStyle = i%2 ? "#0f0" : "#6f6";
        ctx.fillRect(snake[i].x*gridSize, snake[i].y*gridSize, gridSize, gridSize);
    }
}

function gameOver() {
    alert("Game Over ! Score : " + score);
    goToMenu();
}

function goToMenu() {
    canvas.style.display = "none";
    document.getElementById("difficultyMenu").style.display = "block";
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dir !== "DOWN") dir = "UP";
    if (e.key === "ArrowDown" && dir !== "UP") dir = "DOWN";
    if (e.key === "ArrowLeft" && dir !== "RIGHT") dir = "LEFT";
    if (e.key === "ArrowRight" && dir !== "LEFT") dir = "RIGHT";
});
