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
    this.width = defaultCardWidth;
    this.height = defaultCardHeight;
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
    for (let i = this.size() - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  size() {
    return this.cards.length;
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

  clear() {
    this.cards = [];
  }

  addCard(newCard) {
    if (this.sizeLimit !== null && this.cards.length >= this.sizeLimit) {
      return false;
    }
    this.cards.push(newCard);
    return true;
  }

  addBack(newCard) {
    if (this.sizeLimit !== null && this.cards.length >= this.sizeLimit) {
      return false;
    }
    this.cards.unshift(newCard); // Adds to the beginning of the array
    return true;
  }


  getTop() {
    if (!this.cards || this.cards.length === 0) {
      console.log(`${this.name} appears to be empty!`);
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
      topCard.calculateDimensions();

      // Shadow to show deck size
      let shadowOffset = (pileSize / 10) * (defaultCardWidth / 40);
      let shadowColor = color(0, 0, 0);
      push();
      fill(shadowColor);
      noStroke();
      rect(x + shadowOffset, y + shadowOffset, topCard.width, topCard.height, defaultCornerRadius);
      rect(x + (shadowOffset / 2), y + (shadowOffset / 2), topCard.width, topCard.height, defaultCornerRadius);
      pop();
      if (this.faceUp) {
        topCard.drawFront(x, y);
      } else {
        topCard.drawBack(x, y);
      }
    } else {
      // Pile outline (to show where the pile would be)
      push();
      noFill();
      stroke(color('#505C45'));
      strokeWeight(defaultCardWidth / 40);
      rect(x + defaultCornerIndent, y + defaultCornerIndent, defaultCardWidth - (2 * defaultCornerIndent), defaultCardHeight - (2 * defaultCornerIndent), defaultCornerRadius);
      if (this.sizeLimit) {
        push();
        strokeWeight(0.5);
        textAlign(CENTER, CENTER);
        textSize(10);
        text(`Max: ${this.sizeLimit}`, x + (this.width / 2), y + (this.height / 2));
        pop();
      }
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
