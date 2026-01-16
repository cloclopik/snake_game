// Sécurité : attendre que la page soit chargée
window.onload = () => {

    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    const size = 20;
    const tiles = canvas.width / size;

    let snake;
    let dir;
    let food;
    let score;
    let loop;

    function start() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        dir = { x: 1, y: 0 };
        score = 0;
        document.getElementById("score").textContent = score;
        spawnFood();

        clearInterval(loop);
        loop = setInterval(update, 120);
    }

    function update() {
        move();
        if (collision()) {
            clearInterval(loop);
            alert("💀 Game Over");
            return;
        }
        draw();
    }

    function move() {
        const head = {
            x: snake[0].x + dir.x,
            y: snake[0].y + dir.y
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

    function collision() {
        const h = snake[0];

        if (h.x < 0 || h.y < 0 || h.x >= tiles || h.y >= tiles) {
            return true;
        }

        for (let i = 1; i < snake.length; i++) {
            if (h.x === snake[i].x && h.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * size, food.y * size, size, size);

        // Snake
        snake.forEach((p, i) => {
            ctx.fillStyle = i === 0 ? "lime" : "green";
            ctx.fillRect(p.x * size, p.y * size, size, size);
        });
    }

    document.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" && dir.y === 0) dir = { x: 0, y: -1 };
        if (e.key === "ArrowDown" && dir.y === 0) dir = { x: 0, y: 1 };
        if (e.key === "ArrowLeft" && dir.x === 0) dir = { x: -1, y: 0 };
        if (e.key === "ArrowRight" && dir.x === 0) dir = { x: 1, y: 0 };
    });

    document.getElementById("restart").onclick = start;

    start();
};
