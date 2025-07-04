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
        text("Blackjack", (width) / 2, (height) * (1 / 32));

        textSize(16);
        text("Dealer", width / 3, height * 2 / 32);
        blackjackDealerHand.draw(width / 3, height * 3 / 32);

        text("Player", width / 3, height * (15 / 32));
        blackjackPlayerHand.draw(width / 3, height / 2);
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
    resized() {
        super.resized();
        if (hitButton) {
            hitButton.position(width / 3, height * (5 / 16))
        }
        if (standButton) {
            standButton.position(width * 4 / 9, height * (5 / 16));
        }
    }
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
        console.log("You win!")
    } else if (dealerVal === playerVal) {
        console.log("Push.")
    } else {
        console.log("Dealer wins.")
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
    hitButton.position(width / 3, height * (5 / 16));
    hitButton.style('font-family', 'Concert One');
    hitButton.mousePressed(() => {
        if (blackjackGameState === 'playerTurn') {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            if (getBlackJackValue(blackjackPlayerHand) > 21) {
                console.log("Bust! You lose.");
                blackjackGameState = 'gameOver';
            }
        }
    });

    standButton = createButton('Stand');
    standButton.position(width * 4 / 9, height * (5 / 16));
    standButton.style('font-family', 'Concert One');
    standButton.mousePressed(() => {
        if (blackjackGameState === 'playerTurn') {
            blackjackGameState = 'dealerTurn';
            dealerPlay();
        }
    });
    gameBtns.push(hitButton, standButton)
}