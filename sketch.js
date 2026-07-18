var bullets=[];
var enemies=[];
var particles=[];
var stars=[];
var player={x:200,y:560,r:12,speed:5};
var score=0;
var gameOver=false;
var prevSpace=false;
function spawnEnemy(){
  var e={x:random(12,width-12),y:-12,r:12,spd:2};
  enemies.push(e);
}
function spawnBullet(){
  var b={x:player.x,y:player.y-player.r,r:4,spd:8};
  bullets.push(b);
}
function spawnParticles(px,py){
  for(var i=0;i<5;i++){
    var angle=random(0,TWO_PI);
    var spd=random(1,3);
    var p={x:px,y:py,vx:cos(angle)*spd,vy:sin(angle)*spd,r:3,life:20};
    particles.push(p);
  }
}
function setup(){
  createCanvas(400,600);
  for(var i=0;i<30;i++){
    var s={x:random(width),y:random(height),spd:random(0.5,2)};
    stars.push(s);
  }
  textAlign(LEFT,TOP);
  textSize(16);
}
function draw(){
  background(0);
  fill(255);
  for(var si=0;si<stars.length;si++){
    var st=stars[si];
    ellipse(st.x,st.y,2,2);
    st.y+=st.spd;
    if(st.y>height){
      st.y=0;
      st.x=random(width);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x-=player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x+=player.speed;
    }
    player.x=constrain(player.x,player.r,width-player.r);
    var spaceDown=keyIsDown(32);
    if(spaceDown && !prevSpace){
      spawnBullet();
    }
    prevSpace=spaceDown;
    if(frameCount%60===0){
      spawnEnemy();
    }
  }
  for(var bi=bullets.length-1;bi>=0;bi--){
    var b=bullets[bi];
    b.y-=b.spd;
    if(b.y<-b.r){
      bullets.splice(bi,1);
    }
  }
  for(var ei=enemies.length-1;ei>=0;ei--){
    var e=enemies[ei];
    e.y+=e.spd;
    if(e.y>height+e.r){
      enemies.splice(ei,1);
      continue;
    }
    if(!gameOver){
      var dpe=dist(e.x,e.y,player.x,player.y);
      if(dpe<e.r+player.r){
        gameOver=true;
      }
    }
    for(var bi2=bullets.length-1;bi2>=0;bi2--){
      var b2=bullets[bi2];
      var db=dist(e.x,e.y,b2.x,b2.y);
      if(db<e.r+b2.r){
        spawnParticles(e.x,e.y);
        score+=1;
        bullets.splice(bi2,1);
        enemies.splice(ei,1);
        break;
      }
    }
  }
  for(var pi=particles.length-1;pi>=0;pi--){
    var p=particles[pi];
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;
    if(p.life<=0){
      particles.splice(pi,1);
    }
  }
  fill(0,255,0);
  ellipse(player.x,player.y,player.r*2,player.r*2);
  fill(255,0,0);
  for(var bdraw=0;bdraw<bullets.length;bdraw++){
    var bd=bullets[bdraw];
    ellipse(bd.x,bd.y,bd.r*2,bd.r*2);
  }
  fill(0,0,255);
  for(var edraw=0;edraw<enemies.length;edraw++){
    var ed=enemies[edraw];
    ellipse(ed.x,ed.y,ed.r*2,ed.r*2);
  }
  for(var pard=0;pard<particles.length;pard++){
    var pr=particles[pard];
    var alpha=map(pr.life,0,20,0,255);
    fill(255,150,0,alpha);
    ellipse(pr.x,pr.y,pr.r*2,pr.r*2);
  }
  fill(255);
  text('Score: '+score,8,8);
  if(gameOver){
    textSize(32);
    textAlign(CENTER,CENTER);
    text('Game Over',width/2,height/2);
  }
}
