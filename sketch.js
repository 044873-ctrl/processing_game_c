var player;
var bullets;
var enemies;
var particles;
var stars;
var score;
var gameOver;
function setup(){
  createCanvas(400,600);
  player = {x:width/2,y:height-40,r:12};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  for(var i=0;i<30;i++){
    var s = {x:random(0,width),y:random(0,height),speed:random(0.5,2),size:random(1,3)};
    stars.push(s);
  }
  textAlign(LEFT,TOP);
  textSize(16);
  fill(255);
}
function draw(){
  background(0);
  for(var i=0;i<stars.length;i++){
    var s = stars[i];
    s.y += s.speed;
    if(s.y>height){
      s.y = 0;
      s.x = random(0,width);
    }
    noStroke();
    fill(255);
    ellipse(s.x,s.y,s.size,s.size);
  }
  if(!gameOver){
    var playerSpeed = 15/60;
    if(keyIsDown(LEFT_ARROW)){
      player.x -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += playerSpeed;
    }
    player.x = constrain(player.x,player.r,width-player.r);
    if(frameCount%60===0){
      var ex = random(12,width-12);
      var ey = -12;
      var enemySpeed = 200/60;
      enemies.push({x:ex,y:ey,r:12,spd:enemySpeed});
    }
    var bulletSpeed = 20/60;
    for(var i=bullets.length-1;i>=0;i--){
      var b = bullets[i];
      b.y -= bulletSpeed;
      if(b.y < -100){
        bullets.splice(i,1);
      }
    }
    for(var i=enemies.length-1;i>=0;i--){
      var e = enemies[i];
      e.y += e.spd;
      if(e.y > height+50){
        enemies.splice(i,1);
        continue;
      }
      var dpe = dist(player.x,player.y,e.x,e.y);
      if(dpe < player.r + e.r){
        gameOver = true;
      }
      for(var j=bullets.length-1;j>=0;j--){
        var b = bullets[j];
        var db = dist(b.x,b.y,e.x,e.y);
        if(db < b.r + e.r){
          for(var k=0;k<5;k++){
            var angle = random(0,TWO_PI);
            var speed = random(1,3);
            var vx = cos(angle)*speed;
            var vy = sin(angle)*speed;
            particles.push({x:e.x,y:e.y,vx:vx,vy:vy,r:3,life:20});
          }
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    for(var i=particles.length-1;i>=0;i--){
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  }
  noStroke();
  fill(255,0,0);
  for(var i=0;i<enemies.length;i++){
    var e = enemies[i];
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  fill(0,0,255);
  for(var i=0;i<bullets.length;i++){
    var b = bullets[i];
    ellipse(b.x,b.y,6,6);
  }
  fill(255,150,0);
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  fill(0,255,0);
  ellipse(player.x,player.y,player.r*2,player.r*2);
  fill(255);
  text("Score: "+score,8,8);
  if(gameOver){
    textAlign(CENTER,CENTER);
    textSize(32);
    text("GAME OVER",width/2,height/2);
    textSize(16);
    textAlign(LEFT,TOP);
  }
}
function keyPressed(){
  if(!gameOver && (key === ' ' || keyCode === 32)){
    var b = {x:player.x,y:player.y-player.r-5,r:4000};
    bullets.push(b);
  }
}
