let gameOptions = ["Blackjack", "War"];
let gameSelect;
let startButton;
let engine = null;
let draggableCards = [];
let allDecks = [], allHands = [];
let menuButtons = [];
let draggingCard = null;
let joker, jack, queen, king;
let heart, club, spade, diamond;
let w = 800, h = 600;


async function setup() {
  createCanvas(windowWidth, windowHeight);
  await loadImages();

  gameSelect = createSelect();
  gameSelect.position((width) * (1 / 16), (height) * (1 / 32));
  gameSelect.option('Choose a game');
  gameSelect.style('font-family', 'Concert One')

  for (let option of gameOptions) {
    gameSelect.option(option);
  }

  // Start button
  startButton = createButton('Start Game');
  startButton.style('font-family', 'Concert One')
  startButton.position((width) * (5 / 16), (height) * (1 / 32));
  startButton.mousePressed(startGame);

  // Make a default deck & empty pile
  defaultDeck = new Deck({ id: "Deck", canBeDrawnFrom: true, includeJokers: true });
  discard = new Deck({ id: "Discard", startEmpty: true, canBeDrawnFrom: true, facesVisible: true });

  allDecks.push(defaultDeck);
  allDecks.push(discard);

  testHand = new Hand("test");
  allHands.push(testHand);

  // Draw a Card
  drawCardBtn = createButton('Draw a Card');
  drawCardBtn.style('font-family', 'Concert One')
  drawCardBtn.position((width) * (4 / 8), (height) * (1 / 32));
  drawCardBtn.mousePressed(() => drawACard(defaultDeck));

  // Trigger Win
  winBtn = createButton('Simulate Win');
  winBtn.style('font-family', 'Concert One')
  winBtn.position((width) * (6 / 8), (height) * (1 / 32));
  winBtn.mousePressed(triggerWin);

  // Trigger Lose
  loseBtn = createButton('Simulate Lose');
  loseBtn.style('font-family', 'Concert One')
  loseBtn.position((width) * (6 / 8), (height) * (2 / 32));
  loseBtn.mousePressed(triggerLose);

  menuButtons.push(gameSelect);
  menuButtons.push(startButton);
  menuButtons.push(drawCardBtn);
  menuButtons.push(winBtn);
  menuButtons.push(loseBtn);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Reposition UI elements based on new width/height
  gameSelect.position((width) * (1 / 16), (height) * (1 / 32));
  startButton.position((width) * (5 / 16), (height) * (1 / 32));
  drawCardBtn.position((width) * (4 / 8), (height) * (1 / 32));
  winBtn.position((width) * (6 / 8), (height) * (1 / 32));
  loseBtn.position((width) * (6 / 8), (height) * (2 / 32));
  engine.resized()
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

  if (engine) {
    engine.draw();
  } else {
    discard.draw((width) * (1 / 8), (height) * (1 / 8))
    defaultDeck.draw((width) * (2 / 8), (height) * (1 / 8))
    testHand.draw((width) * (1 / 8), (height) * (5 / 16));
  }

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
  if (engine) {
    engine.mousePressed();
  } else {
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

      // Check if mouse is over a card in a hand
      for (let hand of allHands) {
        const cards = hand.getCards();
        for (let i = cards.length - 1; i >= 0; i--) {
          const card = cards[i];
          if (card.isMouseOver()) {
            hand.removeCard(card);
            card.startDrag();
            draggingCard = card;
            draggableCards.push(card);
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
}

function mouseReleased() {
  if (draggingCard) {
    for (let hand of allHands) {
      if (hand.isMouseOver(mouseX, mouseY)) {
        const handCards = hand.cards;
        let insertIndex = handCards.length;
        for (let i = 0; i < handCards.length; i++) {
          const currentCard = handCards[i];
          if (draggingCard.x < currentCard.x + currentCard.width / 2) {
            insertIndex = i;
            break;
          }
        }
        handCards.splice(insertIndex, 0, draggingCard);
        const i = draggableCards.indexOf(draggingCard);
        if (i !== -1) draggableCards.splice(i, 1);
        draggingCard.stopDrag();
        draggingCard = null;
        return;
      }
    }


    for (let deck of allDecks) {
      if (deck.isMouseOver(mouseX, mouseY)) {
        if (deck.addCard(draggingCard)) {
          const index = draggableCards.indexOf(draggingCard);
          if (index !== -1) draggableCards.splice(index, 1);
          break;
        }
      }
    }

    draggingCard.stopDrag();
    draggingCard = null;
  }
}

function startGame() {
  const gameName = gameSelect.value();
  if (gameName === 'Choose a game') {
    alert('Please select a game mode.');
    return;
  }

  hideMenuButtons();

  switch (gameName) {
    case "Blackjack":
      engine = new BlackJack();
      engine.setup();
      break;
    case "War":
      engine = new War();
      engine.setup();
      break;
    default:
      engine = null;
      showMenuButtons();
      break;
  }
}


function drawACard(selectedDeck) {
  let card = selectedDeck.drawCard();
  if (card && (card != -1)) {
    if (!discard.addCard(card)) {
      selectedDeck.addCard(card);
    }
    // alert(card.rank + " of " + card.suit);
  }
  return;
}

function hideMenuButtons() {
  for (let btn of menuButtons) {
    btn.hide();
  }
}

function showMenuButtons() {
  for (let btn of menuButtons) {
    btn.show();
  }
}





