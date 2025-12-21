let canvasWidth = 600;
let canvasHeight = 400;
let paddleWidth = 10;
let paddleHeight = 80;
let playerX;
let cpuX;
let playerY;
let cpuY;
let playerSpeed = 6;
let cpuMaxSpeed = 5;
let ball;
let ballRadius = 8;
let leftScore = 0;
let rightScore = 0;
let cpuMiss = false;
let cpuMissTimer = 0;
let cpuMissDuration = 30;
let cpuMissTargetY = 0;
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerX = 20;
  cpuX = canvasWidth - 20 - paddleWidth;
  playerY = (canvasHeight - paddleHeight) / 2;
  cpuY = (canvasHeight - paddleHeight) / 2;
  ball = { x: canvasWidth / 2, y: canvasHeight / 2, vx: 4, vy: 3, r: ballRadius };
  textSize(32);
  textAlign(CENTER, TOP);
}
function resetBall() {
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight / 2;
  ball.vx = 4 * (random() < 0.5 ? 1 : -1);
  ball.vy = 3 * (random() < 0.5 ? 1 : -1);
}
function draw() {
  background(0);
  handlePlayerInput();
  updateCPU();
  updateBall();
  drawCenterLineAndScores();
  drawPaddlesAndBall();
}
function handlePlayerInput() {
  let dy = 0;
  if (keyIsDown(UP_ARROW)) {
    dy = -playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    dy = playerSpeed;
  }
  playerY += dy;
  if (playerY < 0) {
    playerY = 0;
  }
  if (playerY > canvasHeight - paddleHeight) {
    playerY = canvasHeight - paddleHeight;
  }
}
function updateCPU() {
  if (!cpuMiss) {
    if (ball.vx > 0 && ball.x > canvasWidth / 2 && random() < 0.01) {
      cpuMiss = true;
      cpuMissTimer = cpuMissDuration;
      cpuMissTargetY = random(paddleHeight / 2, canvasHeight - paddleHeight / 2);
    }
  }
  if (cpuMiss) {
    cpuMissTimer--;
    if (cpuMissTimer <= 0) {
      cpuMiss = false;
      cpuMissTimer = 0;
    }
  }
  let targetCenterY = 0;
  if (cpuMiss) {
    targetCenterY = cpuMissTargetY;
  } else {
    targetCenterY = ball.y;
  }
  let cpuCenterY = cpuY + paddleHeight / 2;
  let diff = targetCenterY - cpuCenterY;
  if (abs(diff) > 0) {
    let move = constrain(diff, -cpuMaxSpeed, cpuMaxSpeed);
    cpuY += move;
  }
  if (cpuY < 0) {
    cpuY = 0;
  }
  if (cpuY > canvasHeight - paddleHeight) {
    cpuY = canvasHeight - paddleHeight;
  }
}
function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy = abs(ball.vy);
  }
  if (ball.y + ball.r >= canvasHeight) {
    ball.y = canvasHeight - ball.r;
    ball.vy = -abs(ball.vy);
  }
  let leftPaddleLeft = playerX;
  let leftPaddleRight = playerX + paddleWidth;
  let leftPaddleTop = playerY;
  let leftPaddleBottom = playerY + paddleHeight;
  if (ball.vx < 0) {
    if (ball.x - ball.r <= leftPaddleRight && ball.x - ball.r >= leftPaddleLeft && ball.y >= leftPaddleTop && ball.y <= leftPaddleBottom) {
      ball.x = leftPaddleRight + ball.r;
      ball.vx = -ball.vx;
      let intersectY = ball.y - (playerY + paddleHeight / 2);
      let normalized = intersectY / (paddleHeight / 2);
      if (!isFinite(normalized)) {
        normalized = 0;
      }
      let maxBounce = 5;
      ball.vy = normalized * maxBounce;
      if (abs(ball.vy) < 0.1) {
        ball.vy = 0.1 * (ball.vy >= 0 ? 1 : -1);
      }
    }
  }
  let rightPaddleLeft = cpuX;
  let rightPaddleRight = cpuX + paddleWidth;
  let rightPaddleTop = cpuY;
  let rightPaddleBottom = cpuY + paddleHeight;
  if (ball.vx > 0) {
    if (ball.x + ball.r >= rightPaddleLeft && ball.x + ball.r <= rightPaddleRight && ball.y >= rightPaddleTop && ball.y <= rightPaddleBottom) {
      ball.x = rightPaddleLeft - ball.r;
      ball.vx = -ball.vx;
      let intersectY = ball.y - (cpuY + paddleHeight / 2);
      let normalized = intersectY / (paddleHeight / 2);
      if (!isFinite(normalized)) {
        normalized = 0;
      }
      let maxBounce = 5;
      ball.vy = normalized * maxBounce;
      if (abs(ball.vy) < 0.1) {
        ball.vy = 0.1 * (ball.vy >= 0 ? 1 : -1);
      }
    }
  }
  if (ball.x - ball.r <= 0) {
    rightScore += 1;
    resetBall();
  }
  if (ball.x + ball.r >= canvasWidth) {
    leftScore += 1;
    resetBall();
  }
}
function drawCenterLineAndScores() {
  stroke(255);
  for (let i = 0; i < canvasHeight; i += 20) {
    line(canvasWidth / 2, i, canvasWidth / 2, i + 10);
  }
  noStroke();
  fill(255);
  text(leftScore, canvasWidth / 4, 10);
  text(rightScore, (canvasWidth * 3) / 4, 10);
}
function drawPaddlesAndBall() {
  fill(255);
  rect(playerX, playerY, paddleWidth, paddleHeight);
  rect(cpuX, cpuY, paddleWidth, paddleHeight);
  ellipse(ball.x, ball.y, ball.r * 2, ball.r * 2);
}
