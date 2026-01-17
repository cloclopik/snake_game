const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tile = canvas.width / gridSize;

let player = { x: 1, y: 1, hp: 3 };
let treasure = { x: 18, y: 18 };
let enemies = [
    { x: 10, y: 10, cooldown: 0 },
    { x: 5, y: 15, cooldown: 0 }
];

let bullets = [];

const maze = Array.from({length: gridSize}, (_,y)=>
    Array.from({length: gridSize}, (_,x)=>
        (x===0||y===0||x===gridSize-1||y===gridSize-1||Math.random()<0.1)?1:0
    )
);

maze[1][1]=0;
maze[treasure.y][treasure.x]=0;

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let y=0;y<gridSize;y++){
        for(let x=0;x<gridSize;x++){
            if(maze[y][x]===1){
                ctx.fillStyle="#2ecc71";
                ctx.fillRect(x*tile,y*tile,tile,tile);
            }
        }
    }

    ctx.fillStyle="gold";
    ctx.fillRect(treasure.x*tile,treasure.y*tile,tile,tile);

    ctx.fillStyle="red";
    enemies.forEach(e=>ctx.fillRect(e.x*tile,e.y*tile,tile,tile));

    ctx.fillStyle="white";
    ctx.fillRect(player.x*tile,player.y*tile,tile,tile);

    ctx.fillStyle="orange";
    bullets.forEach(b=>ctx.fillRect(b.x*tile,b.y*tile,5,5));
}

function update() {
    enemies.forEach(e=>{
        if(e.cooldown<=0){
            let dx = player.x - e.x;
            let dy = player.y - e.y;
            if(Math.abs(dx)+Math.abs(dy)<8){
                bullets.push({x:e.x,y:e.y,dx:Math.sign(dx),dy:Math.sign(dy)});
                e.cooldown=20;
            }
        }
        e.cooldown--;
    });

    bullets.forEach(b=>{
        b.x+=b.dx*0.2;
        b.y+=b.dy*0.2;

        if(Math.floor(b.x)===player.x && Math.floor(b.y)===player.y){
            player.hp--;
            document.getElementById("hp").textContent=player.hp;
        }
    });

    bullets = bullets.filter(b=>b.x>0&&b.y>0&&b.x<gridSize&&b.y<gridSize);

    if(player.hp<=0) gameOver();

    if(player.x===treasure.x && player.y===treasure.y){
        addGold(10);
        alert("Niveau terminé ! +10 gold");
        restart();
    }

    draw();
}

function move(dx,dy){
    let nx=player.x+dx;
    let ny=player.y+dy;
    if(maze[ny][nx]===0){
        player.x=nx;
        player.y=ny;
    }
}

document.addEventListener("keydown",e=>{
    if(e.key==="ArrowUp") move(0,-1);
    if(e.key==="ArrowDown") move(0,1);
    if(e.key==="ArrowLeft") move(-1,0);
    if(e.key==="ArrowRight") move(1,0);
});

function gameOver(){
    document.getElementById("gameover").classList.remove("hidden");
}

function restart(){
    location.reload();
}

setInterval(update,120);
document.getElementById("gold").textContent=getGold();
