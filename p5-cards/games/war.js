let warDeck;
let warPlayerPile, warComputerPile, warComputerDiscard, warPlayerDiscard;
let warGameState = 'start';
let warText = "";
let playerCard, computerCard;
let autoPlay = false;
let inWar = false;
let resolvingRound = false;
let warDelay = 1;

let warPlayerHand, warComputerHand;

class War extends Game {
    setup() {
        super.setup();
        createWarButtons();
        warDeck = new Deck({ id: "warDeck" });
        warDeck.shuffle();

        warPlayerPile = new Deck({ id: "PlayerPile", facesVisible: false, startEmpty: true });
        warComputerPile = new Deck({ id: "ComputerPile", facesVisible: false, startEmpty: true });

        warPlayerHand = new Hand("PlayerReveal");
        warComputerHand = new Hand("ComputerReveal");

        warPlayerDiscard = new Deck({ id: "PlayerDiscard", facesVisible: false, startEmpty: true });
        warComputerDiscard = new Deck({ id: "ComputerDiscard", facesVisible: false, startEmpty: true });

        allDecks = [warDeck, warPlayerPile, warComputerPile, warPlayerDiscard, warComputerDiscard];
        allHands = [warPlayerHand, warComputerHand];

        this.split(warDeck, warPlayerPile, warComputerPile);

        warGameState = 'playerTurn';
        warText = "It's your turn to draw a card!";
        console.log("Game setup complete. It's the player's turn.");
        updateWarButtons();
    }

    split(source, target1, target2) {
        while (source.size() > 0) {
            target1.addCard(source.drawCard());
            target2.addCard(source.drawCard());
        }
        target1.shuffle();
        target2.shuffle();
    }

    draw() {
        super.draw();
        push();
        fill(255);
        textSize(defaultCardHeight / 6);
        text("WAR!", (width) / 2, (height) * (1 / 32));

        textSize(defaultCardHeight / 8);
        text("Computer's Hand", (width) * (1 / 4), (height) * (1 / 8));
        warComputerPile.draw((width) * (1 / 8), (height) * (5 / 32));
        warComputerHand.draw((width) * (1 / 4), (height) * (5 / 32));
        warComputerDiscard.draw((width) * (3 / 4), (height) * (5 / 32));

        text("Player's Hand", (width) * (1 / 4), (height) * (3 / 8));
        warPlayerPile.draw((width) * (1 / 8), (height) * (13 / 32));
        warPlayerHand.draw((width) * (1 / 4), (height) * (13 / 32));
        warPlayerDiscard.draw((width) * (3 / 4), (height) * (13 / 32));

        textSize(defaultCardHeight / 8);
        textAlign(CENTER, TOP);
        text(warText, width / 2, height * 7 / 8);
        pop();
    }

    restart() {
        if (warDeck.size() === 0) {
            while (warPlayerDiscard.size() > 0) {
                let tempcard = warPlayerDiscard.drawCard();
                tempcard.faceUp = false;
                warDeck.addCard(tempcard);
            }
            while (warComputerDiscard.size() > 0) {
                let tempcard = warComputerDiscard.drawCard();
                tempcard.faceUp = false;
                warDeck.addCard(tempcard);
            }
            while (warPlayerPile.size() > 0) {
                let tempcard = warPlayerPile.drawCard();
                tempcard.faceUp = false;
                warDeck.addCard(tempcard);
            }
            while (warComputerPile.size() > 0) {
                let tempcard = warComputerPile.drawCard();
                tempcard.faceUp = false;
                warDeck.addCard(tempcard);
            }
            warDeck.shuffle();
        }
        this.split(warDeck, warPlayerPile, warComputerPile);
        warGameState = 'playerTurn';
        warText = "It's your turn to draw a card!";
        autoPlay = false;
        inWar = false;
        resolvingRound = false;
        stopRequested = false;
        updateWarButtons();
    }

    mousePressed() {
        if (warGameState === 'gameOver') {
            this.restart();
        }
    }

    stop() {
        super.stop();
        autoPlay = false;
        inWar = false;
        updateWarButtons();
        warGameState = 'stopped';
        warText = "Game stopped.";

        if (warDeck) warDeck.clear();
        if (warPlayerPile) warPlayerPile.clear();
        if (warComputerPile) warComputerPile.clear();
        if (warPlayerDiscard) warPlayerDiscard.clear();
        if (warComputerDiscard) warComputerDiscard.clear();
        if (warPlayerHand) warPlayerHand.clear();
        if (warComputerHand) warComputerHand.clear();

        // Clear all global references
        warDeck = null;
        warPlayerPile = null;
        warComputerPile = null;
        warPlayerDiscard = null;
        warComputerDiscard = null;
        warPlayerHand = null;
        warComputerHand = null;

        console.log("Game stopped and all variables cleared.");
        stopRequested = false;
    }
    resized() {
        super.resized();
        if (drawButton) {
            drawButton.position((width) * (1 / 4), (height) * (9 / 32));
        }
        if (autoButton) {
            autoButton.position((width) * (2 / 4), (height) * (9 / 32));
        }
    }
}

