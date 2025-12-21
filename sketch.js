let CANVAS_W = 400;
let CANVAS_H = 600;
let PLAYER_SPEED = 15;
let BULLET_SPEED = 20;
let BULLET_R = 4;
let ENEMY_R = 12;
let ENEMY_SPEED = 20;
let PARTICLE_R = 3;
let PARTICLE_LIFE = 20;
let STAR_COUNT = 30;
let FIRE_COOLDOWN = 8;
let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let lastShotFrame;
function setup(){
  createCanvas(CANVAS_W,CANVAS_H);
  player = {x: width/2, y: height-30, r: 16};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  lastShotFrame = -FIRE_COOLDOWN;
  for(let i=0;i<STAR_COUNT;i++){
    let sx = random(0, width);
    let sy = random(0, height);
    let sr = random(1,3);
    let ss = random(1,3);
    stars.push({x: sx, y: sy, r: sr, s: ss});
  }
  noStroke();
  textAlign(LEFT, TOP);
}
function draw(){
  background(0);
  fill(255);
  for(let i=0;i<stars.length;i++){
    let st = stars[i];
    ellipse(st.x, st.y, st.r*2, st.r*2);
    st.y += st.s;
    if(st.y > height){
      st.y = 0;
      st.x = random(0, width);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= PLAYER_SPEED;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += PLAYER_SPEED;
    }
    if(player.x < player.r){
      player.x = player.r;
    }
    if(player.x > width - player.r){
      player.x = width - player.r;
    }
    if(keyIsDown(32) && frameCount - lastShotFrame >= FIRE_COOLDOWN){
      bullets.push({x: player.x, y: player.y - player.r, r: BULLET_R});
      lastShotFrame = frameCount;
    }
    if(frameCount % 60 === 0){
      let ex = random(ENEMY_R, width - ENEMY_R);
      enemies.push({x: ex, y: -ENEMY_R, r: ENEMY_R});
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += ENEMY_SPEED;
      if(e.y - e.r > height){
        enemies.splice(i,1);
        continue;
      }
      let dPlayer = dist(e.x, e.y, player.x, player.y);
      if(dPlayer <= e.r + player.r){
        gameOver = true;
        break;
      }
      let hit = false;
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let d = dist(e.x, e.y, b.x, b.y);
        if(d <= e.r + b.r){
          for(let k=0;k<5;k++){
            let pvx = random(-2,2);
            let pvy = random(-2,2);
            particles.push({x: e.x, y: e.y, r: PARTICLE_R, life: PARTICLE_LIFE, vx: pvx, vy: pvy});
          }
          bullets.splice(j,1);
          enemies.splice(i,1);
          score += 1;
          hit = true;
          break;
        }
      }
      if(hit){
        continue;
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y -= BULLET_SPEED;
      if(b.y + b.r < 0){
        bullets.splice(i,1);
        continue;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
        continue;
      }
    }
  } else {
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
        continue;
      }
    }
  }
  fill(0,0,255);
  ellipse(player.x, player.y, player.r*2, player.r*2);
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
  fill(255,165,0,200);
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 10);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(36);
    text("GAME OVER", width/2, height/2);
    textAlign(LEFT, TOP);
  }
}
