let CANVAS_W = 400;
let CANVAS_H = 600;
let paddle = {};
let ball = {};
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let rowColors = [];
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  rectMode(CENTER);
  ellipseMode(CENTER);
  paddle.w = 90;
  paddle.h = 12;
  paddle.x = width / 2;
  paddle.y = height - 40;
  ball.r = 6;
  ball.x = width / 2;
  ball.y = paddle.y - paddle.h / 2 - ball.r - 2;
  ball.vx = 4;
  ball.vy = -5;
  ball.active = true;
  rowColors = ['#ff6b6b', '#ffb86b', '#ffe66b', '#6bff8f', '#6bcfff', '#b36bff'];
  createBlocks();
  score = 0;
  gameOver = false;
}
function createBlocks() {
  blocks = [];
  let marginX = 30;
  let spacing = 6;
  let blockW = (width - marginX * 2 - (cols - 1) * spacing) / cols;
  let blockH = 20;
  let startY = 60;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = marginX + c * (blockW + spacing);
      let by = startY + r * (blockH + spacing);
      let block = {
        x: bx,
        y: by,
        w: blockW,
        h: blockH,
        row: r,
        col: c,
        alive: true,
        color: rowColors[r % rowColors.length]
      };
      blocks.push(block);
    }
  }
}
function draw() {
  background(30);
  updatePaddle();
  if (!gameOver) {
    updateBall();
    checkBlockCollisions();
  }
  updateParticles();
  drawBlocks();
  drawPaddle();
  drawBall();
  drawUI();
  if (gameOver) {
    drawGameOver();
  }
}
function updatePaddle() {
  let targetX = mouseX;
  paddle.x = constrain(targetX, paddle.w / 2, width - paddle.w / 2);
}
function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.x + ball.r > width) {
    ball.x = width - ball.r;
    ball.vx = -ball.vx;
  }
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y - ball.r > height) {
    gameOver = true;
    ball.vx = 0;
    ball.vy = 0;
    ball.active = false;
  }
  if (ball.vy > 0) {
    let paddleTop = paddle.y - paddle.h / 2;
    let paddleLeft = paddle.x - paddle.w / 2;
    let paddleRight = paddle.x + paddle.w / 2;
    if (ball.y + ball.r >= paddleTop && ball.y - ball.r <= paddle.y + paddle.h / 2 && ball.x >= paddleLeft && ball.x <= paddleRight) {
      let relativeX = (ball.x - paddle.x) / (paddle.w / 2);
      relativeX = constrain(relativeX, -1, 1);
      let maxAngle = PI / 3;
      let angle = relativeX * maxAngle;
      let speed = sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = speed * sin(angle);
      ball.vy = -abs(speed * cos(angle));
      ball.y = paddleTop - ball.r - 0.1;
    }
  }
}
function checkBlockCollisions() {
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    if (!b.alive) {
      blocks.splice(i, 1);
      continue;
    }
    if (circleRectCollision(ball.x, ball.y, ball.r, b.x, b.y, b.w, b.h)) {
      b.alive = false;
      blocks.splice(i, 1);
      score += 10;
      for (let pcount = 0; pcount < 3; pcount++) {
        let angle = random(0, TWO_PI);
        let speed = random(1, 3);
        let pvx = cos(angle) * speed;
        let pvy = sin(angle) * speed;
        let px = b.x + b.w / 2;
        let py = b.y + b.h / 2;
        let particle = { x: px, y: py, vx: pvx, vy: pvy, life: 15, color: b.color };
        particles.push(particle);
      }
      let overlapX = (ball.x > b.x + b.w / 2) ? (ball.x - (b.x + b.w / 2)) : ((b.x - b.w / 2) - ball.x);
      let overlapY = (ball.y > b.y + b.h / 2) ? (ball.y - (b.y + b.h / 2)) : ((b.y - b.h / 2) - ball.y);
      if (abs(overlapX) > abs(overlapY)) {
        ball.vx = -ball.vx;
      } else {
        ball.vy = -ball.vy;
      }
      break;
    }
  }
}
function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  let rectCenterX = rx + rw / 2;
  let rectCenterY = ry + rh / 2;
  let dx = abs(cx - rectCenterX);
  let dy = abs(cy - rectCenterY);
  if (dx > (rw / 2 + cr)) {
    return false;
  }
  if (dy > (rh / 2 + cr)) {
    return false;
  }
  if (dx <= (rw / 2)) {
    return true;
  }
  if (dy <= (rh / 2)) {
    return true;
  }
  let cornerDistSq = (dx - rw / 2) * (dx - rw / 2) + (dy - rh / 2) * (dy - rh / 2);
  return cornerDistSq <= (cr * cr);
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
function drawBlocks() {
  noStroke();
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    fill(b.color);
    rect(b.x + b.w / 2, b.y + b.h / 2, b.w, b.h);
  }
}
function drawPaddle() {
  fill(200);
  rect(paddle.x, paddle.y, paddle.w, paddle.h);
}
function drawBall() {
  fill(255);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
}
function drawUI() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let alpha = map(p.life, 0, 15, 0, 255);
    fill(colorAlpha(p.color, alpha));
    ellipse(p.x, p.y, 6, 6);
  }
}
function drawGameOver() {
  fill(0, 180);
  rect(width / 2, height / 2, width, height);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Game Over', width / 2, height / 2 - 20);
  textSize(20);
  text('Score: ' + score, width / 2, height / 2 + 20);
}
function colorAlpha(hex, a) {
  let c = color(hex);
  return color(red(c), green(c), blue(c), a);
}
