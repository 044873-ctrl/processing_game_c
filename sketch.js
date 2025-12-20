let canvasW = 600;
let canvasH = 400;
let paddleW = 10;
let paddleH = 80;
let playerX;
let cpuX;
let playerY;
let cpuY;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let cpuMiss = false;
let cpuMissTimer = 0;
let cpuTargetCenter = 0;
let ball = { x: 0, y: 0, vx: 4, vy: 3, r: 8 };
let playerScore = 0;
let cpuScore = 0;
function setup() {
  createCanvas(canvasW, canvasH);
  playerX = 20;
  cpuX = width - 20 - paddleW;
  playerY = (height - paddleH) / 2;
  cpuY = (height - paddleH) / 2;
  cpuTargetCenter = cpuY + paddleH / 2;
  resetBall(0);
  frameRate(60);
  textSize(24);
  textAlign(CENTER, TOP);
}
function resetBall(scoredBy) {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = 4;
  ball.vy = 3;
  if (scoredBy === 1) {
    ball.vx = 4;
  } else if (scoredBy === -1) {
    ball.vx = -4;
  } else {
    ball.vx = random() < 0.5 ? 4 : -4;
  }
  if (random() < 0.5) {
    ball.vy = 3;
  } else {
    ball.vy = -3;
  }
}
function draw() {
  background(0);
  fill(255);
  rect(playerX, playerY, paddleW, paddleH);
  rect(cpuX, cpuY, paddleW, paddleH);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
  fill(255);
  text(playerScore, width * 0.25, 10);
  text(cpuScore, width * 0.75, 10);
  handlePlayerInput();
  updateCPU();
  updateBall();
}
function handlePlayerInput() {
  if (keyIsDown(UP_ARROW)) {
    playerY -= playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    playerY += playerSpeed;
  }
  playerY = constrain(playerY, 0, height - paddleH);
}
function updateCPU() {
  if (cpuMiss) {
    cpuMissTimer -= 1;
    if (cpuMissTimer <= 0) {
      cpuMiss = false;
      cpuMissTimer = 0;
    }
  } else {
    if (ball.vx > 0 && ball.x > width / 2) {
      if (random() < 0.01) {
        cpuMiss = true;
        cpuMissTimer = 30;
        cpuTargetCenter = random(paddleH / 2, height - paddleH / 2);
      }
    }
  }
  let targetCenter = 0;
  if (cpuMiss) {
    targetCenter = cpuTargetCenter;
  } else {
    targetCenter = ball.y;
  }
  let cpuCenter = cpuY + paddleH / 2;
  let dy = targetCenter - cpuCenter;
  let move = 0;
  if (abs(dy) > 0) {
    move = constrain(dy, -cpuMaxSpeed, cpuMaxSpeed);
  }
  cpuY += move;
  cpuY = constrain(cpuY, 0, height - paddleH);
}
function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.y + ball.r >= height) {
    ball.y = height - ball.r;
    ball.vy = -ball.vy;
  }
  if (ball.x - ball.r <= playerX + paddleW && ball.x - ball.r >= playerX) {
    if (ball.y >= playerY && ball.y <= playerY + paddleH) {
      ball.x = playerX + paddleW + ball.r;
      ball.vx = -ball.vx;
      let paddleCenter = playerY + paddleH / 2;
      let delta = ball.y - paddleCenter;
      let norm = delta / (paddleH / 2);
      ball.vy = ball.vy + norm * 4;
      ball.vy = constrain(ball.vy, -8, 8);
    }
  }
  if (ball.x + ball.r >= cpuX && ball.x + ball.r <= cpuX + paddleW) {
    if (ball.y >= cpuY && ball.y <= cpuY + paddleH) {
      ball.x = cpuX - ball.r;
      ball.vx = -ball.vx;
      let paddleCenter = cpuY + paddleH / 2;
      let delta = ball.y - paddleCenter;
      let norm = delta / (paddleH / 2);
      ball.vy = ball.vy + norm * 4;
      ball.vy = constrain(ball.vy, -8, 8);
    }
  }
  if (ball.x + ball.r < 0) {
    cpuScore += 1;
    resetBall(-1);
  } else if (ball.x - ball.r > width) {
    playerScore += 1;
    resetBall(1);
  }
}
