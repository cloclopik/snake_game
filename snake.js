function startSnakeGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const box = 25;
    let snake = [{ x: 10 * box, y: 10 * box }];
    let direction = "RIGHT";
    let food = spawnFood();
    let interval = setInterval(draw, 130);

    document.onkeydown = changeDirection;

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

    function changeDirection(e) {
        if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
        if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // grille verte
        for (let x = 0; x < canvas.width; x += box) {
            for (let y = 0; y < canvas.height; y += box) {
                ctx.fillStyle = (x / box + y / box) % 2 ? "#4e8234" : "#6aaa64";
                ctx.fillRect(x, y, box, box);
            }
        }

        // fruit
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
        ctx.fill();

        // snake
        snake.forEach((p, i) => {
            ctx.fillStyle = i === 0 ? "#00ffff" : "#00aa00";
            ctx.fillRect(p.x, p.y, box, box);
        });

        let head = { ...snake[0] };
        if (direction === "LEFT") head.x -= box;
        if (direction === "UP") head.y -= box;
        if (direction === "RIGHT") head.x += box;
        if (direction === "DOWN") head.y += box;

        if (
            head.x < 0 || head.y < 0 ||
            head.x >= canvas.width || head.y >= canvas.height ||
            snake.some(s => s.x === head.x && s.y === head.y)
        ) {
            clearInterval(interval);
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
}
