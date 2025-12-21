let board=[];
let gridSize=8;
let cellSize=50;
let currentPlayer=1;
let directions=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
let gameOver=false;
let passCount=0;
function createBoard(){
  board=[];
  for(let x=0;x<gridSize;x++){
    let col=[];
    for(let y=0;y<gridSize;y++){
      col.push(0);
    }
    board.push(col);
  }
  board[3][3]=2;
  board[4][4]=2;
  board[3][4]=1;
  board[4][3]=1;
}
function inBounds(x,y){
  return x>=0 && x<gridSize && y>=0 && y<gridSize;
}
function getFlips(x,y,player){
  let flips=[];
  if(!inBounds(x,y))return flips;
  if(board[x][y]!==0)return flips;
  let opponent=3-player;
  for(let d=0;d<directions.length;d++){
    let dx=directions[d][0];
    let dy=directions[d][1];
    let nx=x+dx;
    let ny=y+dy;
    let line=[];
    while(inBounds(nx,ny) && board[nx][ny]===opponent){
      line.push([nx,ny]);
      nx+=dx;
      ny+=dy;
    }
    if(line.length>0 && inBounds(nx,ny) && board[nx][ny]===player){
      for(let i=0;i<line.length;i++){
        flips.push(line[i]);
      }
    }
  }
  return flips;
}
function validMovesFor(player){
  let moves=[];
  for(let x=0;x<gridSize;x++){
    for(let y=0;y<gridSize;y++){
      let f=getFlips(x,y,player);
      if(f.length>0){
        moves.push({x:x,y:y,flips:f});
      }
    }
  }
  return moves;
}
function applyMove(x,y,player,flips){
  board[x][y]=player;
  for(let i=0;i<flips.length;i++){
    let fx=flips[i][0];
    let fy=flips[i][1];
    board[fx][fy]=player;
  }
}
function countScores(){
  let black=0;
  let white=0;
  for(let x=0;x<gridSize;x++){
    for(let y=0;y<gridSize;y++){
      if(board[x][y]===1)black++;
      if(board[x][y]===2)white++;
    }
  }
  return {black:black,white:white};
}
function aiMove(){
  let moves=validMovesFor(2);
  if(moves.length===0){
    return false;
  }
  let bestMoves=[];
  let bestCount=-1;
  for(let i=0;i<moves.length;i++){
    let c=moves[i].flips.length;
    if(c>bestCount){
      bestCount=c;
      bestMoves=[moves[i]];
    } else if(c===bestCount){
      bestMoves.push(moves[i]);
    }
  }
  let choice=bestMoves[floor(random(0,bestMoves.length))];
  applyMove(choice.x,choice.y,2,choice.flips);
  return true;
}
function setup(){
  createCanvas(400,400);
  createBoard();
}
function draw(){
  background(34,139,34);
  stroke(0);
  for(let i=0;i<=gridSize;i++){
    line(i*cellSize,0,i*cellSize,gridSize*cellSize);
    line(0,i*cellSize,gridSize*cellSize,i*cellSize);
  }
  for(let x=0;x<gridSize;x++){
    for(let y=0;y<gridSize;y++){
      let v=board[x][y];
      if(v!==0){
        if(v===1)fill(0);
        else fill(255);
        noStroke();
        ellipse(x*cellSize+cellSize/2,y*cellSize+cellSize/2,cellSize*0.8,cellSize*0.8);
      }
    }
  }
  if(!gameOver){
    let moves=validMovesFor(currentPlayer);
    if(moves.length>0 && currentPlayer===1){
      noStroke();
      fill(255,255,255,180);
      for(let i=0;i<moves.length;i++){
        let mx=moves[i].x*cellSize+cellSize/2;
        let my=moves[i].y*cellSize+cellSize/2;
        ellipse(mx,my,12,12);
      }
    }
  }
  let scores=countScores();
  fill(255);
  textSize(12);
  noStroke();
  textAlign(LEFT,TOP);
  text(
