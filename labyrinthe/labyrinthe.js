const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let life = 3;
let gold = 0;
let gameActive = true;

const player = { x: 50, y: 50, size: 20 };

const enemies = [
    { x: 200, y: 100, size: 20 },
    { x: 300, y: 250, size: 20 }
];

function drawPlayer() {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));
}

function drawMaze() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, 10);
    ctx.fillRect(0, 0, 10, canvas.height);
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
}

function updateHud() {
    document.getElementById("life").textContent = life;
    document.getElementById("gold").textContent = gold;
}

function gameOver() {
    gameActive = false;
    document.getElementById("gameOver").classList.remove("hidden");
}

canvas.addEventListener("click", e => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = 0; i < enemies.length; i++) {
        let en = enemies[i];

        if (
            mx > en.x && mx < en.x + en.size &&
            my > en.y && my < en.y + en.size
        ) {
            enemies.splice(i, 1);
            break;
        }
    }
});

function enemyShoot() {
    if (!gameActive) return;

    enemies.forEach(en => {
        if (Math.random() < 0.02) {
            if (
                Math.abs(player.x - en.x) < 50 &&
                Math.abs(player.y - en.y) < 50
            ) {
                life--;
                updateHud();
                if (life <= 0) gameOver();
            }
        }
    });
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze();
    drawPlayer();
    drawEnemies();
    enemyShoot();

    if (gameActive) requestAnimationFrame(loop);
}

updateHud();
loop();
