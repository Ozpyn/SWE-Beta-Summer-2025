let blackjackDeck;
let blackjackPlayerHand, blackjackDealerHand;
let blackjackGameState = 'start';
let resultText = "";

// 🔊 Sound variables
let soundCard, soundStart, soundWin, soundLose;

// 📦 Load sounds before game starts
function preload() {
    soundCard = loadSound('sounds/card.mp3');
    soundStart = loadSound('sounds/start.mp3');
    soundWin = loadSound('sounds/win.mp3');
    soundLose = loadSound('sounds/lose.mp3');
}

class BlackJack extends Game {
    // 🎮 Setup game: create hands, shuffle deck, hide dealer card
    setup() {
        super.setup();
        createBlackjackButtons();
        resultText = "";

        blackjackDeck = new Deck({ id: "blackjackDeck", canBeDrawnFrom: false, facesVisible: true });
        blackjackDeck.shuffle();

        blackjackPlayerHand = new Hand("Player");
        blackjackDealerHand = new Hand("Dealer");

        allDecks = [blackjackDeck];
        allHands = [blackjackPlayerHand, blackjackDealerHand];

        for (let i = 0; i < 2; i++) {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            let tempCard = blackjackDeck.drawCard();
            if (i === 0) tempCard.faceUp = false; // hide only 1 card
            blackjackDealerHand.addCard(tempCard);
        }

        blackjackGameState = 'playerTurn';
        soundStart.play(); // 🔊 play start sound
    }

    // 🖼️ Display game on canvas (hands + result)
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

    // 🔁 Restart game when clicked after it's over
    mousePressed() {
        if (blackjackGameState === 'gameOver') {
            this.setup();
        }
    }

    // 🛑 Stop game and clean everything
    stop() {
        super.stop();
        blackjackGameState = 'stopped';

        blackjackDeck?.clear();
        blackjackPlayerHand?.clear();
        blackjackDealerHand?.clear();

        blackjackDeck = null;
        blackjackPlayerHand = null;
        blackjackDealerHand = null;

        stopRequested = false;
    }

    // 📐 Reposition buttons if window resizes
    resized() {
        super.resized();
        if (hitButton) hitButton.position(width / 3, height * (5 / 16));
        if (standButton) standButton.position(width * 4 / 9, height * (5 / 16));
    }
}

// 🧠 Dealer logic: draw until at least 17, then compare scores
async function dealerPlay() {
    blackjackDealerHand.reveal();
    await sleep(1000);

    while (getBlackJackValue(blackjackDealerHand) < 17) {
        blackjackDealerHand.addCard(blackjackDeck.drawCard());
        soundCard.play();
        await sleep(1000);
    }

    const dealerVal = getBlackJackValue(blackjackDealerHand);
    const playerVal = getBlackJackValue(blackjackPlayerHand);

    if (dealerVal > 21 || playerVal > dealerVal) {
        resultText = "You win!";
        soundWin.play();
    } else if (dealerVal === playerVal) {
        resultText = "Push (Tie)";
    } else {
        resultText = "Dealer wins.";
        soundLose.play();
    }

    blackjackGameState = 'gameOver';
}

// 🧮 Score hand with Ace logic
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

// 🎛️ Buttons for player choices
function createBlackjackButtons() {
    hitButton = createButton('Hit');
    hitButton.position(width / 3, height * (5 / 16));
    hitButton.style('font-family', 'Concert One');
    hitButton.mousePressed(() => {
        if (blackjackGameState === 'playerTurn') {
            blackjackPlayerHand.addCard(blackjackDeck.drawCard());
            soundCard.play();
            if (getBlackJackValue(blackjackPlayerHand) > 21) {
                resultText = "Bust! You lose.";
                soundLose.play();
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

    gameBtns.push(hitButton, standButton);
}
