let board;
let currentPlayer;
let cellSize;
let gameOver;
let winner;
let passCount;
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
function setup(){
  createCanvas(400,400);
  frameRate(60);
  cellSize = 50;
  initBoard();
  currentPlayer = 1;
  gameOver = false;
  winner = 0;
  passCount = 0;
  textAlign(CENTER, CENTER);
  textSize(14);
}
function draw(){
  background(34,139,34);
  drawGrid();
  drawDiscs();
  if(!gameOver){
    let moves = legalMoves(currentPlayer);
    for(let k=0;k<moves.length;k++){
      let r = moves[k].r;
      let c = moves[k].c;
      fill(255,255,0,150);
      noStroke();
      ellipse(c*cellSize+cellSize/2, r*cellSize+cellSize/2, cellSize*0.25, cellSize*0.25);
    }
  }
  drawScores();
  if(gameOver){
    drawGameOver();
  }
}
function initBoard(){
  board = [];
  for(let r=0;r<8;r++){
    let row = [];
    for(let c=0;c<8;c++){
      row.push(0);
    }
    board.push(row);
  }
  board[3][3] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = 2;
}
function inBounds(r,c){
  return r>=0 && r<8 && c>=0 && c<8;
}
function getFlips(r,c,player){
  let flipsAll = [];
  if(!inBounds(r,c)) return flipsAll;
  if(board[r][c] !== 0) return flipsAll;
  let opponent = player === 1 ? 2 : 1;
  for(let d=0;d<DIRS.length;d++){
    let dr = DIRS[d][0];
    let dc = DIRS[d][1];
    let rr = r + dr;
    let cc = c + dc;
    let flipsDir = [];
    while(inBounds(rr,cc) && board[rr][cc] === opponent){
      flipsDir.push([rr,cc]);
      rr += dr;
      cc += dc;
    }
    if(inBounds(rr,cc) && board[rr][cc] === player && flipsDir.length>0){
      for(let f=0;f<flipsDir.length;f++){
        flipsAll.push(flipsDir[f]);
      }
    }
  }
  return flipsAll;
}
function legalMoves(player){
  let moves = [];
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      let flips = getFlips(r,c,player);
      if(flips.length>0){
        moves.push({r:r,c:c,flips:flips});
      }
    }
  }
  return moves;
}
function placeDisc(r,c,player){
  let flips = getFlips(r,c,player);
  if(flips.length===0) return false;
  board[r][c] = player;
  for(let i=0;i<flips.length;i++){
    let pos = flips[i];
    board[pos[0]][pos[1]] = player;
  }
  return true;
}
function mousePressed(){
  if(gameOver) return;
  if(mouseButton !== LEFT) return;
  if(currentPlayer !== 1) return;
  if(mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) return;
  let col = Math.floor(mouseX / cellSize);
  let row = Math.floor(mouseY / cellSize);
  if(!inBounds(row,col)) return;
  let moved = placeDisc(row,col,1);
  if(moved){
    passCount = 0;
    currentPlayer = 2;
    handleTurnFlow();
  }
}
function handleTurnFlow(){
  if(gameOver) return;
  let attempts = 0;
  while(true){
    attempts++;
    if(attempts>100) break;
    let moves = legalMoves(currentPlayer);
    if(moves.length===0){
      passCount++;
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      if(passCount>=2){
        endGame();
        return;
      }
      continue;
    } else {
      passCount = 0;
    }
    if(currentPlayer === 2){
      aiMove();
      currentPlayer = 1;
      let playerMoves = legalMoves(1);
      if(playerMoves.length===0){
        currentPlayer = 2;
        continue;
      } else {
        return;
      }
    } else {
      return;
    }
  }
}
function aiMove(){
  let moves = legalMoves(2);
  if(moves.length===0) return;
  let bestIndex = 0;
  let bestCount = -1;
  for(let i=0;i<moves.length;i++){
    let cnt = moves[i].flips.length;
    if(cnt>bestCount){
      bestCount = cnt;
      bestIndex = i;
    }
  }
  let choice = moves[bestIndex];
  placeDisc(choice.r, choice.c, 2);
}
function endGame(){
  gameOver = true;
  let score = countScores();
  if(score.black > score.white) winner = 1;
  else if(score.white > score.black) winner = 2;
  else winner = 0;
}
function countScores(){
  let black = 0;
  let white = 0;
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      if(board[r][c]===1) black++;
      else if(board[r][c]===2) white++;
    }
  }
  return {black:black, white:white};
}
function drawGrid(){
  stroke(0);
  strokeWeight(1);
  for(let i=0;i<=8;i++){
    line(0, i*cellSize, 8*cellSize, i*cellSize);
    line(i*cellSize, 0, i*cellSize, 8*cellSize);
  }
}
function drawDiscs(){
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      let val = board[r][c];
      if(val===0) continue;
      if(val===1){
        fill(0);
      } else {
        fill(255);
      }
      noStroke();
      ellipse(c*cellSize+cellSize/2, r*cellSize+cellSize/2, cellSize*0.8, cellSize*0.8);
    }
  }
}
function drawScores(){
  let sc = countScores();
  fill(255);
  noStroke();
  rect(0, height-30, width, 30);
  fill(0);
  text(
