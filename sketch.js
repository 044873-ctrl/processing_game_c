let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let player = null;
let playerSpeed = 5;
let bulletRadius = 4;
let bulletSpeed = 8;
let enemyRadius = 12;
let enemySpeed = 2;
let particleRadius = 3;
let particleLife = 20;
let spawnInterval = 60;
function spawnBullet() {
  if (player === null) {
    return;
  }
  let bx = player.x;
  let by = player.y - player.r;
  let b = {x: bx, y: by, r: bulletRadius, vy: -bulletSpeed};
  bullets.push(b);
}
function spawnEnemy() {
  let ex = random(enemyRadius, width - enemyRadius);
  let ey = -enemyRadius;
  let e = {x: ex, y: ey, r: enemyRadius, vy: enemySpeed};
  enemies.push(e);
}
function spawnParticles(px, py) {
  for (let i = 0; i < 5; i++) {
    let angle = random(0, TWO_PI);
    let speed = random(1, 3);
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed;
    let p = {x: px, y: py, r: particleRadius, vx: vx, vy: vy, life: particleLife};
    particles.push(p);
  }
}
function setup() {
  createCanvas(400, 600);
  player = {x: width / 2, y: height - 40, r: 16};
  for (let i = 0; i < 30; i++) {
    let s = {x: random(0, width), y: random(0, height), size: random(1, 3), sp: random(0.5, 2)};
    stars.push(s);
  }
  textSize(18);
  textAlign(LEFT, TOP);
  noStroke();
  frameRate(60);
}
function draw() {
  background(0);
  fill(255);
  for (let i = 0; i < stars.length; i++) {
    let st = stars[i];
    st.y += st.sp;
    if (st.y > height) {
      st.y = 0;
      st.x = random(0, width);
    }
    ellipse(st.x, st.y, st.size, st.size);
  }
  if (!gameOver && keyIsDown(LEFT_ARROW)) {
    player.x -= playerSpeed;
  }
  if (!gameOver && keyIsDown(RIGHT_ARROW)) {
    player.x += playerSpeed;
  }
  if (player !== null) {
    if (player.x < player.r) {
      player.x = player.r;
    }
    if (player.x > width - player.r) {
      player.x = width - player.r;
    }
  }
  fill(0, 150, 255);
  if (player !== null) {
    ellipse(player.x, player.y, player.r * 2, player.r * 2);
  }
  if (!gameOver && frameCount % spawnInterval === 0) {
    spawnEnemy();
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y < -b.r) {
      bullets.splice(i, 1);
      continue;
    }
    fill(255, 255, 0);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.vy;
    if (e.y > height + e.r) {
      enemies.splice(i, 1);
      continue;
    }
    fill(255, 0, 0);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
  }
  for (let ei = enemies.length - 1; ei >= 0; ei--) {
    let e = enemies[ei];
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      let b = bullets[bi];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let d2 = dx * dx + dy * dy;
      let rsum = e.r + b.r;
      if (d2 <= rsum * rsum) {
        spawnParticles(e.x, e.y);
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 1;
        break;
      }
    }
  }
  if (player !== null) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let dx = e.x - player.x;
      let dy = e.y - player.y;
      let d2 = dx * dx + dy * dy;
      let rsum = e.r + player.r;
      if (d2 <= rsum * rsum) {
        gameOver = true;
        noLoop();
        break;
      }
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    let alpha = map(p.life, 0, particleLife, 0, 255);
    fill(255, 200, 0, alpha);
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
  }
  fill(255);
  text("SCORE: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 50, 50);
    text("GAME OVER", width / 2, height / 2);
    textSize(18);
    textAlign(LEFT, TOP);
  }
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    spawnBullet();
  }
}
