let stars = [];
let bullets = [];
let enemies = [];
let particles = [];
let playerX = 0;
let playerY = 0;
let playerRadius = 16;
let playerSpeed = 15;
let bulletRadius = 4;
let bulletSpeed = 20;
let enemyRadius = 12;
let enemySpeed = 2;
let score = 0;
let gameOver = false;
let prevSpaceDown = false;
function setup(){
  createCanvas(400,600);
  for(let i=0;i<30;i++){
    let s = {
      x: random(0,width),
      y: random(0,height),
      speed: random(0.5,2.5),
      size: random(1,3)
    };
    stars.push(s);
  }
  playerX = width/2;
  playerY = height - 40;
  score = 0;
  gameOver = false;
  prevSpaceDown = false;
  bullets = [];
  enemies = [];
  particles = [];
}
function draw(){
  background(0);
  noStroke();
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.speed = random(0.5,2.5);
      s.size = random(1,3);
    }
    circle(s.x,s.y,s.size);
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX += playerSpeed;
    }
    let spaceDown = keyIsDown(32);
    if(spaceDown && !prevSpaceDown){
      let b = {x: playerX, y: playerY - playerRadius, r: bulletRadius, vy: -bulletSpeed};
      bullets.push(b);
    }
    prevSpaceDown = keyIsDown(32);
  } else {
    prevSpaceDown = keyIsDown(32);
  }
  if(!gameOver && frameCount % 60 === 0){
    let ex = random(enemyRadius, width - enemyRadius);
    let e = {x: ex, y: -enemyRadius, r: enemyRadius, vy: enemySpeed};
    enemies.push(e);
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y += b.vy;
    fill(200,200,255);
    circle(b.x,b.y,b.r*2);
    if(b.y < -b.r){
      bullets.splice(i,1);
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    e.y += e.vy;
    fill(255,100,100);
    circle(e.x,e.y,e.r*2);
    if(e.y > height + e.r){
      enemies.splice(i,1);
      continue;
    }
    let d = dist(e.x,e.y,playerX,playerY);
    if(d < e.r + playerRadius){
      gameOver = true;
    }
  }
  for(let ei=enemies.length-1;ei>=0;ei--){
    let e = enemies[ei];
    let hit = false;
    for(let bi=bullets.length-1;bi>=0;bi--){
      let b = bullets[bi];
      let d = dist(e.x,e.y,b.x,b.y);
      if(d < e.r + b.r){
        for(let k=0;k<5;k++){
          let angle = random(0, TWO_PI);
          let speed = random(1,4);
          let p = {
            x: e.x,
            y: e.y,
            r: 3,
            life: 20,
            vx: cos(angle)*speed,
            vy: sin(angle)*speed
          };
          particles.push(p);
        }
        score += 1;
        bullets.splice(bi,1);
        enemies.splice(ei,1);
        hit = true;
        break;
      }
    }
    if(hit){
      continue;
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life,0,20,0,255);
    if(alpha < 0){ alpha = 0; }
    fill(255,200,0,alpha);
    circle(p.x,p.y,p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(100,200,255);
  triangle(playerX - playerRadius, playerY + playerRadius, playerX + playerRadius, playerY + playerRadius, playerX, playerY - playerRadius);
  fill(255);
  textSize(18);
  textAlign(LEFT,TOP);
  text("Score: " + score, 10, 10);
  if(gameOver){
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
