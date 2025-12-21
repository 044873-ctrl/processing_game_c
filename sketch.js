let CELL = 50;
let SIZE = 8;
let board = [];
let currentPlayer = 1;
let gameOver = false;
let directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
let lastMove = {r:-1,c:-1};
for (let r = 0; r < SIZE; r += 1) {
  board[r] = [];
  for (let c = 0; c < SIZE; c += 1) {
    board[r][c] = 0;
  }
}
board[3][3] = 2;
board[4][4] = 2;
board[3][4] = 1;
board[4][3] = 1;
function inBounds(r,c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}
function getFlipsInDirection(r,c,dr,dc,player) {
  let flips = [];
  let rr = r + dr;
  let cc = c + dc;
  while (inBounds(rr,cc) && board[rr][cc] !== 0 && board[rr][cc] !== player) {
    flips.push({r:rr,c:cc});
    rr += dr;
    cc += dc;
  }
  if (!inBounds(rr,cc) || board[rr][cc] !== player) {
    return [];
  }
  return flips;
}
function getFlips(r,c,player) {
  if (!inBounds(r,c) || board[r][c] !== 0) {
    return [];
  }
  let all = [];
  for (let i = 0; i < directions.length; i += 1) {
    let dr = directions[i][0];
    let dc = directions[i][1];
    let part = getFlipsInDirection(r,c,dr,dc,player);
    if (part.length > 0) {
      for (let j = 0; j < part.length; j += 1) {
        all.push(part[j]);
      }
    }
  }
  return all;
}
function hasAnyValidMove(player) {
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      let flips = getFlips(r,c,player);
      if (flips.length > 0) {
        return true;
      }
    }
  }
  return false;
}
function getValidMoves(player) {
  let moves = [];
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      let flips = getFlips(r,c,player);
      if (flips.length > 0) {
        moves.push({r:r,c:c,flips:flips});
      }
    }
  }
  return moves;
}
function applyMove(r,c,player,flips) {
  board[r][c] = player;
  for (let i = 0; i < flips.length; i += 1) {
    let p = flips[i];
    board[p.r][p.c] = player;
  }
  lastMove.r = r;
  lastMove.c = c;
}
function countPieces() {
  let black = 0;
  let white = 0;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board[r][c] === 1) {
        black += 1;
      } else if (board[r][c] === 2) {
        white += 1;
      }
    }
  }
  return {black:black,white:white};
}
function aiMakeMove() {
  let moves = getValidMoves(2);
  if (moves.length === 0) {
    return false;
  }
  let bestCount = -1;
  let bestMoves = [];
  for (let i = 0; i < moves.length; i += 1) {
    let m = moves[i];
    let cnt = m.flips.length;
    if (cnt > bestCount) {
      bestCount = cnt;
      bestMoves = [m];
    } else if (cnt === bestCount) {
      bestMoves.push(m);
    }
  }
  let choiceIndex = Math.floor(Math.random() * bestMoves.length);
  let choice = bestMoves[choiceIndex];
  applyMove(choice.r,choice.c,2,choice.flips);
  return true;
}
function processTurns() {
  if (gameOver) {
    return;
  }
  if (currentPlayer === 2) {
    let played = aiMakeMove();
    if (played) {
      currentPlayer = 1;
    } else {
      if (hasAnyValidMove(1)) {
        currentPlayer = 1;
      } else {
        gameOver = true;
      }
    }
  }
  if (currentPlayer === 1) {
    if (!hasAnyValidMove(1)) {
      if (hasAnyValidMove(2)) {
        currentPlayer = 2;
        processTurns();
      } else {
        gameOver = true;
      }
    }
  }
  let counts = countPieces();
  if (counts.black + counts.white === SIZE * SIZE) {
    gameOver = true;
  }
}
function setup() {
  createCanvas(400,400);
  frameRate(60);
  processTurns();
}
function draw() {
  background(34);
  stroke(200);
  for (let i = 0; i <= SIZE; i += 1) {
    line(i * CELL, 0, i * CELL, SIZE * CELL);
    line(0, i * CELL, SIZE * CELL, i * CELL);
  }
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      let x = c * CELL + CELL * 0.5;
      let y = r * CELL + CELL * 0.5;
      if (board[r][c] === 1) {
        fill(0);
        stroke(255);
        ellipse(x,y,CELL*0.8,CELL*0.8);
      } else if (board[r][c] === 2) {
        fill(255);
        stroke(0);
        ellipse(x,y,CELL*0.8,CELL*0.8);
      }
    }
  }
  if (!gameOver && currentPlayer === 1) {
    let moves = getValidMoves(1);
    noStroke();
    fill(200,200,200,150);
    for (let i = 0; i < moves.length; i += 1) {
      let m = moves[i];
      let x = m.c * CELL + CELL * 0.5;
      let y = m.r * CELL + CELL * 0.5;
      ellipse(x,y,CELL*0.25,CELL*0.25);
    }
  }
  let counts = countPieces();
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text(
