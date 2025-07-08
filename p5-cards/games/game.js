let gameBtns = [];
let stopRequested = false;

class Game {
    setup() { createReturnButton(); }
    draw() { if (stopRequested) return; }
    mousePressed() { }
    stop() { stopRequested = true; }
    resized() {
        if (rtnBtn) {
            rtnBtn.position(width / 32, height / 32);
        }
    }
}

function createReturnButton() {
    rtnBtn = createButton('⬅️Return');
    rtnBtn.addClass('button-standard');
    rtnBtn.position(width / 32, height / 32);
    rtnBtn.mousePressed(() => {
        engine.stop();
        engine = null;
        showMenuButtons();
        for (let btn of gameBtns) {
            btn.remove();
        }
        rtnBtn.hide();
    });
}

function replenishPile(pile, discard) {
    if (pile.size() <= 1 && discard.size() > 0) {
        discard.shuffle();
        while (discard.size() > 0) {
            pile.addCard(discard.drawCard());
        }
        console.log(`${pile.id} was replenished from discard pile.`);
    }
}