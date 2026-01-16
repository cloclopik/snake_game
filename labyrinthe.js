let labCanvas, labCtx;
let labInterval = null;

/* =========================
   LANCEMENT DU JEU
========================= */

window.startLabyrinthe = function () {
  labCanvas = document.getElementById("gameCanvas");
  labCtx = labCanvas.getContext("2d");

  labCanvas.width = 640;
  labCanvas.height = 640;

  drawLabTitle();
};

/* =========================
   STOP DU JEU
========================= */

window.stopLabyrinthe = function () {
  clearInterval(labInterval);
  labInterval = null;
};

/* =========================
   AFFICHAGE TITRE
========================= */

function drawLabTitle() {
  labCtx.clearRect(0, 0, labCanvas.width, labCanvas.height);

  labCtx.fillStyle = "black";
  labCtx.fillRect(0, 0, labCanvas.width, labCanvas.height);

  labCtx.fillStyle = "white";
  labCtx.font = "48px Arial";
  labCtx.textAlign = "center";

  labCtx.fillText(
    "Labyrinthe Killer",
    labCanvas.width / 2,
    labCanvas.height / 2
  );

  labCtx.font = "20px Arial";
  labCtx.fillText(
    "Chargement...",
    labCanvas.width / 2,
    labCanvas.height / 2 + 40
  );
}

