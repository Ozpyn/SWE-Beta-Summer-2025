
let blackjackDeck;
let blackjackPlayerHand, blackjackDealerHand;
let blackjackGameState = 'start';
let resultText = "";
let hitButton, standButton, playAgainButton;

class BlackJack extends Game {
    setup() {
        super.setup();
        this.createButtons();
        resultText = "";

        blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false, facesVisible: true });
        blackjackDeck.shuffle();

        blackjackPlayerHand = new Hand("Player");
        blackjackDealerHand = new Hand("Dealer");

        allDecks = [blackjackDeck];
        allHands = [blackjackPlayerHand, blackjackDealerHand];

        for (let i = 0; i < 2; i++) {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());

            let dealerCard = blackjackDeck.drawCard();
            if (i === 0) dealerCard.faceUp = false; // hide only first card
            blackjackDealerHand.addCard(dealerCard);
        }

        blackjackGameState = 'playerTurn';

        if (getBlackJackValue(blackjackPlayerHand) === 21) {
            blackjackDealerHand.reveal();
            blackjackGameState = 'gameOver';
            resultText = "Blackjack! You win!";
            this.showPlayAgain();
        }
    }

    draw() {
        super.draw();
        push();
        fill(300);
        textSize(24);
        textAlign(CENTER);
        text("Blackjack", width / 2, height / 32);

        textSize(16);
        text("Dealer", width / 3, height * 2 / 32);
        blackjackDealerHand.draw(width / 3, height * 3 / 32);

        text("Player", width / 3, height * 15 / 32);
        blackjackPlayerHand.draw(width / 3, height / 2);

        if (blackjackGameState === 'gameOver' && resultText) {
            textSize(20);
            fill(255, 255, 0);
            text(resultText, width / 2, height - 50);
        }
        pop();
    }

    mousePressed() { }

    stop() {
        super.stop();
        blackjackGameState = 'stopped';

        blackjackDeck?.clear();
        blackjackPlayerHand?.clear();
        blackjackDealerHand?.clear();

        blackjackDeck = null;
        blackjackPlayerHand = null;
        blackjackDealerHand = null;

        resultText = "";
        stopRequested = false;

        hitButton?.hide();
        standButton?.hide();
        playAgainButton?.hide();
    }

    resized() {
        super.resized();
        if (hitButton) hitButton.position(width / 3, height * (5 / 16));
        if (standButton) standButton.position(width * 4 / 9, height * (5 / 16));
        if (playAgainButton) playAgainButton.position(width / 2 - 50, height * 12 / 16);
    }

    showPlayAgain() {
        hitButton.hide();
        standButton.hide();
        playAgainButton.show();
    }

    createButtons() {
        if (!hitButton) {
            hitButton = createButton('Hit');
            hitButton.style('font-family', 'Concert One');
            hitButton.mousePressed(() => {
                if (blackjackGameState === 'playerTurn') {
                    blackjackPlayerHand.addCard(blackjackDeck.drawCard());
                    if (getBlackJackValue(blackjackPlayerHand) > 21) {
                        resultText = "Bust! You lose.";
                        blackjackDealerHand.reveal();
                        blackjackGameState = 'gameOver';
                        this.showPlayAgain();
                    }
                }
            });
        }
        hitButton.position(width / 3, height * (5 / 16));
        hitButton.show();

        if (!standButton) {
            standButton = createButton('Stand');
            standButton.style('font-family', 'Concert One');
            standButton.mousePressed(() => {
                if (blackjackGameState === 'playerTurn') {
                    blackjackGameState = 'dealerTurn';
                    dealerPlay();
                }
            });
        }
        standButton.position(width * 4 / 9, height * (5 / 16));
        standButton.show();

        if (!playAgainButton) {
            playAgainButton = createButton('Play Again');
            playAgainButton.style('font-family', 'Concert One');
            playAgainButton.mousePressed(() => {
                this.setup();
                hitButton.show();
                standButton.show();
                playAgainButton.hide();
            });
        }
        playAgainButton.position(width / 2 - 50, height * 12 / 16);
        playAgainButton.hide();

        gameBtns.push(hitButton, standButton, playAgainButton);
    }
}

// Dealer logic: draw until at least 17, then determine winner
async function dealerPlay() {
    blackjackDealerHand.reveal();
    await sleep(1000);

    while (getBlackJackValue(blackjackDealerHand) < 17) {
        blackjackDealerHand.addCard(blackjackDeck.drawCard());
        await sleep(1000);
    }

    const dealerVal = getBlackJackValue(blackjackDealerHand);
    const playerVal = getBlackJackValue(blackjackPlayerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
        resultText = "You win!";
    } else if (dealerVal === playerVal) {
        resultText = "Push.";
    } else {
        resultText = "Dealer wins.";
    }

    blackjackGameState = 'gameOver';
    activeGame.showPlayAgain(); // Show the Play Again button
}

// Calculate hand score (Ace = 11 or 1)
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


