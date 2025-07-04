let blackjackDeck;
let blackjackPlayerHand, blackjackDealerHand;
let blackjackGameState = 'start';

class BlackJack extends Game {
    setup() {
        super.setup();
        createBlackjackButtons();
        blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false, facesVisible: true });
        blackjackDeck.shuffle();

        blackjackPlayerHand = new Hand("Player");
        blackjackDealerHand = new Hand("Dealer");

        allDecks = [blackjackDeck];
        allHands = [blackjackPlayerHand, blackjackDealerHand];

        for (let i = 0; i < 2; i++) {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            let tempCard = blackjackDeck.drawCard();
            tempCard.faceUp = false;
            blackjackDealerHand.addCard(tempCard);
        }

        blackjackGameState = 'playerTurn';
        console.log("It is the players turn")
    }
    draw() {
        super.draw();
        push();
        fill(255);
        textSize(24);
        text("Blackjack", width / 2 - 60, 40);

        textSize(16);
        text("Dealer", 100, 60);
        blackjackDealerHand.draw(100, 80);

        text("Player", 100, 260);
        blackjackPlayerHand.draw(100, 280);
        pop();
    }
    mousePressed() {
        if (blackjackGameState === 'gameOver') {
            this.setup();
        }
    }
    stop() {
        super.stop();
        blackjackGameState = 'stopped';

        if (blackjackDeck) blackjackDeck.clear();
        if (blackjackPlayerHand) blackjackPlayerHand.clear();
        if (blackjackDealerHand) blackjackDealerHand.clear();

        blackjackDeck = null;
        blackjackPlayerHand = null;
        blackjackDealerHand = null;

        console.log("Blackjack game stopped and variables cleared.");
        stopRequested = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Dealer automatically plays after player stands
async function dealerPlay() {
    blackjackDealerHand.reveal();
    await sleep(1000)
    while (getBlackJackValue(blackjackDealerHand) < 17) {
        blackjackDealerHand.addCard(blackjackDeck.drawCard());
        await sleep(1000)
    }

    let dealerVal = getBlackJackValue(blackjackDealerHand);
    let playerVal = getBlackJackValue(blackjackPlayerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
        notify("You win! The Dealer had " + dealerVal + " and you had " + playerVal + ".");
    } else if (dealerVal === playerVal) {
        notify("Push. You tied with the dealer with " + dealerVal + ".");
    } else {
        notify("Dealer wins. The Dealer had " + dealerVal + " and you had " + playerVal + ".");
    }

    blackjackGameState = 'gameOver';
}

function getBlackJackValue(hand) {
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
        if (blackjackGameState === 'playerTurn') {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            let tempVal = getBlackJackValue(blackjackPlayerHand);
            if (tempVal > 21) {
                notify("Bust! You lose. Your total was " + tempVal + ".");
                blackjackGameState = 'gameOver';
            }
        }
    });

    standButton = createButton('Stand');
    standButton.position(200, 200);
    standButton.style('font-family', 'Concert One');
    standButton.mousePressed(() => {
        if (blackjackGameState === 'playerTurn') {
            blackjackGameState = 'dealerTurn';
            dealerPlay();
        }
    });
    gameBtns.push(hitButton, standButton)
}