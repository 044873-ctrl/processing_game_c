var paddle;
var ball;
var blocks;
var particles;
var score;
var gameOver;
var rows;
var cols;
var blockW;
var blockH;
var colors;
function setup(){
  createCanvas(400,600);
  rows = 6;
  cols = 7;
  blockW = Math.floor(width/cols);
  blockH = 24;
  colors = [
    color(255,102,102),
    color(255,178,102),
    color(255,255,102),
    color(178,255,102),
    color(102,255,178),
    color(102,178,255)
  ];
  paddle = {
    w:90,
    h:12,
    x:width/2,
    y:height-40
  };
  ball = {
    x:width/2,
    y:height/2,
    r:6,
    vx:4,
    vy:-5
  };
  blocks = [];
  particles = [];
  score = 0;
  gameOver = false;
  createBlocks();
}
function createBlocks(){
  blocks = [];
  for(var r=0;r<rows;r++){
    for(var c=0;c<cols;c++){
      var bx = c*blockW;
      var by = 40 + r*(blockH+6);
      var block = {
        x:bx,
        y:by,
        w:blockW-4,
        h:blockH,
        col:colors[r]
      };
      blocks.push(block);
    }
  }
}
function draw(){
  background(30);
  if(gameOver===false){
    updatePaddle();
    updateBall();
    updateParticles();
    checkBlockCollisions();
    checkPaddleCollision();
  } else {
    updateParticles();
  }
  drawBlocks();
  drawPaddle();
  drawBall();
  drawParticles();
  drawUI();
}
function updatePaddle(){
  var mx = mouseX;
  var half = paddle.w/2;
  var nx = constrain(mx,half,width-half);
  paddle.x = nx;
}
function updateBall(){
  ball.x += ball.vx;
  ball.y += ball.vy;
  if(ball.x - ball.r < 0){
    ball.x = ball.r;
    ball.vx = -ball.vx;
  } else if(ball.x + ball.r > width){
    ball.x = width - ball.r;
    ball.vx = -ball.vx;
  }
  if(ball.y - ball.r < 0){
    ball.y = ball.r;
    ball.vy = -ball.vy;
  }
  if(ball.y - ball.r > height){
    ball.vx = 0;
    ball.vy = 0;
    gameOver = true;
  }
}
function checkPaddleCollision(){
  var rx = paddle.x - paddle.w/2;
  var ry = paddle.y - paddle.h/2;
  var closestX = constrain(ball.x,rx,rx+paddle.w);
  var closestY = constrain(ball.y,ry,ry+paddle.h);
  var dx = ball.x - closestX;
  var dy = ball.y - closestY;
  var dist2 = dx*dx + dy*dy;
  if(dist2 <= ball.r*ball.r && ball.vy > 0){
    var offset = (ball.x - paddle.x) / (paddle.w/2);
    if(offset < -1){ offset = -1; }
    if(offset > 1){ offset = 1; }
    var maxAngle = PI/3;
    var angle = offset * maxAngle;
    var speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
    ball.vx = speed * Math.sin(angle);
    ball.vy = -Math.abs(speed * Math.cos(angle));
    ball.y = ry - ball.r - 0.1;
  }
}
function checkBlockCollisions(){
  var i;
  for(i=blocks.length-1;i>=0;i--){
    var b = blocks[i];
    var closestX = constrain(ball.x,b.x,b.x+b.w);
    var closestY = constrain(ball.y,b.y,b.y+b.h);
    var dx = ball.x - closestX;
    var dy = ball.y - closestY;
    var dist2 = dx*dx + dy*dy;
    if(dist2 <= ball.r*ball.r){
      spawnParticles(closestX,closestY,b.col);
      blocks.splice(i,1);
      score += 10;
      var nx = dx;
      var ny = dy;
      var len = Math.sqrt(nx*nx + ny*ny);
      var newVx;
      var newVy;
      var oldVx = ball.vx;
      var oldVy = ball.vy;
      var oldSpeed = Math.sqrt(oldVx*oldVx + oldVy*oldVy);
      if(len === 0){
        nx = 0;
        ny = -1;
      } else {
        nx = nx/len;
        ny = ny/len;
      }
      var dot = oldVx*nx + oldVy*ny;
      newVx = oldVx - 2*dot*nx;
      newVy = oldVy - 2*dot*ny;
      var newSpeed = Math.sqrt(newVx*newVx + newVy*newVy);
      if(newSpeed === 0){
        newVx = oldVx;
        newVy = -oldVy;
      } else {
        var scale = oldSpeed / newSpeed;
        newVx *= scale;
        newVy *= scale;
      }
      ball.vx = newVx;
      ball.vy = newVy;
      break;
    }
  }
}
function spawnParticles(x,y(col),col){
}
function spawnParticles(x,y,c){
  var j;
  for(j=0;j<3;j++){
    var angle = random(0,PI*2);
    var speed = random(1,3);
    var p = {
      x:x,
      y:y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:15,
      col:c
    };
    particles.push(p);
  }
}
function updateParticles(){
  var k;
  for(k=particles.length-1;k>=0;k--){
    var p = particles[k];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if(p.life <= 0){
      particles.splice(k,1);
    }
  }
}
function drawBlocks(){
  var m;
  for(m=0;m<blocks.length;m++){
    var b = blocks[m];
    fill(b.col);
    noStroke();
    rect(b.x,b.y,b.w,b.h);
  }
}
function drawPaddle(){
  fill(200);
  noStroke();
  rectMode(CENTER);
  rect(paddle.x,paddle.y,paddle.w,paddle.h);
  rectMode(CORNER);
}
function drawBall(){
  fill(255);
  noStroke();
  ellipse(ball.x,ball.y,ball.r*2,ball.r*2);
}
function drawParticles(){
  var n;
  for(n=0;n<particles.length;n++){
    var p = particles[n];
    var alpha = map(p.life,0,15,0,255);
    fill(red(p.col),green(p.col),blue(p.col),alpha);
    noStroke();
    ellipse(p.x,p.y,4,4);
  }
}
function drawUI(){
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("Score: "+score,10,10);
  if(gameOver){
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
    textSize(14);
    text("Refresh to play again",width/2,height/2+40);
  }
}
