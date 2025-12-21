let canvasWidth = 600;
let canvasHeight = 800;
let player = {
  x: canvasWidth / 2,
  y: canvasHeight - 60,
  w: 48,
  h: 32,
  speed: 6,
  cooldown: 0,
  maxCooldown: 12,
  lives: 3
};
let bullets = [];
let enemies = [];
let enemyBullets = [];
let score = 0;
let gameState = "play";
let enemySpawnTimer = 0;
let enemySpawnInterval = 60;
let difficultyTimer = 0;
let maxEnemies = 6;
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  rectMode(CENTER);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
}
function draw() {
  background(12);
  if (gameState === "play") {
    handleInput();
    updatePlayer();
    spawnEnemies();
    updateBullets();
    updateEnemies();
    updateEnemyBullets();
    detectCollisions();
    difficultyTimer++;
    if (difficultyTimer % 600 === 0 && difficultyTimer > 0) {
      if (enemySpawnInterval > 20) {
        enemySpawnInterval = enemySpawnInterval - 6;
      }
      if (maxEnemies < 14) {
        maxEnemies = maxEnemies + 1;
      }
    }
  }
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawEnemyBullets();
  drawHUD();
  if (gameState === "gameover") {
    fill(255, 220, 0);
    textAlign(CENTER, CENTER);
    textSize(36);
    text("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 30);
    textSize(18);
    text("Click to restart", canvasWidth / 2, canvasHeight / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(18);
  }
  if (player.lives <= 0 && gameState !== "gameover") {
    gameState = "gameover";
  }
  if (player.cooldown > 0) {
    player.cooldown = player.cooldown - 1;
    if (player.cooldown < 0) {
      player.cooldown = 0;
    }
  }
}
function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.x = player.x - player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.x = player.x + player.speed;
  }
  player.x = constrain(player.x, player.w / 2, canvasWidth - player.w / 2);
  if ((keyIsDown(32) || keyIsDown(87) || keyIsDown(UP_ARROW)) && player.cooldown === 0) {
    shootPlayer();
    player.cooldown = player.maxCooldown;
  }
}
function shootPlayer() {
  let b = {
    x: player.x,
    y: player.y - player.h / 2 - 6,
    r: 6,
    speed: 10
  };
  bullets.push(b);
}
function updatePlayer() {
}
function spawnEnemies() {
  enemySpawnTimer++;
  if (enemySpawnTimer >= enemySpawnInterval) {
    enemySpawnTimer = 0;
    if (enemies.length < maxEnemies) {
      let ex = Math.floor(random(30, canvasWidth - 30));
      let etype = Math.floor(random(0, 3));
      let e = {
        x: ex,
        y: -30,
        w: 40,
        h: 28,
        speed: 1 + random(0, 1.6),
        type: etype,
        hp: etype === 2 ? 3 : 1,
        oscillation: random(0, TWO_PI),
        shotCooldown: Math.floor(random(60, 180))
      };
      enemies.push(e);
    }
  }
}
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y = b.y - b.speed;
    if (b.y < -10) {
      bullets.splice(i, 1);
    }
  }
}
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y = e.y + e.speed;
    if (e.type === 1) {
      e.x = e.x + sin(e.oscillation) * 1.8;
      e.oscillation = e.oscillation + 0.08;
    } else if (e.type === 2) {
      e.x = e.x + sin(e.oscillation) * 2.6;
      e.oscillation = e.oscillation + 0.06;
    }
    e.shotCooldown = e.shotCooldown - 1;
    if (e.shotCooldown <= 0) {
      e.shotCooldown = Math.floor(random(80, 200));
      let eb = {
        x: e.x,
        y: e.y + e.h / 2 + 6,
        r: 6,
        speed: 4 + random(0, 2)
      };
      enemyBullets.push(eb);
    }
    if (e.y > canvasHeight + 40) {
      enemies.splice(i, 1);
      player.lives = player.lives - 1;
      if (player.lives < 0) {
        player.lives = 0;
      }
    } else {
      if (e.x < e.w / 2) {
        e.x = e.w / 2;
      }
      if (e.x > canvasWidth - e.w / 2) {
        e.x = canvasWidth - e.w / 2;
      }
    }
  }
}
function updateEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let eb = enemyBullets[i];
    eb.y = eb.y + eb.speed;
    if (eb.y > canvasHeight + 20) {
      enemyBullets.splice(i, 1);
    }
  }
}
function detectCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      let e = enemies[j];
      if (circleRectCollision(b.x, b.y, b.r, e.x, e.y, e.w, e.h)) {
        bullets.splice(i, 1);
        e.hp = e.hp - 1;
        if (e.hp <= 0) {
          score = score + 100;
          enemies.splice(j, 1);
        }
        break;
      }
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let eb = enemyBullets[i];
    if (circleRectCollision(eb.x, eb.y, eb.r, player.x, player.y, player.w, player.h)) {
      enemyBullets.splice(i, 1);
      player.lives = player.lives - 1;
      if (player.lives < 0) {
        player.lives = 0;
      }
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (rectRectCollision(e.x, e.y, e.w, e.h, player.x, player.y, player.w, player.h)) {
      enemies.splice(i, 1);
      player.lives = player.lives - 1;
      if (player.lives < 0) {
        player.lives = 0;
      }
    }
  }
}
function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  let rxLeft = rx - rw / 2;
  let rxTop = ry - rh / 2;
  let closestX = cx;
  let closestY = cy;
  if (cx < rxLeft) {
    closestX = rxLeft;
  } else if (cx > rxLeft + rw) {
    closestX = rxLeft + rw;
  }
  if (cy < rxTop) {
    closestY = rxTop;
  } else if (cy > rxTop + rh) {
    closestY = rxTop + rh;
  }
  let dx = cx - closestX;
  let dy = cy - closestY;
  let distSq = dx * dx + dy * dy;
  return distSq <= cr * cr;
}
function rectRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  let left1 = x1 - w1 / 2;
  let right1 = x1 + w1 / 2;
  let top1 = y1 - h1 / 2;
  let bottom1 = y1 + h1 / 2;
  let left2 = x2 - w2 / 2;
  let right2 = x2 + w2 / 2;
  let top2 = y2 - h2 / 2;
  let bottom2 = y2 + h2 / 2;
  return !(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2);
}
function drawPlayer() {
  fill(80, 180, 255);
  rect(player.x, player.y, player.w, player.h, 6);
  fill(200);
  rect(player.x, player.y - 8, player.w * 0.5, 8, 4);
}
function drawBullets() {
  fill(255, 255, 100);
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
}
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    if (e.type === 0) {
      fill(255, 100, 100);
    } else if (e.type === 1) {
      fill(255, 160, 60);
    } else {
      fill(200, 100, 255);
    }
    rect(e.x, e.y, e.w, e.h, 4);
    if (e.hp > 1) {
      fill(0);
      let hpText = 
