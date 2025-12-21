let cols = 10
let rows = 20
let cell = 30
let board = []
let shapes = []
let shapeColors = []
let currentShape = null
let currentX = 0
let currentY = 0
let currentMatrix = null
let dropIntervalDefault = 30
let dropCounter = 0
let lockTimer = 0
let lockDelay = 60
let score = 0
let gameOver = false
function createEmptyBoard() {
  let b = []
  for (let r = 0; r < rows; r++) {
    let row = []
    for (let c = 0; c < cols; c++) {
      row.push(0)
    }
    b.push(row)
  }
  return b
}
function cloneMatrix(m) {
  let r = []
  for (let i = 0; i < m.length; i++) {
    let row = []
    for (let j = 0; j < m[i].length; j++) {
      row.push(m[i][j])
    }
    r.push(row)
  }
  return r
}
function rotateMatrix(m) {
  let size = m.length
  let result = []
  for (let i = 0; i < size; i++) {
    let row = []
    for (let j = 0; j < size; j++) {
      row.push(0)
    }
    result.push(row)
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[x][size - 1 - y] = m[y][x]
    }
  }
  return result
}
function canPlace(mat, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (mat[r][c] === 1) {
        let bx = x + c
        let by = y + r
        if (bx < 0 || bx >= cols) {
          return false
        }
        if (by >= rows) {
          return false
        }
        if (by >= 0) {
          if (board[by][bx] === 1) {
            return false
          }
        }
      }
    }
  }
  return true
}
function lockPiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentMatrix[r][c] === 1) {
        let bx = currentX + c
        let by = currentY + r
        if (by >= 0 && by < rows && bx >= 0 && bx < cols) {
          board[by][bx] = 1
        }
      }
    }
  }
  clearLines()
  spawnPiece()
}
function clearLines() {
  let linesCleared = 0
  for (let r = rows - 1; r >= 0; r--) {
    let full = true
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        full = false
        break
      }
    }
    if (full) {
      board.splice(r, 1)
      let newRow = []
      for (let i = 0; i < cols; i++) {
        newRow.push(0)
      }
      board.unshift(newRow)
      linesCleared++
      r++
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100
  }
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * shapes.length)
  currentShape = idx
  currentMatrix = cloneMatrix(shapes[idx])
  currentX = 3
  currentY = -1
  lockTimer = 0
  if (!canPlace(currentMatrix, currentX, currentY)) {
    gameOver = true
  }
}
function initShapes() {
  shapes = []
  shapeColors = []
  shapes.push([
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(0,255,255))
  shapes.push([
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(255,255,0))
  shapes.push([
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(128,0,128))
  shapes.push([
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(255,165,0))
  shapes.push([
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(0,0,255))
  shapes.push([
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(0,255,0))
  shapes.push([
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ])
  shapeColors.push(color(255,0,0))
}
function setup() {
  createCanvas(cols * cell, rows * cell)
  board = createEmptyBoard()
  initShapes()
  spawnPiece()
  textSize(16)
  noStroke()
}
function draw() {
  background(30)
  fill(50)
  rect(0,0,cols*cell,rows*cell)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 1) {
        fill(120)
        rect(c*cell, r*cell, cell-1, cell-1)
      } else {
        fill(40)
        rect(c*cell, r*cell, cell-1, cell-1)
      }
    }
  }
  if (!gameOver) {
    let dropInterval = dropIntervalDefault
    if (keyIsDown(DOWN_ARROW)) {
      dropInterval = 2
    }
    dropCounter++
    if (dropCounter >= dropInterval) {
      if (canPlace(currentMatrix, currentX, currentY + 1)) {
        currentY++
        lockTimer = 0
      } else {
        lockTimer++
        if (lockTimer >= lockDelay) {
          lockPiece()
        }
      }
      dropCounter = 0
    } else {
      if (!canPlace(currentMatrix, currentX, currentY + 1)) {
        lockTimer++
        if (lockTimer >= lockDelay) {
          lockPiece()
          dropCounter = 0
        }
      } else {
        lockTimer = 0
      }
    }
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentMatrix[r][c] === 1) {
        let bx = currentX + c
        let by = currentY + r
        if (by >= 0 && by < rows && bx >= 0 && bx < cols) {
          fill(shapeColors[currentShape])
          rect(bx*cell, by*cell, cell-1, cell-1)
        }
      }
    }
  }
  fill(255)
  text("SCORE: " + score, 8, 20)
  if (gameOver) {
    fill(0,180)
    rect(0, height/2 - 40, width, 80)
    fill(255)
    textSize(32)
    textAlign(CENTER, CENTER)
    text("GAME OVER", width/2, height/2)
    textAlign(LEFT, BASELINE)
    textSize(16)
  }
}
function keyPressed() {
  if (gameOver) {
    return
  }
  if (keyCode === LEFT_ARROW) {
    if (canPlace(currentMatrix, currentX - 1, currentY)) {
      currentX--
      lockTimer = 0
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (canPlace(currentMatrix, currentX + 1, currentY)) {
      currentX++
      lockTimer = 0
    }
  } else if (keyCode === DOWN_ARROW) {
    if (canPlace(currentMatrix, currentX, currentY + 1)) {
      currentY++
      lockTimer = 0
      dropCounter = 0
    }
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(currentMatrix)
    if (canPlace(rotated, currentX, currentY)) {
      currentMatrix = rotated
      lockTimer = 0
    }
  }
}
