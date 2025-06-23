let gameOptions = ["Blackjack"];
let gameSelect;
let startButton;
let engine = null;
let selectedGame = null;
let draggableCards = [];
let allDecks = [];
let draggingCard = null;
let joker, jack, queen, king;
let heart, club, spade, diamond;


async function setup() {
  createCanvas(800, 600);
  loadImages();

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
  defaultDeck.canBeDrawnFrom = true;
  discard = new Deck(includeJokers = false, facesVisible = true, id = "discard", empty = true);

  allDecks.push(defaultDeck);
  allDecks.push(discard);

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

async function loadImages() {
  try {
    joker = await loadImage('assets/rank/joker.png');
    jack = await loadImage('assets/rank/jack.png');
    queen = await loadImage('assets/rank/queen.png');
    king = await loadImage('assets/rank/king.png');

    club = await loadImage('assets/suits/club.png');
    diamond = await loadImage('assets/suits/diamond.png');
    heart = await loadImage('assets/suits/heart.png');
    spade = await loadImage('assets/suits/spade.png');

    d_club = await loadImage('assets/suits/club_detail.png');
    d_diamond = await loadImage('assets/suits/diamond_detail.png');
    d_heart = await loadImage('assets/suits/heart_detail.png');
    d_spade = await loadImage('assets/suits/spade_detail.png');

  } catch (error) {
    console.error("Image loading error:", error);
  }
}

async function draw() {
  background(0, 200, 100);
  
  discard.draw(50, 100)
  defaultDeck.draw(150, 100)

  // Update dragging card position
  if (draggingCard) {
    draggingCard.updateDrag();
  }

  // Draw all cards (bottom to top)
  for (let card of draggableCards) {
    card.draw();
  }


  // These should always appear on top, so they must always be last to be drawn
  drawWinOverlay();
  drawLoseOverlay();
}

// Card Dragging Helper functions
function mousePressed() {
  if (!showWin && !showLose) {
    // Check if mouse is over any draw-enabled deck
    for (let deck of allDecks) {
      if (deck.canBeDrawnFrom && deck.isMouseOver(mouseX, mouseY)) {
        const card = deck.drawCard();
        if (card !== -1) {
          card.x = mouseX - card.width / 2;
          card.y = mouseY - card.height / 2;
          draggingCard = card;
          draggingCard.startDrag();
          draggableCards.push(draggingCard);
          return;
        }
      }
    }

    // Otherwise check for a dragged card
    for (let i = draggableCards.length - 1; i >= 0; i--) {
      if (draggableCards[i].isMouseOver()) {
        draggingCard = draggableCards[i];
        draggingCard.startDrag();
        draggableCards.push(draggableCards.splice(i, 1)[0]); // bring to front
        break;
      }
    }
  }
}



function mouseReleased() {
  if (draggingCard) {
    for (let deck of allDecks) {
      if (deck.isMouseOver(mouseX, mouseY)) {
        deck.addCard(draggingCard);
        const index = draggableCards.indexOf(draggingCard);
        if (index !== -1) draggableCards.splice(index, 1);
        break;
      }
    }

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
