let cols = 10;
let rows = 20;
let cellSize = 30;
let board = [];
let shapes = {};
let shapeTypes = [];
let currentPiece = null;
let dropCounter = 0;
let dropIntervalDefault = 30;
let dropIntervalFast = 2;
let score = 0;
let gameOver = false;
function rotateMatrix(mat){
  let res = [];
  for(let r = 0; r < 4; r++){
    res[r] = [];
    for(let c = 0; c < 4; c++){
      res[r][c] = mat[3 - c][r];
    }
  }
  return res;
}
function getShapeMatrix(piece){
  let base = shapes[piece.type];
  let mat = [];
  for(let r = 0; r < 4; r++){
    mat[r] = [];
    for(let c = 0; c < 4; c++){
      mat[r][c] = base[r][c];
    }
  }
  for(let i = 0; i < piece.rotation; i++){
    mat = rotateMatrix(mat);
  }
  return mat;
}
function validMove(x,y,mat){
  for(let r = 0; r < 4; r++){
    for(let c = 0; c < 4; c++){
      if(mat[r][c] === 0){
        continue;
      }
      let bx = x + c;
      let by = y + r;
      if(bx < 0 || bx >= cols){
        return false;
      }
      if(by >= rows){
        return false;
      }
      if(by >= 0){
        if(board[by][bx] !== 0){
          return false;
        }
      }
    }
  }
  return true;
}
function lockPiece(){
  let mat = getShapeMatrix(currentPiece);
  for(let r = 0; r < 4; r++){
    for(let c = 0; c < 4; c++){
      if(mat[r][c] === 0){
        continue;
      }
      let bx = currentPiece.x + c;
      let by = currentPiece.y + r;
      if(by >= 0 && by < rows && bx >= 0 && bx < cols){
        board[by][bx] = currentPiece.color;
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines(){
  let linesCleared = 0;
  for(let r = rows - 1; r >= 0; r--){
    let full = true;
    for(let c = 0; c < cols; c++){
      if(board[r][c] === 0){
        full = false;
        break;
      }
    }
    if(full){
      linesCleared++;
      board.splice(r,1);
      let newRow = [];
      for(let c = 0; c < cols; c++){
        newRow[c] = 0;
      }
      board.unshift(newRow);
      r++;
    }
  }
  if(linesCleared > 0){
    score += linesCleared * 100;
  }
}
function spawnPiece(){
  let idx = floor(random(shapeTypes.length));
  let type = shapeTypes[idx];
  let piece = {type:type, rotation:0, x:3, y:-1, color:idx+1};
  if(!validMove(piece.x, piece.y, getShapeMatrix(piece))){
    gameOver = true;
  } else {
    currentPiece = piece;
  }
}
function movePiece(dx){
  if(currentPiece === null){
    return;
  }
  let nx = currentPiece.x + dx;
  let ny = currentPiece.y;
  let mat = getShapeMatrix(currentPiece);
  if(validMove(nx, ny, mat)){
    currentPiece.x = nx;
  }
}
function softDrop(){
  if(currentPiece === null){
    return;
  }
  let nx = currentPiece.x;
  let ny = currentPiece.y + 1;
  let mat = getShapeMatrix(currentPiece);
  if(validMove(nx, ny, mat)){
    currentPiece.y = ny;
  } else {
    lockPiece();
  }
}
function hardDrop(){
  if(currentPiece === null){
    return;
  }
  while(true){
    let nx = currentPiece.x;
    let ny = currentPiece.y + 1;
    let mat = getShapeMatrix(currentPiece);
    if(validMove(nx, ny, mat)){
      currentPiece.y = ny;
    } else {
      break;
    }
  }
  lockPiece();
}
function rotatePiece(){
  if(currentPiece === null){
    return;
  }
  let newRotation = (currentPiece.rotation + 1) % 4;
  let testPiece = {type:currentPiece.type, rotation:newRotation, x:currentPiece.x, y:currentPiece.y, color:currentPiece.color};
  let mat = getShapeMatrix(testPiece);
  let kicks = [0, -1, 1, -2, 2];
  let success = false;
  for(let i = 0; i < kicks.length; i++){
    let nx = testPiece.x + kicks[i];
    if(validMove(nx, testPiece.y, mat)){
      currentPiece.rotation = newRotation;
      currentPiece.x = nx;
      success = true;
      break;
    }
  }
  if(!success){
    return;
  }
}
function drawCell(x,y,colId){
  if(colId === 0){
    return;
  }
  let colors = [
    [0,0,0],
    [0,255,255],
    [255,255,0],
    [128,0,128],
    [255,165,0],
    [0,0,255],
    [0,255,0],
    [255,0,0]
  ];
  let c = colors[colId] || [255,255,255];
  fill(c[0], c[1], c[2]);
  stroke(50);
  rect(x * cellSize, y * cellSize, cellSize, cellSize);
}
function initShapes(){
  shapes["I"] = [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["O"] = [
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["T"] = [
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["L"] = [
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["J"] = [
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["S"] = [
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapes["Z"] = [
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  shapeTypes = ["I","O","T","L","J",
