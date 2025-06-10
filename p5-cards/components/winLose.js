let showWin = false;
let showLose = false;
let returnButton;

function triggerWin() {
  showWin = true;
  showLose = false;
  createReturnButton();
}

function triggerLose() {
  showLose = true;
  showWin = false;
  createReturnButton();
}

function drawWinOverlay() {
  if (showWin) {
    fill(0, 150);
    rect(0, 0, width, height);

    fill("green");
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2 - 40);
  }
}

function drawLoseOverlay() {
  if (showLose) {
    fill(0, 150);
    rect(0, 0, width, height);

    fill("red");
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You Lose!", width / 2, height / 2 - 40);
  }
}

function createReturnButton() {
  if (!returnButton) {
    returnButton = createButton("Return Home");
    returnButton.position(width / 2 - 50, height / 2 + 10);
    returnButton.mousePressed(closeOverlay);
  }
}

function closeOverlay() {
  showWin = false;
  showLose = false;
  if (returnButton) {
    returnButton.remove();
    returnButton = null;
  }
}
