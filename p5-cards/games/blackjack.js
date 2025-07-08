let blackjackDeck, blackjackDiscard;
let blackjackPlayerHand, blackjackDealerHand;
let blackjackGameState = 'start';
let resultText = "";
let hitButton, standButton, playAgainButton;

class BlackJack extends Game {
    setup() {
        super.setup();
        this.createButtons();
        resultText = "";

        // Show and position buttons on game start
        hitButton.show();
        hitButton.position(width / 3, height * (5 / 16));

        standButton.show();
        standButton.position(width * 4 / 9, height * (5 / 16));

        playAgainButton.hide();
        playAgainButton.position(width / 2 - 50, height * 12 / 16);

        // Create deck and hands
        blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false, facesVisible: false });
        blackjackDeck.shuffle();

        blackjackDiscard = new Deck({ id: "blackjackDiscard", canBeDrawnFrom: false, facesVisible: true, startEmpty: true });

        blackjackPlayerHand = new Hand("Player");
        blackjackDealerHand = new Hand("Dealer");

        allDecks = [blackjackDeck];
        allHands = [blackjackPlayerHand, blackjackDealerHand];

        this.dealCards();
    }

    dealCards() {
        // Deal cards
        for (let i = 0; i < 2; i++) {
            replenishPile(blackjackDeck, blackjackDiscard);
            blackjackPlayerHand.addCard(blackjackDeck.drawCard().flip());
            replenishPile(blackjackDeck, blackjackDiscard);
            let dealerCard = blackjackDeck.drawCard();
            if (i !== 0) dealerCard.flip();
            blackjackDealerHand.addCard(dealerCard);
        }

        // Instant blackjack after game start
        if (getBlackJackValue(blackjackPlayerHand) === 21) {
            blackjackDealerHand.reveal();
            blackjackGameState = 'gameOver';
            resultText = "Blackjack! You win!";
            this.showPlayAgain();
        } else {
            blackjackGameState = 'playerTurn';
        }
    }

    draw() {
        super.draw();
        push();
        fill(255);
        textSize(24);
        textAlign(CENTER);
        text("Blackjack", width / 2, height / 32);

        textSize(16);
        text("Dealer", width / 3, height * 2 / 32);
        blackjackDealerHand.draw(width / 3, height * 3 / 32);

        text("Player", width / 3, height * 15 / 32);
        blackjackPlayerHand.draw(width / 3, height / 2);

        blackjackDeck.draw(width / 5, height * (2 / 7));
        blackjackDiscard.draw(width * (4 / 5), height * (2 / 7));

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
        blackjackDiscard?.clear();
        blackjackPlayerHand?.clear();
        blackjackDealerHand?.clear();

        blackjackDeck = null;
        blackjackDiscard = null;
        blackjackPlayerHand = null;
        blackjackDealerHand = null;

        resultText = "";
        stopRequested = false;

        hitButton?.remove();
        standButton?.remove();
        playAgainButton?.remove();

        hitButton = null;
        standButton = null;
        playAgainButton = null;
    }

    resized() {
        super.resized();
        if (hitButton) hitButton.position(width / 3, height * (5 / 16));
        if (standButton) standButton.position(width * 4 / 9, height * (5 / 16));
        if (playAgainButton) playAgainButton.position(width / 2 - 50, height * 12 / 16);
    }

    showPlayAgain() {
        console.log("Showing Play Again button");
        hitButton.hide();
        standButton.hide();
        playAgainButton.show();
    }

    hidePlayAgain() {
        console.log("Hiding Play Again button");
        hitButton.show();
        standButton.show();
        playAgainButton.hide();
    }

    createButtons() {
        if (!hitButton) {
            hitButton = createButton('+ Hit');
            hitButton.addClass('button-standard');
            hitButton.addClass('green-modify');
            hitButton.position(width / 3 - 100, height * (5 / 8));
            hitButton.mousePressed(() => {
                if (blackjackGameState === 'playerTurn') {
                    replenishPile(blackjackDeck, blackjackDiscard);
                    blackjackPlayerHand.addCard(blackjackDeck.drawCard().flip());
                    if (getBlackJackValue(blackjackPlayerHand) > 21) {
                        resultText = "Bust! You lose.";
                        blackjackDealerHand.reveal();
                        blackjackGameState = 'gameOver';
                        this.showPlayAgain();
                    }
                }
            });
            gameBtns.push(hitButton);
        }

        if (!standButton) {
            standButton = createButton('✋ Stand');
            standButton.addClass('button-standard');
            standButton.addClass('green-modify');
            standButton.position(width * 2 / 3, height * (5 / 8));
            standButton.mousePressed(() => {
                if (blackjackGameState === 'playerTurn') {
                    blackjackGameState = 'dealerTurn';
                    dealerPlay();
                }
            });
            gameBtns.push(standButton);
        }

        if (!playAgainButton) {
            playAgainButton = createButton('🔄️Play Again');
            playAgainButton.addClass('button-standard');
            playAgainButton.addClass('green-modify');
            playAgainButton.position(width * 2 / 3, height * (5 / 8));
            playAgainButton.mousePressed(() => {
                while (blackjackDealerHand.getCount() > 0) {
                    blackjackDiscard.addCard(blackjackDealerHand.removeCard(blackjackDealerHand.cards[0]));
                }
                while (blackjackPlayerHand.getCount() > 0) {
                    blackjackDiscard.addCard(blackjackPlayerHand.removeCard(blackjackPlayerHand.cards[0]));
                }
                console.log("Hands Cleared")
                // Reset game state
                resultText = "";
                this.hidePlayAgain();
                this.dealCards();
            });
            gameBtns.push(playAgainButton);
        }
    }
}

async function dealerPlay() {
    blackjackDealerHand.reveal();
    await sleep(1000);

    while (getBlackJackValue(blackjackDealerHand) < 17) {
        replenishPile(blackjackDeck, blackjackDiscard);
        blackjackDealerHand.addCard(blackjackDeck.drawCard().flip());
        await sleep(1000);
    }

    const dealerVal = getBlackJackValue(blackjackDealerHand);
    const playerVal = getBlackJackValue(blackjackPlayerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
        resultText = "You win!";
    } else if (dealerVal === playerVal) {
        resultText = "Push (Tie)";
    } else {
        resultText = "Dealer wins.";
    }

    blackjackGameState = 'gameOver';

    // call engine instance’s method safely
    engine?.showPlayAgain?.();
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

