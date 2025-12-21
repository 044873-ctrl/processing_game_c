let cols = 10;
let rows = 20;
let cell = 30;
let board = [];
let shapes = [];
let colors = [];
let currentPiece = null;
let dropTimer = 0;
let dropIntervalDefault = 30;
let dropIntervalFast = 2;
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(300, 600);
  shapes = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
  ];
  colors = [
    color(0,200,200),
    color(200,200,0),
    color(160,0,200),
    color(255,165,0),
    color(0,0,200),
    color(0,200,0),
    color(200,0,0)
  ];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    board.push(row);
  }
  spawnPiece();
}
function draw() {
  background(20);
  drawBoard();
  if (!gameOver) {
    let interval = dropIntervalDefault;
    if (keyIsDown(DOWN_ARROW)) {
      interval = dropIntervalFast;
    }
    dropTimer++;
    if (dropTimer >= interval) {
      dropTimer = 0;
      if (!tryMove(0,1)) {
        placePiece();
        clearLines();
        spawnPiece();
      }
    }
  }
  drawPiece();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(255,0,0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function rotateShape(s) {
  let res = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(0);
    }
    res.push(row);
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      res[c][3-r] = s[r][c];
    }
  }
  return res;
}
function collides(shape, px, py) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c]) {
        let x = px + c;
        let y = py + r;
        if (x < 0 || x >= cols || y >= rows) {
          return true;
        }
        if (y >= 0 && board[y][x] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}
function tryMove(dx, dy) {
  let nx = currentPiece.x + dx;
  let ny = currentPiece.y + dy;
  if (!collides(currentPiece.shape, nx, ny)) {
    currentPiece.x = nx;
    currentPiece.y = ny;
    return true;
  }
  return false;
}
function placePiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece.shape[r][c]) {
        let x = currentPiece.x + c;
        let y = currentPiece.y + r;
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          board[y][x] = currentPiece.colorIndex + 1;
        } else if (y < 0) {
          gameOver = true;
        }
      }
    }
  }
}
function clearLines() {
  let newBoard = [];
  let cleared = 0;
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (!full) {
      newBoard.push(board[r].slice());
    } else {
      cleared++;
    }
  }
  while (newBoard.length < rows) {
    let emptyRow = [];
    for (let c = 0; c < cols; c++) {
      emptyRow.push(0);
    }
    newBoard.push(emptyRow);
  }
  for (let r = 0; r < rows; r++) {
    board[r] = newBoard[rows - 1 - r].slice();
  }
  if (cleared > 0) {
    score += cleared * 100;
  }
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * shapes.length);
  let shapeCopy = JSON.parse(JSON.stringify(shapes[idx]));
  let startX = Math.floor(cols / 2) - 2;
  let startY = 0;
  currentPiece = {
    shape: shapeCopy,
    x: startX,
    y: startY,
    colorIndex: idx
  };
  if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function drawBoard() {
  stroke(40);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = board[r][c];
      if (v === 0) {
        fill(30);
      } else {
        fill(colors[v-1]);
      }
      rect(c * cell, r * cell, cell, cell);
    }
  }
}
function drawPiece() {
  if (currentPiece === null) {
    return;
  }
  noStroke();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece.shape[r][c]) {
        let x = currentPiece.x + c;
        let y = currentPiece.y + r;
        if (y >= 0) {
          fill(colors[currentPiece.colorIndex]);
          stroke(40);
          rect(x * cell, y * cell, cell, cell);
        }
      }
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    tryMove(-1,0);
  } else if (keyCode === RIGHT_ARROW) {
    tryMove(1,0);
  } else if (keyCode === DOWN_ARROW) {
    // handled in draw for continuous
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateShape(currentPiece.shape);
    if (!collides(rotated, currentPiece.x, currentPiece.y)) {
      currentPiece.shape = rotated;
    }
  }
}
