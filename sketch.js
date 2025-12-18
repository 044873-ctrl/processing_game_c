let board = [];
let cellSize = 60;
let margin = 20;
let turn = "black";
let blacks = 0;
let whites = 0;

function setup() {
  createCanvas(cellSize * 8 + margin * 2, cellSize * 8 + margin * 2);
  noLoop();
  initializeBoard();
}

function initializeBoard() {
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = 0;
    }
  }
  board[3][3] = "white";
  board[3][4] = "black";
  board[4][3] = "black";
  board[4][4] = "white";
}

function draw() {
  background(0, 100, 0);
  drawBoard();
}

function drawBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      stroke(0);
      fill(0, 255, 0);
      rect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize);
      if (board[i][j] === "black") {
        fill(0);
        ellipse(margin + i * cellSize + cellSize / 2, margin + j * cellSize + cellSize / 2, cellSize / 2, cellSize / 2);
      }
      if (board[i][j] === "white") {
        fill(255);
        ellipse(margin + i * cellSize + cellSize / 2, margin + j * cellSize + cellSize / 2, cellSize / 2, cellSize / 2);
      }
    }
  }
}

function mouseClicked() {
  let x = floor((mouseX - margin) / cellSize);
  let y = floor((mouseY - margin) / cellSize);
  if (isValidMove(x, y, turn)) {
    flipDiscs(x, y, turn);
    turn = (turn === "black") ? "white" : "black";
  }
  redraw();
}

function isValidMove(x, y, color) {
  if (board[x][y] !== 0) return false;
  let dx, dy;
  for (dx = -1; dx <= 1; dx++) {
    for (dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (canFlip(x, y, dx, dy, color)) return true;
    }
  }
  return false;
}

function canFlip(x, y, dx, dy, color) {
  let flipped = false;
  while (true) {
    x += dx;
    y += dy;
    if (x < 0 || y < 0 || x >= 8 || y >= 8) return false;
    if (board[x][y] === 0) return false;
    if (board[x][y] === color) return flipped;
    flipped = true;
  }
}

function flipDiscs(x, y, color) {
  board[x][y] = color;
  let dx, dy;
  for (dx = -1; dx <= 1; dx++) {
    for (dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (canFlip(x, y, dx, dy, color)) {
        flipInDirection(x, y, dx, dy, color);
      }
    }
  }
}

function flipInDirection(x, y, dx, dy, color) {
  while (true) {
    x += dx;
    y += dy;
    if (board[x][y] === color) break;
    board[x][y] = color;
  }
}
