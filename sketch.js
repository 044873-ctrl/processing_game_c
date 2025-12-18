let cards = [];
let flippedCards = [];
let matchedCards = [];
let cardWidth = 100;
let cardHeight = 150;
let rows = 4;
let cols = 4;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < rows * cols; i++) {
    cards.push(i);
  }
  cards = shuffle(cards);
}

function draw() {
  background(220);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * cardWidth + 50;
      let y = i * cardHeight + 50;
      let cardNumber = i * cols + j;
      if (!flippedCards.includes(cardNumber) && !matchedCards.includes(cardNumber)) {
        fill(255);
        rect(x, y, cardWidth, cardHeight);
      } else if (flippedCards.includes(cardNumber)) {
        fill(100);
        rect(x, y, cardWidth, cardHeight);
        fill(255);
        text(cards[cardNumber], x + cardWidth / 2, y + cardHeight / 2);
      } else if (matchedCards.includes(cardNumber)) {
        fill(0);
        rect(x, y, cardWidth, cardHeight);
      }
    }
  }
  if (flippedCards.length == 2) {
    if (cards[flippedCards[0]] == cards[flippedCards[1]]) {
      matchedCards.push(flippedCards[0], flippedCards[1]);
    }
    flippedCards = [];
  }
  if (matchedCards.length == cards.length) {
    textSize(32);
    fill(255, 0, 0);
    text('You Win!', width / 2, height / 2);
  }
}

function mousePressed() {
  let mX = Math.floor(mouseX / cardWidth);
  let mY = Math.floor(mouseY / cardHeight);
  let cardNumber = mY * cols + mX;
  if (!flippedCards.includes(cardNumber) && !matchedCards.includes(cardNumber)) {
    flippedCards.push(cardNumber);
    if (flippedCards.length > 2) {
      flippedCards.shift();
    }
  }
}
