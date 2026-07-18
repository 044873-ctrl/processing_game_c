let canvasW=400,canvasH=600
let paddle={w:90,h:12,x:canvasW/2,y:canvasH-40}
let ball={x:canvasW/2,y:canvasH-60,r:6,vx:4,vy:-5}
let blocks=[]
let rows=6,cols=7
let blockGap=5
let blockH=20
let blockW=(canvasW-(cols+1)*blockGap)/cols
let colors=['#FF6B6B','#FFB86B','#FFD56B','#8BD36F','#6BCBFF','#A678FF']
let particles=[]
let score=0
let gameOver=false
function setup(){createCanvas(canvasW,canvasH);noStroke();textFont('Arial');createBlocks()}
function createBlocks(){blocks=[]
 for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){let x=blockGap+c*(blockW+blockGap)
 let y=40+r*(blockH+blockGap)
 blocks.push({x:x,y:y,w:blockW,h:blockH,color:colors[r]})}}}
function draw(){background(30)
 updatePaddle()
 drawBlocks()
 drawPaddle()
 if(!gameOver){updateBall();checkPaddleCollision();checkBlockCollisions()}
 drawBall()
 updateParticles()
 drawUI()
 if(gameOver){textAlign(CENTER, CENTER);textSize(32);fill(255);text('GAME OVER',width/2,height/2)}}
function updatePaddle(){paddle.x=constrain(mouseX,paddle.w/2,width-paddle.w/2)}
function drawPaddle(){fill(200);rect(paddle.x-paddle.w/2,paddle.y,paddle.w,paddle.h,4)}
function updateBall(){ball.x+=ball.vx;ball.y+=ball.vy
 if(ball.x-ball.r<0){ball.x=ball.r;ball.vx=-ball.vx}
 if(ball.x+ball.r>width){ball.x=width-ball.r;ball.vx=-ball.vx}
 if(ball.y-ball.r<0){ball.y=ball.r;ball.vy=-ball.vy}
 if(ball.y-ball.r>height){gameOver=true;ball.vx=0;ball.vy=0}}
function drawBall(){fill(255);ellipse(ball.x,ball.y,ball.r*2,ball.r*2)}
function checkPaddleCollision(){if(ball.vy>0){let px=paddle.x-paddle.w/2
 let py=paddle.y
 if(ball.x>px && ball.x<px+paddle.w && ball.y+ball.r>py && ball.y-ball.r<py+paddle.h){let offset=(ball.x-paddle.x)/(paddle.w/2)
 offset=constrain(offset,-1,1)
 let maxA=PI/3
 let angle=offset*maxA
 let speed=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy)
 ball.vx=speed*Math.sin(angle)
 ball.vy=-abs(speed*Math.cos(angle))
 ball.y=py-ball.r}}}
function checkBlockCollisions(){for(let i=blocks.length-1;i>=0;i--){let b=blocks[i]
 let closestX=constrain(ball.x,b.x,b.x+b.w)
 let closestY=constrain(ball.y,b.y,b.y+b.h)
 let dx=ball.x-closestX
 let dy=ball.y-closestY
 if(dx*dx+dy*dy<=ball.r*ball.r){if(abs(dx)>abs(dy)){if(dx>0){ball.x=b.x+b.w+ball.r}else{ball.x=b.x-ball.r}
 ball.vx=-ball.vx}else{if(dy>0){ball.y=b.y+b.h+ball.r}else{ball.y=b.y-ball.r}
 ball.vy=-ball.vy}
 let cx=closestX
 let cy=closestY
 for(let p=0;p<3;p++){particles.push({x:cx,y:cy,vx:random(-2,2),vy:random(-3,-0.5),life:15})}
 blocks.splice(i,1)
 score++}}}
function drawBlocks(){for(let i=0;i<blocks.length;i++){let b=blocks[i]
 fill(b.color);rect(b.x,b.y,b.w,b.h,4)}}
function updateParticles(){for(let i=particles.length-1;i>=0;i--){let pt=particles[i]
 pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=0.12;pt.life--
 let alpha=constrain(map(pt.life,0,15,0,255),0,255)
 fill(255,200,50,alpha);ellipse(pt.x,pt.y,4,4)
 if(pt.life<=0){particles.splice(i,1)}}}
function drawUI(){fill(255);textSize(18);textAlign(LEFT,TOP);text('Score: '+score,10,10)}
