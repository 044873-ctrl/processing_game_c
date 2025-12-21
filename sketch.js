let board = [];
let rows = 8;
let cols = 8;
let cellSize = 50;
let currentPlayer = 1;
let directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];
let gameOver = false;
let blackScore = 0;
let whiteScore = 0;
let validMovesCache = [];

function setup() {
  createCanvas(400, 400);
  initBoard();
  countScores();
  validMovesCache = getValidMoves(currentPlayer);
  textFont('Arial');
  textAlign(LEFT, TOP);
}

function draw() {
  background(30, 120, 30);
  drawBoard();
  drawStones();
  drawValidMoves();
  drawUI();
  if (!gameOver) {
    validMovesCache = getValidMoves(currentPlayer);
    if (validMovesCache.length === 0) {
      let otherMoves = getValidMoves(getOpponent(currentPlayer));
      if (otherMoves.length === 0) {
        gameOver = true;
      } else {
        currentPlayer = getOpponent(currentPlayer);
      }
    }
  }
}

function initBoard() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    board.push(row);
  }
  board[3][3] = 2;
  board[4][4] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
}

function inBounds(r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function getOpponent(player) {
  if (player === 1) {
    return 2;
  }
  return 1;
}

function getFlips(bd, r, c, player) {
  let flips = [];
  if (!inBounds(r, c)) {
    return flips;
  }
  if (bd[r][c] !== 0) {
    return flips;
  }
  for (let i = 0; i < directions.length; i++) {
    let dr = directions[i][0];
    let dc = directions[i][1];
    let rr = r + dr;
    let cc = c + dc;
    let line = [];
    while (inBounds(rr, cc) && bd[rr][cc] === getOpponent(player)) {
      line.push([rr, cc]);
      rr += dr;
      cc += dc;
    }
    if (inBounds(rr, cc) && bd[rr][cc] === player && line.length > 0) {
      for (let j = 0; j < line.length; j++) {
        flips.push([line[j][0], line[j][1]]);
      }
    }
  }
  return flips;
}

function isValidMove(bd, r, c, player) {
  let flips = getFlips(bd, r, c, player);
  return flips.length > 0;
}

function getValidMoves(player) {
  let moves = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isValidMove(board, r, c, player)) {
        moves.push([r, c]);
      }
    }
  }
  return moves;
}

function applyMove(bd, r, c, player) {
  let flips = getFlips(bd, r, c, player);
  if (flips.length === 0) {
    return false;
  }
  bd[r][c] = player;
  for (let i = 0; i < flips.length; i++) {
    let pos = flips[i];
    bd[pos[0]][pos[1]] = player;
  }
  return true;
}

function countScores() {
  let b = 0;
  let w = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 1) {
        b++;
      } else if (board[r][c] === 2) {
        w++;
      }
    }
  }
  blackScore = b;
  whiteScore = w;
}

function aiMove() {
  let moves = getValidMoves(currentPlayer);
  if (moves.length === 0) {
    return false;
  }
  let bestMoves = [];
  let bestScore = -1;
  for (let i = 0; i < moves.length; i++) {
    let r = moves[i][0];
    let c = moves[i][1];
    let flips = getFlips(board, r, c, currentPlayer).length;
    if (flips > bestScore) {
      bestScore = flips;
      bestMoves = [[r, c]];
    } else if (flips === bestScore) {
      bestMoves.push([r, c]);
    }
  }
  let choiceIndex = Math.floor(Math.random() * bestMoves.length);
  let cr = bestMoves[choiceIndex][0];
  let cc = bestMoves[choiceIndex][1];
  applyMove(board, cr, cc, currentPlayer);
  return true;
}

function mousePressed() {
  if (mouseButton !== LEFT) {
    return;
  }
  if (gameOver) {
    return;
  }
  if (mouseX < 0 || mouseX >= cols * cellSize || mouseY < 0 || mouseY >= rows * cellSize) {
    return;
  }
  let c = Math.floor(mouseX / cellSize);
  let r = Math.floor(mouseY / cellSize);
  if (currentPlayer !== 1) {
    return;
  }
  if (!isValidMove(board, r, c, currentPlayer)) {
    return;
  }
  applyMove(board, r, c, currentPlayer);
  countScores();
  currentPlayer = getOpponent(currentPlayer);
  if (getValidMoves(currentPlayer).length > 0) {
    aiMove();
    countScores();
    currentPlayer = getOpponent(currentPlayer);
  } else {
    if (getValidMoves(currentPlayer).length === 0) {
      gameOver = true;
    } else {
      currentPlayer = getOpponent(currentPlayer);
    }
  }
}

function drawBoard() {
  stroke(0);
  strokeWeight(2);
  for (let r = 0; r <= rows; r++) {
    line(0, r * cellSize, cols * cellSize, r * cellSize);
  }
  for (let c = 0; c <= cols; c++) {
    line(c * cellSize, 0, c * cellSize, rows * cellSize);
  }
}

function drawStones() {
  noStroke();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = c * cellSize + cellSize / 2;
      let y = r * cellSize + cellSize / 2;
      if (board[r][c] === 1) {
        fill(0);
        ellipse(x, y, cellSize * 0.9, cellSize * 0.9);
      } else if (board[r][c] === 2) {
        fill(255);
        ellipse(x, y, cellSize * 0.9, cellSize * 0.9);
      }
    }
  }
}

function drawValidMoves() {
  let moves = getValidMoves(1);
  fill(255, 255, 255, 150);
  noStroke();
  for (let i = 0; i < moves.length; i++) {
    let r = moves[i][0];
    let c = moves[i][1];
    let x = c * cellSize + cellSize / 2;
    let y = r * cellSize + cellSize / 2;
    ellipse(x, y, 10, 10);
  }
}

function drawUI() {
  fill(255);
  textSize(14);
  let status = '';
  if (gameOver) {
    if (blackScore > whiteScore) {
      status = 'Black wins';
    } else if (whiteScore > blackScore) {
      status = 'White wins';
    } else {
      status = 'Draw';
    }
  } else {
    if (currentPlayer === 1) {
      status = 'Your turn (Black)';
    } else {
      status = 'White thinking...';
    }
  }
  text('Black: ' + blackScore + '  White: ' + whiteScore, 8, 8);
  text(status, 8, 26);
}
