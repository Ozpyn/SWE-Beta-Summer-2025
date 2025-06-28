let blackjackDeck;
let playerHand, dealerHand;
let gameState = 'start';
let resultText = "";

function setupBlackjack() {
    createBlackjackButtons();
    blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false });
    blackjackDeck.shuffle();

    playerHand = new Hand("Player");
    dealerHand = new Hand("Dealer");

    allDecks = [blackjackDeck];
    allHands = [playerHand, dealerHand];

    for (let i = 0; i < 2; i++) {
        playerHand.addCard(blackjackDeck.drawCard());
        dealerHand.addCard(blackjackDeck.drawCard());
    }

    gameState = 'playerTurn';
    resultText = "";
}

function blackjackDraw() {
    push();
    fill(255);
    textSize(24);
    text("Blackjack", width / 2 - 60, 40);

    textSize(16);
    text("Dealer", 100, 60);
    dealerHand.draw(100, 80);

    text("Player", 100, 260);
    playerHand.draw(100, 280);

    if (gameState === 'gameOver') {
        fill(255, 255, 0);
        textSize(28);
        text(resultText, width / 2 - 100, height - 60);
        textSize(16);
        text("Click anywhere to restart", width / 2 - 80, height - 30);
    }
    pop();
}

function blackjackMousePressed() {
    if (gameState === 'gameOver') {
        setupBlackjack();
    }
}

// Dealer automatically plays after player stands
function dealerPlay() {
    while (getHandValue(dealerHand) < 17) {
        dealerHand.addCard(blackjackDeck.drawCard());
    }

    let dealerVal = getHandValue(dealerHand);
    let playerVal = getHandValue(playerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
        resultText = "You win!";
    } else if (dealerVal === playerVal) {
        resultText = "Push.";
    } else {
        resultText = "Dealer wins.";
    }

    gameState = 'gameOver';
}

function getHandValue(hand) {
    let total = 0;
    let aces = 0;

    for (let card of hand.getCards()) {
        const rank = card.rank;
        if (["Jack", "Queen", "King"].includes(rank)) {
            total += 10;
        } else if (rank === "Ace") {
            total += 11;
            aces++;
        } else {
            total += parseInt(rank);
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

// Create and toggle Hit/Stand buttons (call once in setup)
function createBlackjackButtons() {
    hitButton = createButton('Hit');
    hitButton.position(150, 200);
    hitButton.style('font-family', 'Concert One');
    hitButton.mousePressed(() => {
        if (gameState === 'playerTurn') {
            playerHand.addCard(blackjackDeck.drawCard());
            if (getHandValue(playerHand) > 21) {
                resultText = "Bust! You lose.";
                gameState = 'gameOver';
            }
        }
    });

    standButton = createButton('Stand');
    standButton.position(200, 200);
    standButton.style('font-family', 'Concert One');
    standButton.mousePressed(() => {
        if (gameState === 'playerTurn') {
            gameState = 'dealerTurn';
            dealerPlay();
        }
    });
}

function toggleBlackjackButtons(show) {
    // if (show) {
    //     hitButton.show();
    //     standButton.show();
    // } else {
    //     hitButton.hide();
    //     standButton.hide();
    // }
}
