class Hand {
  constructor(name = 'Unnamed') {
    this.name = name;
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(card) {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
    }
  }

  clear() {
    this.cards = [];
  }

  getCards() {
    return this.cards.slice();
  }

  getCount() {
    return this.cards.length;
  }
}
