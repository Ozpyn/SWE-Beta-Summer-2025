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
    rtnBtn.position(width / 32, height / 32);
    rtnBtn.style('background-color', '#ffffff');
    rtnBtn.style('color', 'black');
    rtnBtn.style('border', 'none');
    rtnBtn.style('border-radius', '10px');
    rtnBtn.style('padding', '12px 24px');
    rtnBtn.style('font-size', '18px');
    rtnBtn.style('font-family', 'Concert One');
    rtnBtn.style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)');
    rtnBtn.style('cursor', 'pointer');
    rtnBtn.style('font-family', 'Concert One');
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