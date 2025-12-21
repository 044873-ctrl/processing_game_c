var COLS=10;
var ROWS=20;
var CELL=30;
var grid=[];
var shapes=[];
var currentPiece;
var dropCounter=0;
var baseDropInterval=30;
var score=0;
var gameOver=false;
function createGrid(){
  var g=[];
  for(var r=0;r<ROWS;r++){
    var row=[];
    for(var c=0;c<COLS;c++){
      row.push(0);
    }
    g.push(row);
  }
  return g;
}
function cloneMatrix(m){
  var nm=[];
  for(var i=0;i<4;i++){
    var row=[];
    for(var j=0;j<4;j++){
      row.push(m[i][j]);
    }
    nm.push(row);
  }
  return nm;
}
function rotateMatrix(m){
  var nm=[];
  for(var i=0;i<4;i++){
    var row=[];
    for(var j=0;j<4;j++){
      row.push(0);
    }
    nm.push(row);
  }
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      nm[j][3-i]=m[i][j];
    }
  }
  return nm;
}
function collide(matrix,x,y){
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(matrix[i][j]){
        var gx=x+j;
        var gy=y+i;
        if(gx<0||gx>=COLS||gy>=ROWS){
          return true;
        }
        if(gy>=0){
          if(grid[gy][gx]!==0){
            return true;
          }
        }
      }
    }
  }
  return false;
}
function lockPiece(){
  var m=currentPiece.matrix;
  for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
      if(m[i][j]){
        var gx=currentPiece.x+j;
        var gy=currentPiece.y+i;
        if(gy>=0&&gy<ROWS&&gx>=0&&gx<COLS){
          grid[gy][gx]=currentPiece.colorIndex;
        }
      }
    }
  }
  clearLines();
}
function clearLines(){
  for(var r=ROWS-1;r>=0;r--){
    var full=true;
    for(var c=0;c<COLS;c++){
      if(grid[r][c]===0){
        full=false;
        break;
      }
    }
    if(full){
      grid.splice(r,1);
      var newRow=[];
      for(var k=0;k<COLS;k++){
        newRow.push(0);
      }
      grid.unshift(newRow);
      score+=100;
      r++;
    }
  }
}
function spawnPiece(){
  var idx=floor(random(0,shapes.length));
  var matrix=cloneMatrix(shapes[idx]);
  var startX=floor(COLS/2)-2;
  var piece={matrix:matrix,x:startX,y:0,colorIndex:idx+1};
  currentPiece=piece;
  if(collide(currentPiece.matrix,currentPiece.x,currentPiece.y)){
    gameOver=true;
  }
}
function movePiece(dx){
  if(!currentPiece){return;}
  var nx=currentPiece.x+dx;
  if(!collide(currentPiece.matrix,nx,currentPiece.y)){
    currentPiece.x=nx;
  }
}
function rotatePiece(){
  if(!currentPiece){return;}
  var rm=rotateMatrix(currentPiece.matrix);
  if(!collide(rm,currentPiece.x,currentPiece.y)){
    currentPiece.matrix=rm;
  }
}
function setupShapes(){
  shapes=[
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,0,0],
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0]
    ]
  ];
}
var colorsArr=[];
function setup(){
  createCanvas(300,600);
  setupShapes();
  grid=createGrid();
  colorsArr=[color(0,255,255),color(255,255,0),color(128,0,128),color(255,165,0),color(0,0,255),color(0,255,0),color(255,0,0)];
  spawnPiece();
  textAlign(CENTER,CENTER);
  textSize(18);
}
function draw(){
  background(30);
  stroke(50);
  for(var r=0;r<ROWS;r++){
    for(var c=0;c<COLS;c++){
      var val=grid[r][c];
      if(val!==0){
        fill(colorsArr[val-1]);
      } else {
        fill(40);
      }
      rect(c*CELL,r*CELL,CELL,CELL);
    }
  }
  if(currentPiece){
    for(var i=0;i<4;i++){
      for(var j=0;j<4;j++){
        if(currentPiece.matrix[i][j]){
          var gx=(currentPiece.x+j)*CELL;
          var gy=(currentPiece.y+i)*CELL;
          if(gy>=0){
            fill(colorsArr[currentPiece.colorIndex-1]);
            rect(gx,gy,CELL,CELL);
          }
        }
      }
    }
  }
  fill(255);
  noStroke();
  text("Score: "+score, width/2, 12);
  if(gameOver){
    fill(0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(36);
    text("GAME OVER",width/2,height/2);
    return;
  }
  var interval=baseDropInterval;
  if(keyIsDown(DOWN_ARROW)){
    interval=2;
  }
  dropCounter++;
  if(dropCounter>=interval){
    dropCounter=0;
    if(currentPiece){
      currentPiece.y++;
      if(collide(currentPiece.matrix,currentPiece.x,currentPiece.y)){
        currentPiece.y--;
        lockPiece();
        spawnPiece();
      }
    }
  }
}
function keyPressed(){
  if(gameOver){
    return;
  }
  if(keyCode===LEFT_ARROW){
    movePiece(-1);
  } else if(keyCode===RIGHT_ARROW){
    movePiece(1);
  } else if(keyCode===UP_ARROW){
    rotatePiece();
  } else if(keyCode===DOWN_ARROW){
    if(currentPiece){
      currentPiece.y++;
      if(collide(currentPiece.matrix,currentPiece.x,currentPiece.y)){
        currentPiece.y--;
        lockPiece();
        spawnPiece();
      }
      dropCounter=0;
    }
  }
}
