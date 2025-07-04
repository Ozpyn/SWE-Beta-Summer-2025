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
    rtnBtn = createButton('Return');
    rtnBtn.position(width / 32, height / 32);
    rtnBtn.style('font-family', 'Concert One');
    rtnBtn.mousePressed(() => {
        engine.stop();
        engine = null;
        showMenuButtons();
        gameBtns.push(rtnBtn);
        for (let btn of gameBtns) {
            btn.remove();
        }
    });
}