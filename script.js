// Récupérer le canvas et son contexte pour dessiner
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // contexte 2D

// Taille d'une case du serpent
const box = 20;

// Créer le serpent : un tableau de positions
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box }; // point de départ

// Direction initiale
let direction = "RIGHT";

// Dessiner le serpent
function drawSnake() {
    ctx.fillStyle = "lime"; // couleur du serpent
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Détecter les touches pour changer la direction
document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// Déplacer le serpent
function moveSnake() {
    // Créer une nouvelle tête
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Ajouter la nouvelle tête au début du tableau
    snake.unshift({ x: headX, y: headY });

    // Supprimer la dernière partie pour que le serpent reste de même taille
    snake.pop();
}

// Boucle du jeu : efface le canvas, dessine le serpent, et le déplace
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // efface le canvas
    drawSnake();   // dessine le serpent
    moveSnake();   // bouge le serpent
}

// Lancer la boucle toutes les 200ms
let game = setInterval(gameLoop, 200);
