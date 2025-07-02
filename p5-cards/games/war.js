let warDeck;
let warPlayerPile, warComputerPile;
let warGameState = 'start';
let resultText = "";
let playerCard, computerCard;
let autoPlay = false;
let inWar = false;

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

        allDecks = [warDeck, warPlayerPile, warComputerPile];
        allHands = [warPlayerHand, warComputerHand];

        // Deal half of the deck to each player
        while (warDeck.size() > 0) {
            warPlayerPile.addCard(warDeck.drawCard());
            warComputerPile.addCard(warDeck.drawCard());
        }

        warGameState = 'playerTurn';
        resultText = "It's your turn to draw a card!";
        console.log("Game setup complete. It's the player's turn.");
    }

    draw() {
        push();
        fill(255);
        textSize(24);
        text("WAR!", width / 2 - 60, 40);

        textSize(16);
        text("Computer's Hand", 100, 60);
        warComputerPile.draw(100, 80);
        warComputerHand.draw(200, 80);

        text("Player's Hand", 100, 260);
        warPlayerPile.draw(100, 280);
        warPlayerHand.draw(200, 280);

        textSize(18);
        text(resultText, width / 2 - 100, height - 40);

        pop();
    }

    mousePressed() {
        if (warGameState === 'gameOver') {
            this.setup();
        }
    }
}

function createWarButtons() {
    drawButton = createButton('Draw');
    drawButton.position(150, 200);
    drawButton.style('font-family', 'Concert One');
    drawButton.mousePressed(() => {
        if (warGameState === 'playerTurn') {
            // Both players draw a card and reveal it
            warPlayerHand.addCard(warPlayerPile.drawCard().flip());
            warComputerHand.addCard(warComputerPile.drawCard().flip());
            resolveRound();
        }
    });

    const autoButton = createButton('Auto Play');
    autoButton.position(230, 200);
    autoButton.style('font-family', 'Concert One');
    autoButton.mousePressed(() => {
        if (!autoPlay && warGameState !== 'gameOver') {
            autoPlay = true;
            autoPlayStep(); // Kick it off
        }
    });
    gameBtns.push(drawButton, autoButton);

}

async function resolveRound() {
    const playerCard = warPlayerHand.cards[warPlayerHand.cards.length - 1];
    const computerCard = warComputerHand.cards[warComputerHand.cards.length - 1];

    const playerValue = getCardValue(playerCard);
    const computerValue = getCardValue(computerCard);

    if (playerValue > computerValue) {
        resultText = "You win the round!";
        collectCards(warPlayerPile);
    } else if (playerValue < computerValue) {
        resultText = "Computer wins the round!";
        collectCards(warComputerPile);
    } else {
        resultText = "War!";
        await handleWar();
    }

    // Clean up hands after short delay
    await sleep(500);
    warPlayerHand.clear();
    warComputerHand.clear();

    checkForGameOver();
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
}

async function handleWar() {
    inWar = true;
    for (let i = 0; i < 3; i++) {
        await sleep(500)
        if (warPlayerPile.size() > 0) warPlayerHand.addCard(warPlayerPile.drawCard()); // face-down
        if (warComputerPile.size() > 0) warComputerHand.addCard(warComputerPile.drawCard()); // face-down
    }

    if (warPlayerPile.size() > 0) {
        warPlayerHand.addCard(warPlayerPile.drawCard().flip()); // face-up
    }
    if (warComputerPile.size() > 0) {
        warComputerHand.addCard(warComputerPile.drawCard().flip()); // face-up
    }

    await sleep(500);
    resolveRound(); // Recursively resolve the next top card
    await sleep(500);
    inWar = false;
}

function checkForGameOver() {
    if (warPlayerPile.size() === 0) {
        warGameState = 'gameOver';
        resultText = "Computer wins the game!";
    } else if (warComputerPile.size() === 0) {
        warGameState = 'gameOver';
        resultText = "You win the game!";
    } else {
        warGameState = 'playerTurn';
        if (autoPlay && !inWar) {
            setTimeout(() => {
                autoPlayStep();
            }, 600);
        }
    }
}

async function autoPlayStep() {
    if (warGameState === 'playerTurn') {
        const playerCard = warPlayerPile.drawCard();
        const computerCard = warComputerPile.drawCard();
        if (playerCard && computerCard) {
            warPlayerHand.addCard(playerCard.flip());
            warComputerHand.addCard(computerCard.flip());
            await resolveRound();
        }
    }
}

function getCardValue(card) {
    const rank = card.rank;
    if (rank === "Joker") return 15;
    if (rank === "Ace") return 14;
    if (rank === "King") return 13;
    if (rank === "Queen") return 12;
    if (rank === "Jack") return 11;
    return parseInt(rank);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
