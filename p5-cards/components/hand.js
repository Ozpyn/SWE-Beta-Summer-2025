class Hand {
  constructor(name = 'Unnamed') {
    this.name = name;
    this.cards = [];
    this.x = 0;
    this.y = 0;
    this.maxWidth = 300; // Maximum horizontal width the hand should occupy
    this.cardWidth = defaultCardWidth;
    this.cardHeight = defaultCardHeight;
  }

  draw(x, y) {
    push();
    this.x = x;
    this.y = y;
    const cards = this.getCards();
    const count = cards.length;

    let spacing = this.cardWidth;
    if (count > 1) {
      spacing = Math.min(this.cardWidth, (this.maxWidth - this.cardWidth) / (count - 1));
    }

    const handWidth = count > 1
      ? spacing * (count - 1) + this.cardWidth
      : this.cardWidth;

    const startX = x + (this.maxWidth - handWidth) / 2;

    stroke(180);
    noFill();
    rect(x, y, this.maxWidth, this.cardHeight, 10);

    push();
    fill(120);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text(`( ${this.name} hand )`, x + this.maxWidth / 2, y + this.cardHeight / 2);
    pop();

    for (let i = 0; i < count; i++) {
      const card = cards[i];
      card.x = startX + i * spacing;
      card.y = y;
      card.draw();
    }
    pop();
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

  reveal() {
    this.cards.forEach(tCard => {
      tCard.faceUp = true;
    });
  }

  isMouseOver(mx, my) {
    return (
      mx >= this.x && mx <= this.x + this.maxWidth &&
      my >= this.y && my <= this.y + this.cardHeight
    );
  }

}
