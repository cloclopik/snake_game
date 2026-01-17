const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let player = {x:30, y:30, life:3};
let treasure = {x:550, y:550};
let gold = 0;

let bullets = [];
let enemies = [
    {x:200,y:200,alive:true},
    {x:350,y:150,alive:true},
    {x:400,y:400,alive:true}
];

function shoot(targetX, targetY){
    let dx = targetX - player.x;
    let dy = targetY - player.y;
    let dist = Math.sqrt(dx*dx + dy*dy);

    bullets.push({
        x: player.x+10,
        y: player.y+10,
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

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // joueur
    ctx.fillStyle="white";
    ctx.fillRect(player.x,player.y,20,20);

    // trésor
    ctx.fillStyle="yellow";
    ctx.fillRect(treasure.x,treasure.y,20,20);

    // ennemis
    for(let enemy of enemies){
        if(enemy.alive){
            ctx.fillStyle="red";
            ctx.fillRect(enemy.x,enemy.y,20,20);
        }
    }

    // balles
    for(let b of bullets){
        ctx.fillStyle="orange";
        ctx.fillRect(b.x,b.y,5,5);
    }

    // vie
    for(let i=0;i<player.life;i++){
        ctx.fillStyle="red";
        ctx.fillRect(10+i*25,570,20,20);
    }
}

function gameLoop(){
    updateBullets();
    draw();
}

document.addEventListener("keydown", e=>{
    if(e.key==="ArrowUp") player.y-=10;
    if(e.key==="ArrowDown") player.y+=10;
    if(e.key==="ArrowLeft") player.x-=10;
    if(e.key==="ArrowRight") player.x+=10;
});

setInterval(gameLoop, 1000/60);
