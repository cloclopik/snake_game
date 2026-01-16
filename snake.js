let snakeCanvas, ctx;
let snakeInterval = null;

const tileSize = 32;
const gridSize = 15;

let snake, direction, food;

function initSnake() {
  snake = [{ x: 7, y: 7 }];
  direction = { x: 1, y: 0 };
  spawnFood();
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function updateSnake() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= gridSize || head.y >= gridSize ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    stopSnake();
    alert("Game Over");
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    spawnFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  // food (point blanc)
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    food.x * tileSize + tileSize / 2,
    food.y * tileSize + tileSize / 2,
    tileSize / 4,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // snake
  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(
      s.x * tileSize,
      s.y * tileSize,
      tileSize,
      tileSize
    );
  });
}

function gameLoop() {
  updateSnake();
  drawSnake();
}

function handleKey(e) {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };
}

/* =========================
   API PUBLIQUE
========================= */

window.startSnake = function () {
  snakeCanvas = document.getElementById("gameCanvas");
  ctx = snakeCanvas.getContext("2d");

  snakeCanvas.width = tileSize * gridSize;
  snakeCanvas.height = tileSize * gridSize;

  initSnake();
  document.addEventListener("keydown", handleKey);

  snakeInterval = setInterval(gameLoop, 150);
};

window.stopSnake = function () {
  clearInterval(snakeInterval);
  snakeInterval = null;
  document.removeEventListener("keydown", handleKey);
};


