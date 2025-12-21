let cellSize = 50;
let cols = 8;
let rows = 8;
let board = [];
let currentPlayer = 1;
let gameOver = false;
let dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];
function initBoard() {
  board = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    board.push(row);
  }
  board[3][3] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = 2;
  currentPlayer = 1;
  gameOver = false;
}
function inBounds(r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}
function getFlips(r, c, player, boardState) {
  let flips = [];
  if (!inBounds(r, c)) {
    return flips;
  }
  if (boardState[r][c] !== 0) {
    return flips;
  }
  let opponent = player === 1 ? 2 : 1;
  for (let d = 0; d < dirs.length; d++) {
    let dr = dirs[d][0];
    let dc = dirs[d][1];
    let tr = r + dr;
    let tc = c + dc;
    let line = [];
    while (inBounds(tr, tc) && boardState[tr][tc] === opponent) {
      line.push([tr, tc]);
      tr += dr;
      tc += dc;
    }
    if (line.length > 0 && inBounds(tr, tc) && boardState[tr][tc] === player) {
      for (let k = 0; k < line.length; k++) {
        flips.push(line[k]);
      }
    }
  }
  return flips;
}
function getValidMoves(player, boardState) {
  let moves = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c] === 0) {
        let flips = getFlips(r, c, player, boardState);
        if (flips.length > 0) {
          moves.push({ r: r, c: c, flips: flips });
        }
      }
    }
  }
  return moves;
}
function applyMove(r, c, player, flips, boardState) {
  if (!inBounds(r, c)) {
    return;
  }
  boardState[r][c] = player;
  for (let i = 0; i < flips.length; i++) {
    let pos = flips[i];
    let fr = pos[0];
    let fc = pos[1];
    if (inBounds(fr, fc)) {
      boardState[fr][fc] = player;
    }
  }
}
function countScores(boardState) {
  let black = 0;
  let white = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (boardState[r][c] === 1) {
        black++;
      } else if (boardState[r][c] === 2) {
        white++;
      }
    }
  }
  return { black: black, white: white };
}
function aiChooseMove(player, boardState) {
  let moves = getValidMoves(player, boardState);
  if (moves.length === 0) {
    return null;
  }
  let best = moves[0];
  let bestScore = best.flips.length;
  for (let i = 1; i < moves.length; i++) {
    let m = moves[i];
    let s = m.flips.length;
    if (s > bestScore) {
      best = m;
      bestScore = s;
    }
  }
  return best;
}
function performAITurns() {
  let loopGuard = 0;
  while (currentPlayer === 2 && loopGuard < 100) {
    loopGuard++;
    let aiMove = aiChooseMove(2, board);
    if (aiMove === null) {
      let playerMovesAfterPass = getValidMoves(1, board);
      if (playerMovesAfterPass.length === 0) {
        gameOver = true;
        return;
      } else {
        currentPlayer = 1;
        return;
      }
    } else {
      applyMove(aiMove.r, aiMove.c, 2, aiMove.flips, board);
      currentPlayer = 1;
      let playerMoves = getValidMoves(1, board);
      if (playerMoves.length === 0) {
        currentPlayer = 2;
        continue;
      } else {
        return;
      }
    }
  }
  if (loopGuard >= 100) {
    gameOver = true;
  }
}
function setup() {
  createCanvas(400, 400);
  initBoard();
}
function drawBoard() {
  background(34, 139, 34);
  stroke(0);
  for (let i = 0; i <= cols; i++) {
    line(i * cellSize, 0, i * cellSize, rows * cellSize);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * cellSize, cols * cellSize, j * cellSize);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = board[r][c];
      if (v === 1) {
        fill(0);
        ellipse(c * cellSize + cellSize / 2, r * cellSize + cellSize / 2, cellSize * 0.8, cellSize * 0.8);
      } else if (v === 2) {
        fill(255);
        ellipse(c * cellSize + cellSize / 2, r * cellSize + cellSize / 2, cellSize * 0.8, cellSize * 0.8);
      }
    }
  }
}
function drawHighlights() {
  let moves = getValidMoves(1, board);
  noStroke();
  fill(255, 255, 0, 150);
  for (let i = 0; i < moves.length; i++) {
    let m = moves[i];
    rect(m.c * cellSize + cellSize * 0.25, m.r * cellSize + cellSize * 0.25, cellSize * 0.5, cellSize * 0.5, 4);
  }
}
function drawHUD() {
  let scores = countScores(board);
  noStroke();
  fill(0);
  rect(0, rows * cellSize, width, height - rows * cellSize);
  fill(0);
  textSize(14);
  fill(0);
  let bx = 10;
  let by = rows * cellSize + 20;
  fill(0);
  ellipse(bx + 10, by, 14, 14);
  fill(255);
  text(String(scores.black), bx + 30, by + 5);
  fill(255);
  ellipse(bx + 90, by, 14, 14);
  fill(0);
  text(String(scores.white), bx + 110, by + 5);
  if (gameOver) {
    fill(255, 0, 0);
    textSize(18);
    textAlign(CENTER, CENTER);
    if (scores.black > scores.white) {
      text("Black wins", width / 2, height - 12);
    } else if (scores.white > scores.black) {
      text("White wins", width / 2, height - 12);
    } else {
      text("Draw", width / 2, height - 12);
    }
    textAlign(LEFT, BASELINE);
  } else {
    textSize(14);
    fill(0);
    textAlign(LEFT, BASELINE);
    if (currentPlayer === 1) {
      text("Black to move", 150, rows * cellSize + 5);
    } else {
      text("White to move", 150, rows * cellSize + 5);
    }
    textAlign(LEFT, BASELINE);
  }
}
function draw() {
  drawBoard();
  if (!gameOver) {
    drawHighlights();
  }
  drawHUD();
}
function mousePressed() {
  if (gameOver) {
    initBoard();
    return;
  }
  if (mouseX < 0 || mouseX >= cols * cellSize || mouseY < 0 || mouseY >= rows * cellSize) {
    return;
  }
  if (currentPlayer !== 1) {
    return;
  }
  let c = Math.floor(mouseX / cellSize);
  let r = Math.floor(mouseY / cellSize);
  if (!inBounds(r, c)) {
    return;
  }
  let moves = getValidMoves(1, board);
  let chosen = null;
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].r === r && moves[i].c === c) {
      chosen = moves[i];
      break;
    }
  }
  if (chosen === null) {
    return;
  }
  applyMove(r, c, 1, chosen.flips, board);
  currentPlayer = 2;
  performAITurns();
  let movesAfter = getValidMoves(1, board);
  let movesAI = getValidMoves(2, board);
  if (movesAfter.length === 0 && movesAI.length === 0) {
    gameOver = true;
  }
}
