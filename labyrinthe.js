let labInterval;
let player;

function launchLabyrinthe() {
  showGame();
  startLabyrinthe();
}

function startLabyrinthe() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  player = {
    x: 300,
    y: 300,
    size: 24,
    speed: 3,
    life: 3
  };

  document.addEventListener("keydown", movePlayer);

  labInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Joueur
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // HUD Vie
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Vie : " + player.life, 10, 20);

    // Titre
    ctx.font = "20px Arial";
    ctx.fillText("Labyrinthe Killer", canvas.width / 2 - 90, 30);

  }, 60);
}

function movePlayer(e) {
  if (e.key === "ArrowUp" || e.key === "z") player.y -= player.speed;
  if (e.key === "ArrowDown" || e.key === "s") player.y += player.speed;
  if (e.key === "ArrowLeft" || e.key === "q") player.x -= player.speed;
  if (e.key === "ArrowRight" || e.key === "d") player.x += player.speed;
}

function stopLabyrinthe() {
  clearInterval(labInterval);
  document.removeEventListener("keydown", movePlayer);
}
