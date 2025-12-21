let playerX;
let playerY;
let playerSpeed;
let playerRadius;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let shootTimer;
const SHOOT_COOLDOWN = 8;
const CANVAS_W = 400;
const CANVAS_H = 600;
function setup(){
  createCanvas(CANVAS_W,CANVAS_H);
  playerRadius = 16;
  playerSpeed = 5;
  playerX = width/2;
  playerY = height - 40;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  shootTimer = 0;
  for(let i=0;i<30;i++){
    let s = {
      x: random(0,width),
      y: random(0,height),
      r: random(1,3),
      speed: random(0.5,2)
    };
    stars.push(s);
  }
  noStroke();
  textAlign(LEFT,TOP);
  textSize(18);
}
function draw(){
  background(0);
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    s.y += s.speed;
    ellipse(s.x,s.y,s.r,s.r);
    if(s.y > height){
      s.x = random(0,width);
      s.y = random(-10,0);
      s.speed = random(0.5,2);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      playerX -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      playerX += playerSpeed;
    }
    playerX = constrain(playerX,playerRadius,width-playerRadius);
    if(shootTimer>0){
      shootTimer--;
    }
    if(keyIsDown(32) && shootTimer===0){
      let b = {x:playerX,y:playerY- playerRadius, r:4, vy:8};
      bullets.push(b);
      shootTimer = SHOOT_COOLDOWN;
    }
    if(frameCount % 60 === 0){
      let ex = random(12,width-12);
      let e = {x:ex,y:-12,r:12,vy:2};
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y -= b.vy;
      fill(255,200,0);
      ellipse(b.x,b.y,b.r*2,b.r*2);
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      fill(200,50,50);
      ellipse(e.x,e.y,e.r*2,e.r*2);
      if(e.y > height + e.r){
        enemies.splice(i,1);
        continue;
      }
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let dx = e.x - b.x;
        let dy = e.y - b.y;
        let distSq = dx*dx + dy*dy;
        let minDist = e.r + b.r;
        if(distSq <= minDist*minDist){
          for(let k=0;k<5;k++){
            let angle = random(0,Math.PI*2);
            let speed = random(1,4);
            let p = {
              x:e.x,
              y:e.y,
              vx:cos(angle)*speed,
              vy:sin(angle)*speed,
              r:3,
              life:20
            };
            particles.push(p);
          }
          bullets.splice(j,1);
          enemies.splice(i,1);
          score += 1;
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let dx = e.x - playerX;
      let dy = e.y - playerY;
      let distSq = dx*dx + dy*dy;
      let minDist = e.r + playerRadius;
      if(distSq <= minDist*minDist){
        gameOver = true;
        break;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      let alpha = map(p.life,0,20,0,255);
      fill(255,150,0,alpha);
      ellipse(p.x,p.y,p.r*2,p.r*2);
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  } else {
    for(let i=0;i<bullets.length;i++){
      let b = bullets[i];
      fill(255,200,0);
      ellipse(b.x,b.y,b.r*2,b.r*2);
    }
    for(let i=0;i<enemies.length;i++){
      let e = enemies[i];
      fill(200,50,50);
      ellipse(e.x,e.y,e.r*2,e.r*2);
    }
    for(let i=0;i<particles.length;i++){
      let p = particles[i];
      fill(255,150,0);
      ellipse(p.x,p.y,p.r*2,p.r*2);
    }
    fill(255);
    textSize(48);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
    textSize(18);
    textAlign(LEFT,TOP);
  }
  fill(255);
  textSize(18);
  textAlign(LEFT,TOP);
  text("SCORE: " + score,8,8);
  fill(0,150,255);
  ellipse(playerX,playerY,playerRadius*2,playerRadius*2);
}
