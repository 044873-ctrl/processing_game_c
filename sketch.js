let cols=20
let rows=20
let cellSize=20
let snake=[]
let dir={x:1,y:0}
let nextDir={x:1,y:0}
let food={x:0,y:0}
let score=0
let tick=0
let moveInterval=10
let gameOver=false
function occupies(x,y,arr){
  for(let i=0;i<arr.length;i++){
    if(arr[i].x===x&&arr[i].y===y){
      return true
    }
  }
  return false
}
function placeFood(){
  let attempts=0
  let fx=0
  let fy=0
  do{
    fx=Math.floor(Math.random()*cols)
    fy=Math.floor(Math.random()*rows)
    attempts++
    if(attempts>10000){
      break
    }
  }while(occupies(fx,fy,snake))
  food.x=fx
  food.y=fy
}
function setup(){
  createCanvas(cols*cellSize,rows*cellSize)
  let centerX=Math.floor(cols/2)
  let centerY=Math.floor(rows/2)
  snake=[]
  for(let i=0;i<3;i++){
    snake.push({x:centerX-i,y:centerY})
  }
  dir={x:1,y:0}
  nextDir={x:1,y:0}
  score=0
  tick=0
  gameOver=false
  placeFood()
  textAlign(LEFT,TOP)
  textSize(16)
}
function draw(){
  background(30)
  tick++
  if(!gameOver&&tick%moveInterval===0){
    dir.x=nextDir.x
    dir.y=nextDir.y
    let newX=snake[0].x+dir.x
    let newY=snake[0].y+dir.y
    if(newX<0||newX>=cols||newY<0||newY>=rows){
      gameOver=true
    }else{
      if(occupies(newX,newY,snake)){
        gameOver=true
      }else{
        snake.unshift({x:newX,y:newY})
        if(newX===food.x&&newY===food.y){
          score++
          placeFood()
        }else{
          snake.pop()
        }
      }
    }
  }
  fill(200)
  noStroke()
  for(let i=0;i<snake.length;i++){
    let s=snake[i]
    rect(s.x*cellSize,s.y*cellSize,cellSize,cellSize)
  }
  fill(255,0,0)
  rect(food.x*cellSize,food.y*cellSize,cellSize,cellSize)
  fill(255)
  text("Score: "+score,5,5)
  if(gameOver){
    textAlign(CENTER,CENTER)
    textSize(32)
    fill(255,200,0)
    text("Game Over",width/2,height/2)
    textSize(16)
    fill(255)
    textAlign(LEFT,TOP)
  }
}
function keyPressed(){
  if(gameOver){
    return
  }
  let ndx=dir.x
  let ndy=dir.y
  if(keyCode===LEFT_ARROW){
    ndx=-1
    ndy=0
  }else if(keyCode===RIGHT_ARROW){
    ndx=1
    ndy=0
  }else if(keyCode===UP_ARROW){
    ndx=0
    ndy=-1
  }else if(keyCode===DOWN_ARROW){
    ndx=0
    ndy=1
  }else{
    return
  }
  if(ndx===-dir.x&&ndy===-dir.y){
    return
  }
  nextDir.x=ndx
  nextDir.y=ndy
}
