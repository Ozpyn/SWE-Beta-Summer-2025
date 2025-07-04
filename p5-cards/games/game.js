let gameBtns = [];
let stopRequested = false;

class Game {
    setup() { createReturnButton(); }
    draw() { if (stopRequested) return; }
    mousePressed() { }
    stop() { stopRequested = true; }
}

function notify(message) {
    console.log(message);
    alert(message);
}

function createReturnButton() {
    rtnBtn = createButton('Return');
    rtnBtn.position(10, 10);
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