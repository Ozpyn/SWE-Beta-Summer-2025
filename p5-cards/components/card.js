let cardScale = window.innerWidth / 20; // must not be less than 30 for proper rendering

let defaultCardWidth = 2 * cardScale;
let defaultCardHeight = 3 * cardScale;
let defaultCornerRadius = defaultCardWidth / 8
let defaultCornerIndent = (defaultCardWidth / 20);

class Card {
  constructor(suit, rank, x, y) {
    this.suit = suit;
    this.rank = rank;
    this.x = x;
    this.y = y;
    this.faceUp = false;

    // Dragging support
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    // Image loading
    this.suitImage;
    this.rankImage;
    this.setImages();
    this.calculateDimensions();
  }

  calculateDimensions() {
    let verticalLimit = window.innerHeight / 8
    let horizontalLimit = window.innerWidth / 12;
    if (horizontalLimit * 1.5 < verticalLimit) {
      defaultCardWidth = horizontalLimit;
      defaultCardHeight = horizontalLimit * 1.5;
    } else {
      defaultCardWidth = verticalLimit / 1.5;
      defaultCardHeight = verticalLimit;
    }
    this.width = defaultCardWidth;
    this.height = defaultCardHeight;
    cardScale = defaultCardWidth / 2;
    defaultCornerRadius = defaultCardWidth / 8;
    defaultCornerIndent = (defaultCardWidth / 20);
  }

  async setImages() {
    // Load rank image if it's a face card
    switch (this.rank.toLowerCase()) {
      case 'jack': this.rankImage = jack;
        break;
      case 'joker': this.rankImage = joker;
        break;
      case 'queen': this.rankImage = queen;
        break;
      case 'king': this.rankImage = king;
        break;
      default:
        break;
    }
    if (!(this.rank === 'Joker' || this.rank === 'Ace')) {
      switch (this.suit.toLowerCase()) {
        case 'club': this.suitImage = club;
          break;
        case 'heart': this.suitImage = heart;
          break;
        case 'diamond': this.suitImage = diamond;
          break;
        case 'spade': this.suitImage = spade;
          break;
        default:
          break;
      }
    } else if (this.rank === 'Ace') {
      switch (this.suit.toLowerCase()) {
        case 'club': this.suitImage = d_club;
          break;
        case 'heart': this.suitImage = d_heart;
          break;
        case 'diamond': this.suitImage = d_diamond;
          break;
        case 'spade': this.suitImage = d_spade;
          break;
        default:
          break;
      }
    } else {

    }
  }

  draw(x = this.x, y = this.y) {
    this.calculateDimensions();
    if (this.faceUp) {
      this.drawFront(x, y)
    } else {
      this.drawBack(x, y)
    }
  }

  drawBack(x = this.x, y = this.y) {
    push();
    fill(250, 200, 0);
    stroke(0);
    rect(x, y, this.width, this.height, defaultCornerRadius);
    fill(0);
    textSize(this.width / 4);

    if (spade && heart && diamond && club) {
      imageMode(CENTER);
      tint(0);
      // No rotation - spade
      image(spade, x + this.width / 2, y + this.height / 3, cardScale / 2, cardScale / 2);

      // 180° rotation - heart
      push();
      translate(x + this.width / 2, y + (this.height * 2) / 3);
      rotate(PI); // 180 degrees in radians
      image(heart, 0, 0, cardScale / 2, cardScale / 2);
      pop();

      // 90° rotation left (counter-clockwise) - diamond
      push();
      translate(x + this.width / 3, y + this.height / 2);
      rotate(-HALF_PI); // -90 degrees
      image(diamond, 0, 0, cardScale / 2, (cardScale * 1.2 / 2));
      pop();

      // 90° rotation right (clockwise) - club
      push();
      translate(x + (this.width * 2) / 3, y + this.height / 2);
      rotate(HALF_PI); // 90 degrees
      image(club, 0, 0, cardScale / 2, cardScale * 1.2 / 2);
      pop();
      noTint();
    } else {
      // Fallback filler text
      text(`BackArt`, x + 5, y + 25);
    }

    pop();
  }

  flip() {
    this.faceUp = !this.faceUp;
    return this;
  }

  drawFront(x = this.x, y = this.y) {

    push();
    // Draw card background
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, defaultCornerRadius);
    // Determine suit color
    const suitColor = (this.suit === 'Heart' || this.suit === 'Diamond' || this.suit === 'Red')
      ? color(255, 0, 0)    // red
      : color(0, 0, 0);     // black

    // Draw rank and suit in top left
    fill(suitColor);
    textFont(BaronNeue);
    textSize(this.width / 4);

    textAlign(LEFT, TOP);

