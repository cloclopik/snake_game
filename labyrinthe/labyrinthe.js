const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let gameOver = false;

let player = {x:30, y:30, life:3};
let treasure = {x:550, y:550};

let bullets = [];

let enemies = [
    {x:200,y:200,alive:true},
    {x:350,y:150,alive:true},
    {x:400,y:400,alive:true}
];

// ------------------- SHOOT -------------------
function shoot(mx,my){
    if(gameOver) return;

    let centerX = player.x + 10;
    let centerY = player.y + 10;

    let dx = mx - centerX;
    let dy = my - centerY;
    let dist = Math.sqrt(dx*dx + dy*dy);

    bullets.push({
        x: centerX,
        y: centerY,
        vx: (dx/dist)*8,
        vy: (dy/dist)*8
    });
}

canvas.addEventListener("click", e=>{
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    shoot(mx,my);
});

// ------------------- UPDATE BULLETS -------------------
function updateBullets(){
    for(let b of bullets){
        b.x += b.vx;
        b.y += b.vy;

        for(let enemy of enemies){
            if(enemy.alive &&
               b.x > enemy.x && b.x < enemy.x+20 &&
               b.y > enemy.y && b.y < enemy.y+20){
                enemy.alive = false;
            }
        }
    }

    bullets = bullets.filter(b => b.x>0 && b.y>0 && b.x<600 && b.y<600);
}

// ------------------- ENEMY ATTACK -------------------
function enemiesShoot(){
    if(gameOver) return;

    for(let enemy of enemies){
        if(!enemy.alive) continue;

        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 150){
            player.life -= 1;
            if(player.life <= 0){
                gameOver = true;
            }
        }
    }
}

// ------------------- DRAW -------------------
function draw(){
    ctx.clearRect(0,0,600,600);

    if(gameOver){
        ctx.fillStyle="white";
        ctx.font="40px Arial";
        ctx.fillText("GAME OVER",200,300);
        return;
    }

    ctx.fillStyle="white";
    ctx.fillRect(player.x,player.y,20,20);

    ctx.fillStyle="yellow";
    ctx.fillRect(treasure.x,treasure.y,20,20);

    for(let enemy of enemies){
        if(enemy.alive){
            ctx.fillStyle="red";
            ctx.fillRect(enemy.x,enemy.y,20,20);
        }
    }

    for(let b of bullets){
        ctx.fillStyle="orange";
        ctx.fillRect(b.x,b.y,5,5);
    }

    for(let i=0;i<player.life;i++){
        ctx.fillStyle="red";
        ctx.fillRect(10+i*25,570,20,20);
    }
}

// ------------------- MOVEMENT -------------------
document.addEventListener("keydown", e=>{
    if(gameOver) return;

    if(e.key==="ArrowUp") player.y-=10;
    if(e.key==="ArrowDown") player.y+=10;
    if(e.key==="ArrowLeft") player.x-=10;
    if(e.key==="ArrowRight") player.x+=10;
});

// ------------------- LOOP -------------------
function gameLoop(){
    updateBullets();
    enemiesShoot();
    draw();
}

setInterval(gameLoop, 1000/30);
