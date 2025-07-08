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

        // Deal half of the deck to each player
        while (warDeck.size() > 0) {
            warPlayerPile.addCard(warDeck.drawCard());
            warComputerPile.addCard(warDeck.drawCard());
        }

        warGameState = 'playerTurn';
        warText = "It's your turn to draw a card!";
        console.log("Game setup complete. It's the player's turn.");
    }

    draw() {
        super.draw();
        push();
        fill(255);
        textSize(24);
        text("WAR!", (width) / 2, (height) * (1 / 32));

        textSize(16);
        text("Computer's Hand", (width) * (1 / 4), (height) * (1 / 8));
        warComputerPile.draw((width) * (1 / 8), (height) * (5 / 32));
        warComputerHand.draw((width) * (1 / 4), (height) * (5 / 32));
        warComputerDiscard.draw((width) * (3 / 4), (height) * (5 / 32));

        text("Player's Hand", (width) * (1 / 4), (height) * (3 / 8));
        warPlayerPile.draw((width) * (1 / 8), (height) * (13 / 32));
        warPlayerHand.draw((width) * (1 / 4), (height) * (13 / 32));
        warPlayerDiscard.draw((width) * (3 / 4), (height) * (13 / 32));

        textSize(18);
        text(warText, width / 2 - 100, height - 40);

        pop();
    }

    mousePressed() {
        if (warGameState === 'gameOver') {
            this.setup();
        }
    }

    stop() {
        super.stop();
        autoPlay = false;
        inWar = false;
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
    drawButton.mousePressed(() => {
        if (warGameState === 'playerTurn' && !resolvingRound && !stopRequested && !autoPlay) {
            // Both players draw a card and reveal it
            warDelay = 500;
            resolveRound();
        }
    });

    autoButton = createButton('Auto Play');
    autoButton.addClass('button-standard');
    autoButton.position((width) * (2 / 4), (height) * (9 / 32));
    autoButton.mousePressed(() => {
        warDelay = 0.5;
        if (!autoPlay && warGameState !== 'gameOver') {
            autoPlay = true;
            autoPlayStep(); // Kick it off
        }
    });
    gameBtns.push(drawButton, autoButton);
}

async function resolveRound() {
    replenishPile(warPlayerPile, warPlayerDiscard);
    replenishPile(warComputerPile, warComputerDiscard);

    warPlayerHand.addCard(warPlayerPile.drawCard().flip());
    warComputerHand.addCard(warComputerPile.drawCard().flip());

    if (stopRequested) return;
    resolvingRound = true;

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

    checkForGameOver();
    resolvingRound = false;
}

function replenishPile(pile, discard) {
    if (pile.size() === 0 && discard.size() > 0) {
        discard.shuffle();
        while (discard.size() > 0) {
            pile.addCard(discard.drawCard());
        }
        console.log(`${pile.id} was replenished from discard pile.`);
    }
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
    for (let i = 0; i < 3; i++) {
        await sleep(warDelay / 2);
        replenishPile(warPlayerPile, warPlayerDiscard);
        replenishPile(warComputerPile, warComputerDiscard);
        if (warPlayerPile.size() > 0) warPlayerHand.addCard(warPlayerPile.drawCard()); // face-down
        if (warComputerPile.size() > 0) warComputerHand.addCard(warComputerPile.drawCard()); // face-down
        await sleep(warDelay / 2);
    }
    resolveRound(); // Recursively resolve the next top card
    await sleep(warDelay);
    inWar = false;
}

function checkForGameOver() {
    if (warPlayerPile.size() === 0 && warPlayerDiscard.size() === 0) {
        warGameState = 'gameOver';
        warText = "Computer wins the game!";
    } else if (warComputerPile.size() === 0 && warComputerDiscard.size() === 0) {
        warGameState = 'gameOver';
        warText = "You win the game!";
    } else {
        warGameState = 'playerTurn';
        if (autoPlay && !inWar) {
            setTimeout(() => {
                autoPlayStep();
            }, warDelay * 1.1);
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