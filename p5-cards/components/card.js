class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.width = 60;
    this.height = 90;
  }

  draw(x, y) {
    // fill(255);
    // stroke(0);
    // rect(x, y, this.width, this.height, 5);
    // fill(0);
    // textSize(16);
    // text(`${this.rank} of ${this.suit}`, x + 5, y + 25);
  }

  drawBack(x, y) {
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`BackArt`, x + 5, y + 25);
  }

  drawFront(x, y) {
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`${this.rank} of ${this.suit}`, x + 5, y + 25);
  }

  drawEmpty(x, y) {
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`-empty-`, x + 5, y + 25);
  }
}
