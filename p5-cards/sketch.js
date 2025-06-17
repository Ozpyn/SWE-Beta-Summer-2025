let gameOptions = ["Blackjack"];
let gameSelect;
let startButton;
let engine = null;
let selectedGame = null;
let draggableCards = [];
let draggingCard = null;

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
  
  // Make a default deck & empty pile
  defaultDeck = new Deck(id = "Deck");
  discard = new Deck(includeJokers = false, facesVisible = true, id = "discard", empty = true);

  // Make a card to drag
  draggableCards.push(new Card('Spades', 'Ace', 200, 200));

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
  
  discard.draw(50, 100)
  defaultDeck.draw(150, 100)

  // Update dragging card position
  if (draggingCard) {
    draggingCard.updateDrag();
  }

  // Draw all cards (bottom to top)
  for (let card of draggableCards) {
    card.drawFront();
  }


  // These should always appear on top, so they must always be last to be drawn
  drawWinOverlay();
  drawLoseOverlay();
}

// Card Dragging Helper functions
function mousePressed() {
  for (let i = draggableCards.length - 1; i >= 0; i--) {
    if (draggableCards[i].isMouseOver()) {
      draggingCard = draggableCards[i];
      draggingCard.startDrag();
      draggableCards.push(draggableCards.splice(i, 1)[0]);
      break;
    }
  }
}

function mouseReleased() {
  if (draggingCard) {
    draggingCard.stopDrag();
    draggingCard = null;
  }
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
  if (card && (card != -1)) {
    discard.addCard(card);
    // alert(card.rank + " of " + card.suit);
  }
  return;
}
