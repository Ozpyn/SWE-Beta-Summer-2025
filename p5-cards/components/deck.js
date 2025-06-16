const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

class Deck {
  constructor(includeJokers = false, facesVisible = false, id = "", empty = false) {
    this.name = id;
    this.cards = [];
    this.faceUp = facesVisible;
    if (!empty) {
      this.populate(includeJokers);
    }
    this.shuffle();
  }

  populate(includeJokers) {
    for (let suit of suits) {
      for (let rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
    if (includeJokers) {
      this.cards.push(new Card('Black', 'Joker'));
      this.cards.push(new Card('Red', 'Joker'));
    }
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

  addCard(newCard) {
    this.cards.push(newCard);
    console.log(`Added ${this.rank} of ${this.suit} to the deck / pile`)
  }

  getTop() {
    if (!this.cards || this.cards.length === 0) {
      console.log("The Deck appears to be empty!");
      return -1;
    }
    const topCard = this.cards[this.cards.length - 1];
    return new Card(topCard.suit, topCard.rank);
  }

  draw(x, y) {
    if (this.cards[this.cards.length - 1]) {
      if (this.faceUp) {
        // Put drop-shadow here
        let topCard = this.getTop();
        topCard.draw(x, y);
      } else {
        // Draw the card back art. Use the dimensions of the card as a mask, to cut off excess
      }
    } else {
      // Pile outline (to show where the pile would be)
    }
  }

  flipDeck() {
    this.faceUp = !this.faceUp;
    this.cards.reverse();
  }
}
