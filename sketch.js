let player,platforms,groundHeight,groundY,coins,score,gameOver,retryButton,gravity,jumpVel,maxFallSpeed,playerSpeed,wasOnPlatformLast,allowJump,fellFromPlatform;
function setup(){
 createCanvas(600,400);
 gravity=0.8;
 jumpVel=-12;
 maxFallSpeed=12;
 playerSpeed=3.5;
 groundHeight=40;
 groundY=height-groundHeight;
 textFont("sans-serif");
 initGame();
}
function initGame(){
 player={x:50,y:0,w:30,h:30,vx:0,vy:0,onGround:false,onPlatform:false,prevY:0};
 platforms=[];
 coins=[];
 score=0;
 gameOver=false;
 wasOnPlatformLast=false;
 allowJump=true;
 fellFromPlatform=false;
 platforms.push({x:0,y:groundY,w:width,h:groundHeight,isGround:true});
 for(let i=0;i<5;i++){
  let pw=80+Math.floor(random(0,80));
  let px=Math.floor(random(0,width-pw));
  let py=Math.floor(random(80,groundY-120));
  platforms.push({x:px,y:py,w:pw,h:10,isGround:false});
 }
 if(platforms.length>1){
  platforms[1].y=groundY-60;
  if(platforms[1].x+platforms[1].w>width) platforms[1].x=width-platforms[1].w-10;
 }
 for(let i=1;i<platforms.length;i++){
  let p=platforms[i];
  let cx=p.x+p.w/2;
  let cy=p.y-12;
  coins.push({x:cx,y:cy,r:8});
 }
 for(let i=0;i<3;i++){
  let cx=Math.floor(random(20,width-20));
  let cy=Math.floor(random(60,groundY-140));
  coins.push({x:cx,y:cy,r:8});
 }
 retryButton={x:260,y:230,w:80,h:36};
 player.y=groundY-player.h;
}
function draw(){
 background(10,20,60);
 for(let i=0;i<platforms.length;i++){
  let p=platforms[i];
  if(p.isGround){
   fill(80,50,20);
  } else {
   fill(120);
  }
  rect(p.x,p.y,p.w,p.h);
 }
 fill(255,200,200);
 rect(player.x,player.y,player.w,player.h);
 for(let i=0;i<coins.length;i++){
  let c=coins[i];
  fill(255,215,0);
  ellipse(c.x,c.y,c.r*2,c.r*2);
 }
 fill(255);
 textSize(18);
 textAlign(LEFT,TOP);
 text("Score: "+score,8,8);
 if(!gameOver){
  player.prevY=player.y;
  player.vx=0;
  if(keyIsDown(LEFT_ARROW)) player.vx=-playerSpeed;
  if(keyIsDown(RIGHT_ARROW)) player.vx=playerSpeed;
  player.x+=player.vx;
  if(player.x<0) player.x=0;
  if(player.x>width-player.w) player.x=width-player.w;
  player.vy+=gravity;
  if(player.vy>maxFallSpeed) player.vy=maxFallSpeed;
  player.y+=player.vy;
  player.onGround=false;
  player.onPlatform=false;
  for(let i=0;i<platforms.length;i++){
   let p=platforms[i];
   if(player.vy>=0){
    if(player.x+player.w>p.x && player.x<p.x+p.w){
     if(player.prevY+player.h<=p.y && player.y+player.h>=p.y){
      player.y=p.y-player.h;
      player.vy=0;
      if(p.isGround){
       player.onGround=true;
      } else {
       player.onPlatform=true;
      }
     }
    }
   }
  }
  if(wasOnPlatformLast && !player.onPlatform && !player.onGround){
   fellFromPlatform=true;
  }
  if(player.onPlatform){
   fellFromPlatform=false;
   allowJump=true;
  }
  if(player.onGround){
   if(fellFromPlatform){
    gameOver=true;
   }
   allowJump=true;
   fellFromPlatform=false;
  }
  if(!player.onGround && !player.onPlatform){
   allowJump=false;
  }
  for(let i=coins.length-1;i>=0;i--){
   let c=coins[i];
   let dx=(player.x+player.w/2)-c.x;
   let dy=(player.y+player.h/2)-c.y;
   let dist=Math.sqrt(dx*dx+dy*dy);
   if(dist< c.r + Math.max(player.w,player.h)/2){
    score+=10;
    coins.splice(i,1);
   }
  }
  wasOnPlatformLast=player.onPlatform;
 } else {
  textSize(36);
  textAlign(CENTER,CENTER);
  fill(255,0,0);
  text("GAME OVER",width/2,150);
  fill(200);
  rect(retryButton.x,retryButton.y,retryButton.w,retryButton.h,6);
  fill(0);
  textSize(16);
  textAlign(CENTER,CENTER);
  text("Retry",retryButton.x+retryButton.w/2,retryButton.y+retryButton.h/2);
 }
}
function keyPressed(){
 if(!gameOver){
  if((keyCode===32) && allowJump){
   player.vy=jumpVel;
   allowJump=false;
   player.onGround=false;
   player.onPlatform=false;
   fellFromPlatform=true;
  }
 } else {
  if(keyCode===82){
   initGame();
  }
 }
}
function mousePressed(){
 if(gameOver){
  if(mouseX>=retryButton.x && mouseX<=retryButton.x+retryButton.w && mouseY>=retryButton.y && mouseY<=retryButton.y+retryButton.h){
   initGame();
  }
 }
}
