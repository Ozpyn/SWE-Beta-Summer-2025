let gameBtns = [];

class Game {
    setup() { createReturnButton(); }
    draw() { }
    mousePressed() { }
}

function createReturnButton() {
    rtnBtn = createButton('Return');
    rtnBtn.position(10, 10);
    rtnBtn.style('font-family', 'Concert One');
    rtnBtn.mousePressed(() => {
        engine = null;
        showMenuButtons();
        gameBtns.push(rtnBtn);
        for (let btn of gameBtns) {
            btn.hide();
        }
    });
}