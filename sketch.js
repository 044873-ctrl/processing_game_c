let player = {x:200,y:560,r:16,speed:5};
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let shotCooldown = 10;
let shotTimer = 0;
function setup(){
  createCanvas(400,600);
  frameRate(60);
  for(let i=0;i<30;i++){
    let s = {x:random(0,width),y:random(0,height),r:random(1,3),speed:random(0.5,2)};
    stars.push(s);
  }
  textSize(16);
  noStroke();
  fill(255);
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(200);
    ellipse(s.x,s.y,s.r,s.r);
    s.y += s.speed;
    if(s.y>height+5){
      s.y = -5;
      s.x = random(0,width);
      s.r = random(1,3);
      s.speed = random(0.5,2);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    player.x = constrain(player.x,player.r,width-player.r);
    if(shotTimer>0){
      shotTimer--;
    }
    if(keyIsDown(32) && shotTimer<=0){
      let b = {x:player.x,y:player.y- player.r -4,r:4,vy:-8};
      bullets.push(b);
      shotTimer = shotCooldown;
    }
    if(frameCount % 60 === 0){
      let ex = random(12,width-12);
      let e = {x:ex,y:-12,r:12,vy:2};
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      fill(255,255,0);
      ellipse(b.x,b.y,b.r*2,b.r*2);
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      fill(255,0,0);
      ellipse(e.x,e.y,e.r*2,e.r*2);
      if(dist(e.x,e.y,player.x,player.y) <= e.r + player.r){
        gameOver = true;
      }
      if(e.y > height + e.r){
        enemies.splice(i,1);
        continue;
      }
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        if(dist(e.x,e.y,b.x,b.y) <= e.r + b.r){
          for(let k=0;k<5;k++){
            let angle = random(0,TWO_PI);
            let speed = random(1,3);
            let p = {x:e.x,y:e.y,r:3,life:20, vx:cos(angle)*speed, vy:sin(angle)*speed};
            particles.push(p);
          }
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      let alpha = map(p.life,0,20,0,255);
      fill(255,150,0,alpha);
      ellipse(p.x,p.y,p.r*2,p.r*2);
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  } else {
    for(let i=bullets.length-1;i>=0;i--){
      bullets.splice(i,1);
    }
    for(let i=enemies.length-1;i>=0;i--){
      enemies.splice(i,1);
    }
    for(let i=particles.length-1;i>=0;i--){
      particles.splice(i,1);
    }
    fill(255,0,0);
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
    textSize(16);
    textAlign(LEFT,TOP);
  }
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("SCORE: " + score,10,10);
  fill(0,0,255);
  triangle(player.x,player.y-player.r,player.x-player.r,player.y+player.r,player.x+player.r,player.y+player.r);
}
function keyPressed(){
  if(keyCode===32 && !gameOver && shotTimer<=0){
    let b = {x:player.x,y:player.y- player.r -4,r:4,vy:-8};
    bullets.push(b);
    shotTimer = shotCooldown;
  }
}