    if (this.rankImage) {
      // For face cards, use the rank image
      imageMode(CENTER);
      tint(suitColor); // Apply suit color to the rank image
      // Draw the rank image centered, preserving its aspect ratio
      let img = this.rankImage;
      let maxWidth = this.width / 1.5;
      let maxHeight = this.height / 1.5;
      let aspect = img.width / img.height;
      let drawWidth = maxWidth;
      let drawHeight = maxWidth / aspect;
      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = maxHeight * aspect;
      }
      image(img, x + this.width / 2, y + this.height / 2, drawWidth, drawHeight);
      //noTint();

      
      if (this.rank !== 'Joker') {
        // Unfortuantely, they all need to be handled 
        // separately due to their different placements
        if (this.rank === 'King')
          text(this.rank[0], x + 1.2 * defaultCornerIndent, y + defaultCornerIndent);
        if (this.rank === 'Queen')
          text(this.rank[0], x + 1   * defaultCornerIndent, y + defaultCornerIndent);
        if (this.rank === 'Jack')
          text(this.rank[0], x + 1.9 * defaultCornerIndent, y + defaultCornerIndent);

        imageMode(CORNER);
        image(this.suitImage, x + defaultCornerIndent/2, y + 5.5*defaultCornerIndent, this.width / 4, this.width / 4);
      }
      noTint();
    } else {
      // Ace and 10 handling requires specific placement due to 
      // Ace's fancy corner image and 10 being multidigit
      if (this.rank === 'Ace')
        text('A', x + 1.6*defaultCornerIndent, y + defaultCornerIndent);
      else if (this.rank === '10')
        text('10', x + defaultCornerIndent, y + defaultCornerIndent);
      else
        text(this.rank[0], x + 1.7*defaultCornerIndent, y + defaultCornerIndent);

      imageMode(CORNER);
      tint(suitColor);
      image(this.suitImage, x + defaultCornerIndent/2, y + 5.5*defaultCornerIndent, this.width / 4, this.width / 4);
      noTint();
    }

    // Draw large suit symbol in center, larger for aces who have details
    if (this.suitImage && !this.rankImage) {
      imageMode(CENTER);
      tint(suitColor); // Apply suit color to the suit image
      if (this.rank === 'Ace') {
        let img = this.suitImage;
        let maxWidth = this.width / 1.5;
        let maxHeight = this.height / 1.5;
        let aspect = img.width / img.height;
        let drawWidth = maxWidth;
        let drawHeight = maxWidth / aspect;
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = maxHeight * aspect;
        }
        image(img, x + this.width / 2, y + this.height / 2, drawWidth, drawHeight);
      } else {
        let img = this.suitImage;
        let maxWidth = this.width / 2;
        let maxHeight = this.height / 2;
        let aspect = img.width / img.height;
        let drawWidth = maxWidth;
        let drawHeight = maxWidth / aspect;
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = maxHeight * aspect;
        }
        image(img, x + this.width / 2, y + this.height / 2, drawWidth, drawHeight);
      }
      noTint();
    } else {
      // Fallback large suit symbol
      push();
      textSize(20);
      textAlign(CENTER, CENTER);
      text(x + this.width / 2, y + this.height / 2);
      pop();
    }

    // Draw rank and suit in bottom right (rotated)
    textAlign(LEFT, TOP); // Because after rotation, (0,0) is effectively top-left of the rotated object

    translate(x + this.width, y + this.height);
    rotate(PI);
    tint(suitColor);
    if (this.rank !== 'Joker') {
      // Unfortuantely, they all need to be handled 
      // separately due to their different placements
      if      (this.rank === 'King')
        text(this.rank[0], 1.2 * defaultCornerIndent, defaultCornerIndent);
      else if (this.rank === 'Queen')
        text(this.rank[0],       defaultCornerIndent, defaultCornerIndent);
      else if (this.rank === 'Jack')
        text(this.rank[0], 1.9 * defaultCornerIndent, defaultCornerIndent);
      else if (this.rank === 'Ace')
        text('A',          1.6 * defaultCornerIndent, defaultCornerIndent);
      else if (this.rank === '10')
        text('10',               defaultCornerIndent, defaultCornerIndent);
      else
        text(this.rank[0], 1.7 * defaultCornerIndent, defaultCornerIndent);

      imageMode(CORNER);
      image(this.suitImage, defaultCornerIndent/2, 5.5*defaultCornerIndent, this.width / 4, this.width / 4);
    }
    pop();
  }

  getSuitSymbol() {
    switch (this.suit.toLowerCase()) {
      case 'heart': return '♥';
      case 'diamond': return '♦';
      case 'club': return '♣';
      case 'spade': return '♠';
      default: return '?';
    }
  }

  drawEmpty(x = this.x, y = this.y) {
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`-empty-`, x + 5, y + 25);
  }

  // Drag logic
  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.width &&
      mouseY > this.y && mouseY < this.y + this.height;
  }

  startDrag() {
    this.isDragging = true;
    this.offsetX = mouseX - this.x;
    this.offsetY = mouseY - this.y;
  }

  stopDrag() {
    this.isDragging = false;
  }

  updateDrag() {
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }
}
