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
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  

  drawCard() {
    if (!this.cards || this.cards.length === 0) {
      console.log("The Deck appears to be empty!");
      return -1;
    }
  
    const drawnCard = this.cards.pop();
    return drawnCard || -1;
  }

  getTop() {
    if (!this.cards || this.cards.length === 0) {
      console.log("The Deck appears to be empty!");
      return -1;
    }
    const topCard = this.cards[this.cards.length - 1];
    return new Card(topCard.suit, topCard.rank);
  }

  flipDeck() {
    this.faceUp = !this.faceUp;
    this.cards.reverse();
  }
}
