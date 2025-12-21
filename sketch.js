let mode = 'othello';
let cellSize;
function setup() {
  createCanvas(400,400);
  cellSize = 50;
  otInit();
  gInit();
  textFont('sans-serif');
  textAlign(CENTER, CENTER);
}
function draw() {
  background(30);
  if (mode === 'othello') {
    drawOthello();
  } else {
    draw2048();
  }
}
let otBoard = [];
let otCurrent = 1;
let otDirs = [];
let otPasses = 0;
let otGameOver = false;
function otInit() {
  otBoard = [];
  for (let r = 0; r < 8; r++) {
    let row = [];
    for (let c = 0; c < 8; c++) {
      row.push(0);
    }
    otBoard.push(row);
  }
  otBoard[3][3] = 2;
  otBoard[3][4] = 1;
  otBoard[4][3] = 1;
  otBoard[4][4] = 2;
  otDirs = [
    {dr:-1,dc:-1},{dr:-1,dc:0},{dr:-1,dc:1},
    {dr:0,dc:-1},{dr:0,dc:1},
    {dr:1,dc:-1},{dr:1,dc:0},{dr:1,dc:1}
  ];
  otCurrent = 1;
  otPasses = 0;
  otGameOver = false;
}
function drawOthello() {
  push();
  translate(0,0);
  stroke(100);
  for (let r = 0; r <= 8; r++) {
    line(0, r*50, 400, r*50);
  }
  for (let c = 0; c <= 8; c++) {
    line(c*50, 0, c*50, 400);
  }
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let v = otBoard[r][c];
      if (v !== 0) {
        if (v === 1) {
          fill(0);
        } else {
          fill(255);
        }
        noStroke();
        ellipse(c*50+25, r*50+25, 36, 36);
      }
    }
  }
  pop();
  fill(255);
  textSize(14);
  let s = '';
  if (otGameOver) {
    let counts = countOthello();
    if (counts.black > counts.white) {
      s = 'Black wins';
    } else if (counts.white > counts.black) {
      s = 'White wins';
    } else {
      s = 'Draw';
    }
  } else {
    s = otCurrent === 1 ? 'Black to move' : 'White to move';
  }
  text(s, 200, 410-10);
}
function countOthello() {
  let black = 0;
  let white = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (otBoard[r][c] === 1) black++;
      if (otBoard[r][c] === 2) white++;
    }
  }
  return {black:black, white:white};
}
function otInBounds(r,c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function otGetFlips(r,c,player) {
  let flips = [];
  if (!otInBounds(r,c)) return flips;
  if (otBoard[r][c] !== 0) return flips;
  let opponent = player === 1 ? 2 : 1;
  for (let i = 0; i < otDirs.length; i++) {
    let dr = otDirs[i].dr;
    let dc = otDirs[i].dc;
    let rr = r + dr;
    let cc = c + dc;
    let line = [];
    let foundOpponent = false;
    while (otInBounds(rr,cc) && otBoard[rr][cc] === opponent) {
      line.push({r:rr,c:cc});
      rr += dr;
      cc += dc;
      foundOpponent = true;
    }
    if (foundOpponent && otInBounds(rr,cc) && otBoard[rr][cc] === player) {
      for (let k = 0; k < line.length; k++) {
        flips.push(line[k]);
      }
    }
  }
  return flips;
}
function otAllValidMoves(player) {
  let moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      let f = otGetFlips(r,c,player);
      if (f.length > 0) {
        moves.push({r:r,c:c,flips:f});
      }
    }
  }
  return moves;
}
function otApplyMove(move, player) {
  otBoard[move.r][move.c] = player;
  for (let i = 0; i < move.flips.length; i++) {
    let p = move.flips[i];
    otBoard[p.r][p.c] = player;
  }
}
function mousePressed() {
  if (mouseX < 0 || mouseX >= 400 || mouseY < 0 || mouseY >= 400) return;
  if (mode === 'othello') {
    if (otGameOver) return;
    let c = floor(mouseX / 50);
    let r = floor(mouseY / 50);
    let flips = otGetFlips(r,c,1);
    if (flips.length === 0) return;
    otApplyMove({r:r,c:c,flips:flips},1);
    otCurrent = 2;
    otPasses = 0;
    let aiMoves = otAllValidMoves(2);
    if (aiMoves.length > 0) {
      let idx = floor(random(aiMoves.length));
      otApplyMove(aiMoves[idx],2);
      otCurrent = 1;
    } else {
      otCurrent = 1;
      let playerMoves = otAllValidMoves(1);
      if (playerMoves.length === 0) {
        otGameOver = true;
      }
    }
    let both = otAllValidMoves(1).length === 0 && otAllValidMoves(2).length === 0;
    if (both) otGameOver = true;
  } else {
    let gx = floor(mouseX / 100);
    let gy = floor(mouseY / 100);
    if (gx < 0 || gx >= 4 || gy < 0 || gy >= 4) return;
  }
}
let grid = [];
let score = 0;
let movedThisTurn = false;
function gInit() {
  grid = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(0);
    }
    grid.push(row);
  }
  score = 0;
  addRandomTile();
  addRandomTile();
}
function addRandomTile() {
  let empties = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empties.push({r:r,c:c});
    }
  }
  if (empties.length === 0) return;
  let idx = floor(random(empties.length));
  let p = empties[idx];
  grid[p.r][p.c] = 2;
}
function draw2048() {
  push();
  translate(0,0);
  noStroke();
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let x = c*100;
      let y = r*100;
      let v = grid[r][c];
      if (v === 0) {
        fill(200);
      } else {
        let shade = 255 - min(240, v * 3);
        shade = constrain(shade, 40, 255);
        fill(shade);
      }
      rect(x+5, y+5, 90, 90, 6);
      if (v !== 0) {
        fill(v <= 8 ? 30 : 255);
        textSize(32);
        text(v, x+50, y+50);
      }
    }
  }
  pop();
  fill(255);
  textSize(14);
  text('Score: ' + score, 200, 410-10);
}
function moveGridLeft() {
  movedThisTurn = false;
  for (let r = 0; r < 4; r++) {
    let line = [];
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] !== 0) line.push(grid[r][c]);
    }
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i+1]) {
        line[i] = line[i] * 2;
        score += line[i];
        line[i+1] = 0;
        i++;
      }
    }
    let newLine = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0) newLine.push(line[i]);
    }
    while (newLine.length < 4) newLine.push(0);
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] !== newLine[c]) movedThisTurn = true;
      grid[r][c] = newLine[c];
    }
  }
}
function moveGridRight() {
  movedThisTurn = false;
  for (let r = 0; r < 4; r++) {
    let line = [];
    for (let c = 3; c >= 0; c--) {
      if (grid[r][c] !== 0) line.push(grid[r][c]);
    }
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i+1]) {
        line[i] = line[i] * 2;
        score += line[i];
        line[i+1] = 0;
        i++;
      }
    }
    let newLine = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0) newLine.push(line[i]);
    }
    while (newLine.length < 4) newLine.push(0);
    for (let c = 3; c >= 0; c--) {
      let idx = 3 - c;
      if (grid[r][c] !== newLine[idx]) movedThisTurn = true;
      grid[r][c] = newLine[idx];
    }
  }
}
function moveGridUp() {
  movedThisTurn = false;
  for (let c = 0; c < 4; c++) {
    let line = [];
    for (let r = 0; r < 4; r++) {
      if (grid[r][c] !== 0) line.push(grid[r][c]);
    }
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i+1]) {
        line[i] = line[i] * 2;
        score += line[i];
        line[i+1] = 0;
        i++;
      }
    }
    let newLine = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0) newLine.push(line[i]);
    }
    while (newLine.length < 4) newLine.push(0);
    for (let r = 0; r < 4; r++) {
      if (grid[r][c] !== newLine[r]) movedThisTurn = true;
      grid[r][c] = newLine[r];
    }
  }
}
function moveGridDown() {
  movedThisTurn = false;
  for (let c = 0; c < 4; c++) {
    let line = [];
    for (let r = 3; r >= 0; r--) {
      if (grid[r][c] !== 0) line.push(grid[r][c]);
    }
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i+1]) {
        line[i] = line[i] * 2;
        score += line[i];
        line[i+1] = 0;
        i++;
      }
    }
    let newLine = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] !== 0) newLine.push(line[i]);
    }
    while (newLine.length < 4) newLine.push(0);
    for (let r = 3; r >= 0; r--) {
      let idx = 3 - r;
      if (grid[r][c] !== newLine[idx]) movedThisTurn = true;
      grid[r][c] = newLine[idx];
    }
  }
}
function canMove2048() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c < 3 && grid[r][c] === grid[r][c+1]) return true;
      if (r < 3 && grid[r][c] === grid[r+1][c]) return true;
    }
  }
  return false;
}
function keyPressed() {
  if (key === '1') {
    mode = 'othello';
  } else if (key === '2') {
    mode = '2048';
  } else if (key === 'r' || key === 'R') {
    if (mode === 'othello') otInit();
    else gInit();
  }
  if (mode === '2048') {
    if (keyCode === LEFT_ARROW) {
      moveGridLeft();
      if (movedThisTurn) addRandomTile();
    } else if (keyCode === RIGHT_ARROW) {
      moveGridRight();
      if (movedThisTurn) addRandomTile();
    } else if (keyCode === UP_ARROW) {
      moveGridUp();
      if (movedThisTurn) addRandomTile();
    } else if (keyCode === DOWN_ARROW) {
      moveGridDown();
      if (movedThisTurn) addRandomTile();
    }
  }
}
