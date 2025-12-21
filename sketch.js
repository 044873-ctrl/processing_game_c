let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let enemySpawnInterval = 60;
let enemySpeed = 200 / 60;
function setup() {
  createCanvas(400, 600);
  player = {
    x: width / 2,
    y: height - 40,
    r: 14,
    speed: 15
  };
  for (let i = 0; i < 30; i++) {
    let s = {
      x: random(0, width),
      y: random(0, height),
      size: random(1, 3),
      speed: random(0.5, 2)
    };
    stars.push(s);
  }
  textSize(20);
  textAlign(LEFT, TOP);
}
function draw() {
  background(0);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    fill(255);
    noStroke();
    ellipse(s.x, s.y, s.size, s.size);
    s.y += s.speed;
    if (s.y > height + s.size) {
      s.y = -s.size;
      s.x = random(0, width);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if (frameCount % enemySpawnInterval === 0) {
      let e = {
        x: random(12, width - 12),
        y: -12,
        r: 12,
        vy: enemySpeed
      };
      enemies.push(e);
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.y += b.vy;
      fill(255, 255, 0);
      noStroke();
      ellipse(b.x, b.y, b.r * 2, b.r * 2);
      if (b.y < -b.r) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.y += e.vy;
      fill(200, 40, 40);
      noStroke();
      ellipse(e.x, e.y, e.r * 2, e.r * 2);
      if (e.y > height + e.r) {
        enemies.splice(i, 1);
        continue;
      }
      for (let j = bullets.length - 1; j >= 0; j--) {
        let b = bullets[j];
        let d = dist(e.x, e.y, b.x, b.y);
        if (d < e.r + b.r) {
          score += 1;
          for (let k = 0; k < 5; k++) {
            let angle = random(0, TWO_PI);
            let speed = random(1, 4);
            let p = {
              x: e.x,
              y: e.y,
              r: 3,
              vx: cos(angle) * speed,
              vy: sin(angle) * speed,
              life: 20
            };
            particles.push(p);
          }
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          break;
        }
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let d = dist(e.x, e.y, player.x, player.y);
      if (d < e.r + player.r) {
        gameOver = true;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      fill(255, 150, 0, map(p.life, 0, 20, 0, 255));
      noStroke();
      ellipse(p.x, p.y, p.r * 2, p.r * 2);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  } else {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      fill(255, 150, 0, map(p.life, 0, 20, 0, 255));
      noStroke();
      ellipse(p.x, p.y, p.r * 2, p.r * 2);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
  fill(100, 180, 255);
  noStroke();
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
  fill(255);
  noStroke();
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 50, 50);
    text("GAME OVER", width / 2, height / 2);
    textSize(20);
    textAlign(LEFT, TOP);
  }
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    let b = {
      x: player.x,
      y: player.y - player.r - 4,
      r: 4,
      vy: -20
    };
    bullets.push(b);
  }
}
