let board = [];
let tileSize;
let player;
let ai;

function setup() {
  createCanvas(400, 400);
  tileSize = width / 8;
  player = 1;
  ai = -1;
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = 0;
    }
  }
  board[3][3] = board[4][4] = 1;
  board[3][4] = board[4][3] = -1;
}

function draw() {
  background(200);
  drawBoard();
  drawTiles();
}

function drawBoard() {
  strokeWeight(2);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let x = i * tileSize;
      let y = j * tileSize;
      fill(0, 255, 0);
      rect(x, y, tileSize, tileSize);
    }
  }
}

function drawTiles() {
  noStroke();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let x = i * tileSize + tileSize / 2;
      let y = j * tileSize + tileSize / 2;
      if (board[i][j] === 1) {
        fill(255);
        ellipse(x, y, tileSize / 2);
      } else if (board[i][j] === -1) {
        fill(0);
        ellipse(x, y, tileSize / 2);
      }
    }
  }
}

function mousePressed() {
  let i = floor(mouseX / tileSize);
  let j = floor(mouseY / tileSize);
  if (board[i][j] === 0) {
    board[i][j] = player;
    player *= -1;
  }
}
