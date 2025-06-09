class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  draw(x, y) {
    fill(255);
    stroke(0);
    rect(x, y, 60, 90, 5);
    fill(0);
    textSize(16);
    text(`${this.rank} of ${this.suit}`, x + 5, y + 25);
  }
}
