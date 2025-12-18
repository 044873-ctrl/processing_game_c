let puck = {
  x: 200,
  y: 100,
  vx: 2,
  vy: -2,
  size: 20
};

let player = {
  x: 200,
  y: 350,
  vx: 0,
  vy: 0,
  size: 50
};

let ai = {
  x: 200,
  y: 50,
  vx: 0,
  vy: 0,
  size: 50
};

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  ellipse(puck.x, puck.y, puck.size);

  if (keyIsDown(LEFT_ARROW)) {
    player.vx = -5;
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.vx = 5;
  } else {
    player.vx = 0;
  }

  if (keyIsDown(UP_ARROW)) {
    player.vy = -5;
  } else if (keyIsDown(DOWN_ARROW)) {
    player.vy = 5;
  } else {
    player.vy = 0;
  }

  player.x += player.vx;
  player.y += player.vy;

  player.x = constrain(player.x, 0, width);
  player.y = constrain(player.y, 0, height);

  ai.x = constrain(ai.x, 0, width);
  ai.y = constrain(ai.y, 0, height);

  ai.x += (puck.x - ai.x) * 0.05;
  ai.y += (puck.y - ai.y) * 0.05;

  ellipse(player.x, player.y, player.size);
  ellipse(ai.x, ai.y, ai.size);

  puck.x += puck.vx;
  puck.y += puck.vy;

  if (puck.y < 0 || puck.y > height) {
    puck.vy = -puck.vy;
  }

  if (puck.x < 0 || puck.x > width) {
    puck.vx = -puck.vx;
  }

  let d1 = dist(puck.x, puck.y, player.x, player.y);
  if (d1 < puck.size / 2 + player.size / 2) {
    let angle = atan2(player.y - puck.y, player.x - puck.x);
    puck.vx = 5 * cos(angle);
    puck.vy = 5 * sin(angle);
  }

  let d2 = dist(puck.x, puck.y, ai.x, ai.y);
  if (d2 < puck.size / 2 + ai.size / 2) {
    let angle = atan2(ai.y - puck.y, ai.x - puck.x);
    puck.vx = 5 * cos(angle);
    puck.vy = 5 * sin(angle);
  }
}
