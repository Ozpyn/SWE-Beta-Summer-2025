const suits = ['Heart', 'Diamond', 'Club', 'Spade'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

class Deck {
  constructor({ includeJokers = false, facesVisible = false, id = "", startEmpty = false, canBeDrawnFrom = false, sizeLimit = null } = {}) {
    this.name = id;
    this.cards = [];
    this.faceUp = facesVisible;
    this.sizeLimit = sizeLimit;
    if (!startEmpty) {
      this.#populate(includeJokers);
      this.shuffle();
    }
    this.width = 60;
    this.height = 90;
    this.canBeDrawnFrom = canBeDrawnFrom;
  }

  // # makes the function private
  #populate(includeJokers) {
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
    if (this.faceUp) {
      drawnCard.faceUp = true;
    } else {
      drawnCard.faceUp = false;
    }
    return drawnCard || -1;
  }

  addCard(newCard) {
    if (this.sizeLimit !== null && this.cards.length >= this.sizeLimit) {
      console.log(`Cannot add ${newCard.rank} of ${newCard.suit}: deck has reached its size limit (${this.sizeLimit})`);
      return false;
    }
  
    this.cards.push(newCard);
    console.log(`Added ${newCard.rank} of ${newCard.suit} to the deck / pile`);
    return true;
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
    this.x = x;
    this.y = y;

    let pileSize = this.cards.length - 1
    if (this.cards[pileSize]) {
      let topCard = this.getTop();

      // Shadow to show deck size
      let shadowOffset = pileSize / 10;
      let shadowColor = color(0, 0, 0);
      push();
      fill(shadowColor);
      noStroke();
      rect(x + shadowOffset, y + shadowOffset, topCard.width, topCard.height, 5);
      rect(x + (shadowOffset / 2), y + (shadowOffset / 2), topCard.width, topCard.height, 5);
      pop();
      if (this.faceUp) {
        topCard.drawFront(x, y);
      } else {
        topCard.drawBack(x,y);
      }
    } else {
      // Pile outline (to show where the pile would be)
      push();
      noFill();
      stroke(color('#505C45'));
      strokeWeight(2);
      rect(x + 10, y + 10, 40, 70, 5);
      pop();
    }
  }

  isMouseOver(mx, my) {
    return mx > this.x && mx < this.x + this.width &&
           my > this.y && my < this.y + this.height;
  }

  flipDeck() {
    this.faceUp = !this.faceUp;
    this.cards.reverse();
  }
}
