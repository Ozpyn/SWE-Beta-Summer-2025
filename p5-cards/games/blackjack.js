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

        // Show and position buttons on game start
        hitButton.show();
        hitButton.position(width / 3, height * (5 / 16));

        standButton.show();
        standButton.position(width * 4 / 9, height * (5 / 16));

        playAgainButton.hide();
        playAgainButton.position(width / 2 - 50, height * 12 / 16);

        // Create deck and hands
        blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false, facesVisible: true });
        blackjackDeck.shuffle();

        blackjackPlayerHand = new Hand("Player");
        blackjackDealerHand = new Hand("Dealer");

        allDecks = [blackjackDeck];
        allHands = [blackjackPlayerHand, blackjackDealerHand];

        // Deal cards
        for (let i = 0; i < 2; i++) {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            let dealerCard = blackjackDeck.drawCard();
            if (i === 0) dealerCard.faceUp = false;
            blackjackDealerHand.addCard(dealerCard);
        }

        blackjackGameState = 'playerTurn';

        // Instant blackjack after game start
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
        fill(255);
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

    createButtons() {
        if (!hitButton) {
            hitButton = createButton('+ Hit');
            hitButton.position(width / 3 - 100, height * (5 / 8));
            hitButton.style('background-color', '#28a745');
            hitButton.style('color', 'white');
            hitButton.style('border', 'none');
            hitButton.style('border-radius', '10px');
            hitButton.style('padding', '12px 24px');
            hitButton.style('font-size', '18px');
            hitButton.style('font-family', 'Concert One');
            hitButton.style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)');
            hitButton.style('cursor', 'pointer');
            //             hitButton = createButton('Hit');

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
            gameBtns.push(hitButton);
        }

        if (!standButton) {
            // standButton = createButton('Stand');
            standButton = createButton('✋ Stand');
            standButton.position(width * 2 / 3, height * (5 / 8));
            standButton.style('background-color', '#28a745');
            standButton.style('color', 'white');
            standButton.style('border', 'none');
            standButton.style('border-radius', '10px');
            standButton.style('padding', '12px 24px');
            standButton.style('font-size', '18px');
            standButton.style('font-family', 'Concert One');
            standButton.style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)');
            standButton.style('cursor', 'pointer');
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
            playAgainButton.position(width * 2 / 3, height * (5 / 8));
            playAgainButton.style('background-color', '#28a745');
            playAgainButton.style('color', 'white');
            playAgainButton.style('border', 'none');
            playAgainButton.style('border-radius', '10px');
            playAgainButton.style('padding', '12px 24px');
            playAgainButton.style('font-size', '18px');
            playAgainButton.style('font-family', 'Concert One');
            playAgainButton.style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)');
            playAgainButton.style('cursor', 'pointer');
            playAgainButton.style('font-family', 'Concert One');
            playAgainButton.mousePressed(() => {
                rtnBtn.remove();
                this.setup(); // restart the game
            });
            gameBtns.push(playAgainButton);
        }
    }
}

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

