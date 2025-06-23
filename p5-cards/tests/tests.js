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
