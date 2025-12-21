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
let prevSpace;
function setup(){
  createCanvas(400,600);
  playerX = width/2;
  playerY = height - 40;
  playerSpeed = 15;
  playerRadius = 14;
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  prevSpace = false;
  for(let i=0;i<30;i++){
    let s = {
      x: random(0,width),
      y: random(0,height),
      r: random(1,3),
      vy: random(1,3)
    };
    stars.push(s);
  }
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(255);
    noStroke();
    ellipse(s.x, s.y, s.r*2, s.r*2);
    s.y += s.vy;
    if(s.y - s.r > height){
      s.x = random(0,width);
      s.y = -s.r;
      s.vy = random(1,3);
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
    if(playerX - playerRadius < 0){
      playerX = playerRadius;
    }
    if(playerX + playerRadius > width){
      playerX = width - playerRadius;
    }
    let spaceDown = keyIsDown(32);
    if(spaceDown && !prevSpace){
      let b = {
        x: playerX,
        y: playerY - playerRadius - 1,
        r: 100,
        vy: -20
      };
      bullets.push(b);
    }
    prevSpace = spaceDown;
    if(frameCount % 60 === 0){
      let e = {
        x: random(12, width-12),
        y: -12,
        r: 12,
        vy: 20
      };
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y + b.r < 0){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y - e.r > height){
        enemies.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d <= e.r + b.r){
          for(let k=0;k<5;k++){
            let ang = random(0, TWO_PI);
            let sp = random(1,4);
            let p = {
              x: e.x,
              y: e.y,
              vx: cos(ang)*sp,
              vy: sin(ang)*sp,
              r: 3,
              life: 20
            };
            particles.push(p);
          }
          score += 1;
          enemies.splice(i,1);
          bullets.splice(j,1);
          break;
        }
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let d = dist(e.x,e.y,playerX,playerY);
      if(d <= e.r + playerRadius){
        gameOver = true;
        break;
      }
    }
  } else {
    prevSpace = keyIsDown(32);
  }
  fill(0,0,255);
  noStroke();
  ellipse(playerX, playerY, playerRadius*2, playerRadius*2);
  fill(0,255,255,150);
  noStroke();
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,0,0);
  noStroke();
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    fill(255,200,0, map(p.life,0,20,0,255));
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(255);
  textSize(24);
  textAlign(LEFT,TOP);
  text("Score: "+score,10,10);
  if(gameOver){
    textSize(48);
    textAlign(CENTER,CENTER);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2);
  }
}
