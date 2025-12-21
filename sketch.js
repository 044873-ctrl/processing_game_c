let canvasW = 400;
let canvasH = 600;
let paddleW = 90;
let paddleH = 12;
let paddleX = 200;
let paddleY = 0;
let ball = {};
let blocks = [];
let particles = [];
let rows = 6;
let cols = 7;
let score = 0;
let gameOver = false;
let blockColors = [];
function setupBlocks() {
  blocks = [];
  let pad = 6;
  let bw = (width - (cols + 1) * pad) / cols;
  let bh = 20;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let bx = pad + c * (bw + pad);
      let by = 40 + r * (bh + pad);
      let col = blockColors[r % blockColors.length];
      blocks.push({ x: bx, y: by, w: bw, h: bh, col: col });
    }
  }
}
function resetBall() {
  ball = { x: width / 2, y: paddleY - paddleH / 2 - 6 - 1, r: 6, vx: 4, vy: -5 };
}
function clamp(v, a, b) {
  if (v < a) return a;
  if (v > b) return b;
  return v;
}
function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  let nearestX = clamp(cx, rx, rx + rw);
  let nearestY = clamp(cy, ry, ry + rh);
  let dx = cx - nearestX;
  let dy = cy - nearestY;
  return { collided: dx * dx + dy * dy <= r * r, dx: dx, dy: dy };
}
function setup() {
  createCanvas(canvasW, canvasH);
  paddleY = height - 40;
  paddleX = width / 2;
  blockColors = [
    color(255, 100, 100),
    color(255, 160, 100),
    color(255, 220, 100),
    color(180, 255, 150),
    color(150, 220, 255),
    color(200, 150, 255)
  ];
  setupBlocks();
  resetBall();
  particles = [];
  score = 0;
  gameOver = false;
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw() {
  background(30);
  paddleX = constrain(mouseX, paddleW / 2, width - paddleW / 2);
  fill(255);
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    fill(b.col);
    rect(b.x, b.y, b.w, b.h);
  }
  fill(200);
  rect(paddleX - paddleW / 2, paddleY - paddleH / 2, paddleW, paddleH, 4);
  if (!gameOver) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - ball.r <= 0) {
      ball.x = ball.r;
      ball.vx = Math.abs(ball.vx);
    }
    if (ball.x + ball.r >= width) {
      ball.x = width - ball.r;
      ball.vx = -Math.abs(ball.vx);
    }
    if (ball.y - ball.r <= 0) {
      ball.y = ball.r;
      ball.vy = Math.abs(ball.vy);
    }
    let paddleRectX = paddleX - paddleW / 2;
    let paddleRectY = paddleY - paddleH / 2;
    let pc = circleRectCollision(ball.x, ball.y, ball.r, paddleRectX, paddleRectY, paddleW, paddleH);
    if (pc.collided && ball.vy > 0) {
      let relative = (ball.x - paddleX) / (paddleW / 2);
      if (relative < -1) relative = -1;
      if (relative > 1) relative = 1;
      let maxAngle = PI / 3;
      let angle = relative * maxAngle;
      let speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      ball.vx = speed * Math.sin(angle);
      ball.vy = -Math.abs(speed * Math.cos(angle));
      ball.y = paddleRectY - ball.r - 0.1;
    }
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i];
      let col = circleRectCollision(ball.x, ball.y, ball.r, b.x, b.y, b.w, b.h);
      if (col.collided) {
        if (Math.abs(col.dx) > Math.abs(col.dy)) {
          ball.vx = -ball.vx;
        } else {
          ball.vy = -ball.vy;
        }
        for (let j = 0; j < 3; j++) {
          let pvx = random(-2, 2);
          let pvy = random(-2, 2);
          particles.push({ x: ball.x, y: ball.y, vx: pvx, vy: pvy, life: 15 });
        }
        score += 1;
        blocks.splice(i, 1);
        break;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    if (ball.y - ball.r > height) {
      gameOver = true;
    }
  }
  fill(255);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let a = map(p.life, 0, 15, 0, 255);
    noStroke();
    fill(255, 200, 50, a);
    ellipse(p.x, p.y, 6, 6);
  }
  fill(255);
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 50, 50);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(18);
    fill(255);
    text("Click to restart", width / 2, height / 2 + 20);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function mousePressed() {
  if (gameOver) {
    setup();
  }
}
