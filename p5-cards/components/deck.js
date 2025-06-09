class Deck {
  constructor(includeJokers = false, facesVisible = false) {
    this.cards = [];
    this.faceUp = facesVisible;
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }

    // Optional Jokers
    if (includeJokers) {
      this.cards.push(new Card('Black', 'Joker'));
      this.cards.push(new Card('Red', 'Joker'));
    }

    this.shuffle();
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  drawCard() {
    return this.cards.pop();
  }

  getTop() {
    // return a copy of the card that is on the top of the pile.
    // Do not remove the card from the pile.
  }

  flipDeck() {
    this.faceUp = !this.faceUp;
    // Should we reverse the order of the deck?
  }
}
