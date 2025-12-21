let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let shootPressed;
let shootCooldown;
let shootInterval;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, speed: 5, radius: 16};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  shootPressed = false;
  shootCooldown = 0;
  shootInterval = 8;
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), speed: random(0.5,2.0), r: random(1,3)};
    stars.push(s);
  }
  textFont('Helvetica');
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    stroke(255);
    strokeWeight(s.r);
    point(s.x, s.y);
    s.y += s.speed;
    if(s.y > height){
      s.y = -random(0,height);
      s.x = random(0,width);
      s.speed = random(0.5,2.0);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      player.x += player.speed;
    }
    if(player.x < player.radius){ player.x = player.radius; }
    if(player.x > width - player.radius){ player.x = width - player.radius; }
    if(frameCount % 60 === 0){
      let ex = random(12, width-12);
      let enemy = {x: ex, y: -12, vy: 2, r: 12, alive: true};
      enemies.push(enemy);
    }
    if(shootCooldown > 0){ shootCooldown--; }
    if(shootPressed && shootCooldown <= 0){
      let b = {x: player.x, y: player.y- player.radius - 4, vy: -8, r: 4, alive: true};
      bullets.push(b);
      shootCooldown = shootInterval;
    }
    for(let i=0;i<bullets.length;i++){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y < -b.r){
        b.alive = false;
      }
    }
    for(let i=0;i<enemies.length;i++){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y > height + e.r){
        e.alive = false;
      }
    }
    for(let i=0;i<enemies.length;i++){
      let e = enemies[i];
      if(!e.alive) continue;
      let dxp = e.x - player.x;
      let dyp = e.y - player.y;
      let distSqP = dxp*dxp + dyp*dyp;
      let radSumP = e.r + player.radius;
      if(distSqP <= radSumP*radSumP){
        gameOver = true;
      }
    }
    for(let i=0;i<bullets.length;i++){
      let b = bullets[i];
      if(!b.alive) continue;
      for(let j=0;j<enemies.length;j++){
        let e = enemies[j];
        if(!e.alive) continue;
        let dx = b.x - e.x;
        let dy = b.y - e.y;
        let distSq = dx*dx + dy*dy;
        let rr = b.r + e.r;
        if(distSq <= rr*rr){
          b.alive = false;
          e.alive = false;
          score += 1;
          for(let k=0;k<5;k++){
            let angle = random(0, Math.PI*2);
            let speed = random(1,3);
            let p = {x: e.x, y: e.y, vx: cos(angle)*speed, vy: sin(angle)*speed, r: 3, life: 20};
            particles.push(p);
          }
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
    for(let i=bullets.length-1;i>=0;i--){
      if(!bullets[i].alive){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      if(!enemies[i].alive){
        enemies.splice(i,1);
      }
    }
  } else {
    for(let i=0;i<particles.length;i++){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
    }
    for(let i=particles.length-1;i>=0;i--){
      if(particles[i].life <= 0){
        particles.splice(i,1);
      }
    }
  }
  noStroke();
  fill(0, 150, 255);
  ellipse(player.x, player.y, player.radius*2, player.radius*2);
  fill(255,255,0);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,0,0);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life,0,20,0,255);
    fill(255, 160, 0, alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("SCORE: " + score, 8, 8);
  if(gameOver){
    fill(255,50,50);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function keyPressed(){
  if(keyCode === 32){
    shootPressed = true;
    return false;
  }
}
function keyReleased(){
  if(keyCode === 32){
    shootPressed = false;
    return false;
  }
}
