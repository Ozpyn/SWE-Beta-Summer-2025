const tests = [];

function addTest(name, testFunction) {
    tests.push({ name, testFunction });
}

function error(errorContent) {
    throw new Error(errorContent);
}

async function runTests() {
    let allPassed = true;
    for (const test of tests) {
        setupTestEnvironment();

        try {
            await test.testFunction();
            console.log(`✔️ ${test.name} passed`);
        } catch (error) {
            console.error(`❌ ${test.name} failed: ${error.message}`);
            allPassed = false;
        }
    }
    if (allPassed) {
        console.log('All tests passed!');
        return allPassed;
    } else {
        console.log('Some tests failed. Check above for details.');
        return allPassed;
    }
}

function setupTestEnvironment() {
    // logic to have the game in a testable state
};


// Example Tests
addTest('Testing Framework Test', async () => {
    let i = 1;
    if (i != 1) {
        error("i does not equal 1")
    }
});

addTest('Make A Card', async () => {
    let testCard = new Card('Clubs', 'King');
    if ((testCard.rank !== 'King') || (testCard.suit !== 'Clubs')) {
        error("Card does not match what it was initialized to.")
    }
});

addTest('Standard Deck has 52 cards', async () => {
    let testDeck = new Deck();
    testDeck.canBeDrawnFrom = true;
    drawnCards = 0;
    let heart = 0, spade = 0, diamond = 0, club = 0, no_suit = 0;

    while (true) {
        let testCard = testDeck.drawCard();
        if ((testCard == -1) || (!testCard)) break;

        switch (testCard.suit) {
            case 'Heart': heart++; break;
            case 'Diamond': diamond++; break;
            case 'Club': club++; break;
            case 'Spade': spade++; break;
            default:
                no_suit++;
                break;
        }
        drawnCards++;
    }
    if (drawnCards !== 52) {
        error(`There are ${drawnCards} cards in the default deck! \n Diamonds: ${diamond}, Hearts: ${heart}, Clubs: ${club}, Spades: ${spade}, and No-Suit: ${no_suit}`);
    }
});

addTest('Deck with Jokers has 54 cards', async () => {
    let testDeck = new Deck({ includeJokers: true });
    testDeck.canBeDrawnFrom = true;
    drawnCards = 0;
    let heart = 0, spade = 0, diamond = 0, club = 0, no_suit = 0;

    while (true) {
        let testCard = testDeck.drawCard();
        if ((testCard == -1) || (!testCard)) break;

        switch (testCard.suit) {
            case 'Heart': heart++; break;
            case 'Diamond': diamond++; break;
            case 'Club': club++; break;
            case 'Spade': spade++; break;
            default:
                no_suit++;
                break;
        }
        drawnCards++;
    }
    if (drawnCards !== 54) {
        error(`There are ${drawnCards} cards in the default deck! \n Diamonds: ${diamond}, Hearts: ${heart}, Clubs: ${club}, Spades: ${spade}, and No-Suit: ${no_suit}`);
    }
});

addTest('Empty Deck is Empty', async () => {
    let testDeck = new Deck({ startEmpty: true });
    testDeck.canBeDrawnFrom = true;
    drawnCards = 0;
    let heart = 0, spade = 0, diamond = 0, club = 0, no_suit = 0;

    while (true) {
        let testCard = testDeck.drawCard();
        if ((testCard == -1) || (!testCard)) break;

        switch (testCard.suit) {
            case 'Heart': heart++; break;
            case 'Diamond': diamond++; break;
            case 'Club': club++; break;
            case 'Spade': spade++; break;
            default:
                no_suit++;
                break;
        }
        drawnCards++;
    }
    if (drawnCards !== 0) {
        error(`There are ${drawnCards} cards in the default deck! \n Diamonds: ${diamond}, Hearts: ${heart}, Clubs: ${club}, Spades: ${spade}, and No-Suit: ${no_suit}`);
    }
});

addTest('BlackJack: 2 Aces and a 9 should equal 21', async () => {
    let testHand = new Hand("Test");
    testHand.addCard(new Card('Heart', 'Ace'));
    testHand.addCard(new Card('Spade', 'Ace'));
    testHand.addCard(new Card('Diamond', '9'));

    let value = getBlackJackValue(testHand);

    if (value !== 21) {
        error(`The hand value is ${value}, however 9 + Ace (11) + Ace (1) should equal 21.`);
    }
});

addTest('Assets: All rank and suit images load', async () => {
    const imagePaths = [
        'assets/rank/joker.png',
        'assets/rank/jack.png',
        'assets/rank/queen.png',
        'assets/rank/king.png',
        'assets/suits/club.png',
        'assets/suits/diamond.png',
        'assets/suits/heart.png',
        'assets/suits/spade.png',
        'assets/suits/club_detail.png',
        'assets/suits/diamond_detail.png',
        'assets/suits/heart_detail.png',
        'assets/suits/spade_detail.png'
    ];
    for (let path of imagePaths) {
        try {
            let img = await loadImage(path);
            if (!img || img.width === 0 || img.height === 0) {
                error(`Image failed to load or is empty: ${path}`);
            }
        } catch (e) {
            error(`Image failed to load: ${path}`);
        }
    }
});

addTest('Assets: BaronNeue font loads', async () => {
    try {
        let font = await loadFont('assets/fonts/baron-neue.regular.otf');
        if (!font) {
            error('BaronNeue font did not load.');
        }
    } catch (e) {
        error('BaronNeue font did not load.');
    }
});