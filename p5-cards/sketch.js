let gameOptions = ["Blackjack"];
let gameSelect;
let startButton;
let engine = null;
let selectedGame = null;
let cardImages = {};
let drawnCards = [];

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
  // for (let i = 0; i < drawnCards.length; i++) {
  
  // // This might get moved to the deck object, on how to display a face up deck

  let pileSize = drawnCards.length - 1;
    if (drawnCards[pileSize]) {
      let card = drawnCards[pileSize];
      card.draw(50, 100);
    }
  // }

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
    let newCard = new Card(card.suit, card.rank);
    drawnCards.push(newCard);
    alert(card.rank + " of " + card.suit);
  }
  return;
}
