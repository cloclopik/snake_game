let snakeInterval;
let snake;
let direction;
let food;
let score;

const box = 30;
const grid = 20;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function launchSnake() {
  showGame();
  document.getElementById("snakeUI").style.display = "block";
  startSnake();
}

function startSnake() {
  clearInterval(snakeInterval);

  snake = [{ x: 10 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  food = randomFood();

  document.getElementById("scoreSnake").innerText = "Score : 0";

  document.addEventListener("keydown", changeDirection);

  snakeInterval = setInterval(gameLoop, 150);
}

function stopSnake() {
  clearInterval(snakeInterval);
  document.removeEventListener("keydown", changeDirection);
  document.getElementById("snakeUI").style.display = "none";
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
}

function drawGrid() {
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "#2ecc71" : "#27ae60";
      ctx.fillRect(i * box, j * box, box, box);
    }
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "yellow" : "lime";
    ctx.fillRect(part.x, part.y, box, box);

    ctx.strokeStyle = "black";
    ctx.strokeRect(part.x, part.y, box, box);
  });
}

function moveSnake() {
  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Collision mur
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snakeCollision(head)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("scoreSnake").innerText = "Score : " + score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function snakeCollision(head) {
  return snake.some(part => part.x === head.x && part.y === head.y);
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 3, 0, Math.PI * 2);
  ctx.fill();
}

function randomFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * grid) * box,
      y: Math.floor(Math.random() * grid) * box
    };
  } while (snake.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function gameOver() {
  stopSnake();

  setTimeout(() => {
    if (confirm("Game Over 😵\nRejouer ?")) {
      launchSnake();
    } else {
      showMenu();
    }
  }, 100);
}