function createWarButtons() {
    drawButton = createButton('Draw');
    drawButton.addClass('button-standard');
    drawButton.position((width) * (1 / 4), (height) * (9 / 32));
    drawButton.mousePressed(async () => {
        if (warGameState === 'playerTurn' && !resolvingRound && !stopRequested && !autoPlay) {
            warDelay = 300;
            await resolveRound();
        }
    });

    autoButton = createButton('Auto Play');
    autoButton.addClass('button-standard');
    autoButton.position((width) * (2 / 4), (height) * (9 / 32));
    autoButton.mousePressed(async () => {
        warDelay = 0;
        if (!autoPlay && warGameState !== 'gameOver') {
            autoPlay = true;
            await autoPlayStep(); // Kick it off
        }
    });
    gameBtns.push(drawButton, autoButton);
}

function updateWarButtons() {
    const disable = autoPlay || inWar || resolvingRound || stopRequested;
    drawButton.attribute(disable ? 'disabled' : null, disable);
    autoButton.attribute(disable ? 'disabled' : null, disable);
}

async function resolveRound() {
    if (stopRequested) return;
    resolvingRound = true;

    updateWarButtons();

    replenishPile(warPlayerPile, warPlayerDiscard);
    replenishPile(warComputerPile, warComputerDiscard);

    warPlayerHand.addCard(warPlayerPile.drawCard().flip());
    warComputerHand.addCard(warComputerPile.drawCard().flip());

    await sleep(warDelay);



    const playerCard = warPlayerHand.cards[warPlayerHand.cards.length - 1];
    const computerCard = warComputerHand.cards[warComputerHand.cards.length - 1];

    const playerValue = getWarValue(playerCard);
    const computerValue = getWarValue(computerCard);

    if (playerValue > computerValue) {
        warText = "You win the round!";
        await sleep(warDelay);
        collectCards(warPlayerDiscard);
    } else if (playerValue < computerValue) {
        warText = "Computer wins the round!";
        await sleep(warDelay);
        collectCards(warComputerDiscard);
    } else {
        warText = "War!";
        await handleWar();
    }

    if (stopRequested) return;

    await checkForGameOver();
    resolvingRound = false;
}

function collectCards(winnerPile) {
    // Winner gets all cards from both hands in random order
    const collected = [...warPlayerHand.cards, ...warComputerHand.cards];
    for (const card of collected) {
        if (card.facesVisible) {
            card.flip();
        }
        winnerPile.addBack(card);
    }
    warPlayerHand.clear();
    warComputerHand.clear();
}

async function handleWar() {
    inWar = true;
    updateWarButtons();

    let playerTotal = warPlayerPile.size() + warPlayerDiscard.size();
    let computerTotal = warComputerPile.size() + warComputerDiscard.size();

    if (playerTotal < 1) {
        warGameState = 'gameOver';
        warText = "You don't have enough cards to continue the war. Computer wins the game!";
        inWar = false;
        return;
    } else if (computerTotal < 1) {
        warGameState = 'gameOver';
        warText = "Computer doesn't have enough cards to continue the war. You win the game!";
        inWar = false;
        return;
    }

    for (let i = 0; i < 3; i++) {
        replenishPile(warPlayerPile, warPlayerDiscard);
        replenishPile(warComputerPile, warComputerDiscard);

        const playerHasCards = warPlayerPile.size() > 1;
        const computerHasCards = warComputerPile.size() > 1;

        if (!playerHasCards || !computerHasCards) break;

        if (playerHasCards) warPlayerHand.addCard(warPlayerPile.drawCard()); // face-down
        if (computerHasCards) warComputerHand.addCard(warComputerPile.drawCard()); // face-down

        await sleep(warDelay);
    }
    await resolveRound(); // Resolves top face-up card; all cards played so far will be scored
    inWar = false;
}

async function checkForGameOver() {
    if (warPlayerPile.size() === 0 && warPlayerDiscard.size() === 0) {
        warGameState = 'gameOver';
        warText = "Computer wins the game!";
    } else if (warComputerPile.size() === 0 && warComputerDiscard.size() === 0) {
        warGameState = 'gameOver';
        warText = "You win the game!";
    } else {
        warGameState = 'playerTurn';
        if (autoPlay && !inWar) {
            await autoPlayStep();
        }
    }
}

async function autoPlayStep() {
    if (warGameState === 'playerTurn') {
        await resolveRound();
    }
}

function getWarValue(card) {
    const rank = card.rank;
    if (rank === "Joker") return 15;
    if (rank === "Ace") return 14;
    if (rank === "King") return 13;
    if (rank === "Queen") return 12;
    if (rank === "Jack") return 11;
    return parseInt(rank);
}