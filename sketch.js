let invaders = [];
let bullets = [];
let player;

function setup() {
  createCanvas(800, 600);
  player = new Player();
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 10; j++) {
      invaders.push(new Invader(j * 80 + 80, i * 60 + 60));
    }
  }
}

function draw() {
  background(0);
  player.show();
  player.move();

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
    for (let j = 0; j < invaders.length; j++) {
      if (bullets[i].hits(invaders[j])) {
        bullets[i].evaporate();
        invaders[j].evaporate();
      }
    }
  }

  for (let i = invaders.length - 1; i >= 0; i--) {
    invaders[i].show();
    invaders[i].move();
    if (invaders[i].toDelete) {
      invaders.splice(i, 1);
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      bullets.splice(i, 1);
    }
  }
}

function keyReleased() {
  player.setDir(0);
}

function keyPressed() {
  if (key === ' ') {
    let bullet = new Bullet(player.x, height);
    bullets.push(bullet);
  }

  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.xdir = 0;
  }

  show() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, height - 20, 20, 60);
  }

  setDir(dir) {
    this.xdir = dir;
  }

  move(dir) {
    this.x += this.xdir * 5;
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.toDelete = false;
  }

  show() {
    fill(50, 0, 200);
    ellipse(this.x, this.y, 4, 4);
  }

  evaporate() {
    this.toDelete = true;
  }

  hits(invader) {
    let d = dist(this.x, this.y, invader.x, invader.y);
    if (d < this.r + invader.r) {
      return true;
    } else {
      return false;
    }
  }

  move() {
    this.y = this.y - 5;
  }
}

class Invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
    this.toDelete = false;
  }

  show() {
    fill(255, 0, 200);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  evaporate() {
    this.toDelete = true;
  }

  move() {
    this.x = this.x + random(-1, 1);
    this.y = this.y + random(-1, 1);
  }
}
