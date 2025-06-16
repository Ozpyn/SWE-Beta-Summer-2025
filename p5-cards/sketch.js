let gameOptions = ["Blackjack"];
let gameSelect;
let startButton;
let engine = null;
let selectedGame = null;
let cardImages = {};
let drawnCards = [];

class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 140;
    this.faceUp = true;
  }

  loadImages() {
    // Load suit image
    if (!cardImages[this.suit]) {
      cardImages[this.suit] = loadImage(`assets/suits/${this.suit}.svg`);
    }
    
    // Load rank image if it's a face card
    if (['jack', 'queen', 'king'].includes(this.rank.toLowerCase())) {
      if (!cardImages[this.rank]) {
        cardImages[this.rank] = loadImage(`assets/rank/${this.rank}.svg`);
      }
    }
  }

  draw() {
    if (!this.faceUp) {
      // Draw card back
      fill(255);
      rect(this.x, this.y, this.width, this.height, 10);
      fill(0, 0, 200);
      rect(this.x + 5, this.y + 5, this.width - 10, this.height - 10, 5);
      return;
    }

    // Draw card face
    fill(255);
    rect(this.x, this.y, this.width, this.height, 10);
    
    // Draw suit in top-left and bottom-right
    if (cardImages[this.suit]) {
      image(cardImages[this.suit], this.x + 10, this.y + 10, 20, 20);
      image(cardImages[this.suit], this.x + this.width - 30, this.y + this.height - 30, 20, 20);
    }

    // Draw rank
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(this.rank.charAt(0).toUpperCase() + this.rank.slice(1), this.x + 10, this.y + 35);

    // Draw face card image if applicable
    if (['jack', 'queen', 'king'].includes(this.rank.toLowerCase()) && cardImages[this.rank]) {
      image(cardImages[this.rank], this.x + this.width/2 - 25, this.y + this.height/2 - 35, 50, 70);
    }
  }
}

function setup() {
  createCanvas(800, 600);

  gameSelect = createSelect();
  gameSelect.position(20, 20);
  gameSelect.option('Choose a game');
  gameSelect.style('font-family', 'Concert One')

  for (let option of gameOptions) {
    gameSelect.option(option);
  }

  // Start button
  startButton = createButton('Start Game');
  startButton.style('font-family', 'Concert One')
  startButton.position(160, 20);
  startButton.mousePressed(startGame);
  
  // Make a default deck
  defaultDeck = new Deck();

  // Draw a Card
  drawCardBtn = createButton('Draw a Card');
  drawCardBtn.style('font-family', 'Concert One')
  drawCardBtn.position(270, 20);
  drawCardBtn.mousePressed(() => drawACard(defaultDeck));

  // Trigger Win
  winBtn = createButton('Simulate Win');
  winBtn.style('font-family', 'Concert One')
  winBtn.position(400, 20);
  winBtn.mousePressed(triggerWin);

  // Trigger Lose
  loseBtn = createButton('Simulate Lose');
  loseBtn.style('font-family', 'Concert One')
  loseBtn.position(400, 50);
  loseBtn.mousePressed(triggerLose);
}

function draw() {
  background(0, 200, 100);
  
  // Draw all cards in the drawnCards array
  for (let i = 0; i < drawnCards.length; i++) {
    let card = drawnCards[i];
    card.x = 50 + (i * 110);
    card.y = 100;
    card.draw();
  }

  // These should always appear on top, so they must always be last to be drawn
  drawWinOverlay();
  drawLoseOverlay();
}

function startGame() {
  selectedGame = gameSelect.value();
  if (selectedGame === 'Choose a game') {
    alert('Please select a game mode.');
    return;
  }

  let gameFile = `games/${selectedGame.toLowerCase()}.json`;

  // Load the game config and initialize engine
  loadJSON(gameFile, config => {
    engine = new GameEngine(config);
    engine.setup();
  }, () => {
    alert(`Could not load config for ${selectedGame}`);
  });
}

function drawACard(selectedDeck) {
  let card = selectedDeck.drawCard();
  if (card) {
    let newCard = new Card(card.rank, card.suit);
    newCard.loadImages();
    drawnCards.push(newCard);
    alert(card.rank + " of " + card.suit);
  }
  return;
}
