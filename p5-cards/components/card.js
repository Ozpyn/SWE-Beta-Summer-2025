//----Try to only modify cardScale when changing size----//

const cardScale = 40; // must not be less than 30 for proper rendering

const defaultCardWidth  = 2 * cardScale;
const defaultCardHeight = 3 * cardScale;

class Card {
  constructor(suit, rank, x, y) {
    this.suit = suit;
    this.rank = rank;
    this.width = defaultCardWidth;
    this.height = defaultCardHeight;
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
    if (this.faceUp) {
      this.drawFront()
    } else {
      this.drawBack()
    }
  }

  drawBack(x = this.x, y = this.y) {
    push();
    fill(250, 200, 0);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(20);

    if (spade && heart && diamond && club) {
      imageMode(CENTER);
      tint(0);
      // No rotation - spade
      image(spade, x + this.width / 2, y + this.height / 3, cardScale/2, cardScale/2);

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
    rect(x, y, this.width, this.height, 5);
    // Determine suit color
    const suitColor = (this.suit === 'Heart' || this.suit === 'Diamond')
    ? color(255, 0, 0)    // red
    : color(0, 0, 0);     // black
    
    // Draw rank and suit in top left
    fill(suitColor);
    textFont(BaronNeue); 
    textSize(defaultCardWidth/4);
    
    textAlign(LEFT, TOP);

    if (this.rankImage) {
      // For face cards, use the rank image
      imageMode(CENTER);
      tint(suitColor); // Apply suit color to the rank image
      image(this.rankImage, x + this.width / 2, y + this.height / 2, 40, 40);
      //noTint();
      
      if (this.rank !== 'Joker') {
        imageMode(CORNER);
        image(this.suitImage, x + 2, y + 2, 20, 20);
      }
      noTint();
    } else {
      // For non-face/numeric cards only print first char
      // unless it's 10 (A, 1, 2, 3, ..., 9)
      text(
        (this.rank !== '10') ? this.rank[0] : this.rank,
        x + 2,
        y + 2
      );
    }
    
    // Draw large suit symbol in center, larger for aces who have details
    if (this.suitImage && !this.rankImage) {
      imageMode(CENTER);
      tint(suitColor); // Apply suit color to the suit image
      if (this.rank === 'Ace') {
        image(this.suitImage, x + this.width / 2, y + this.height / 2, 40, 40);
      } else {
        image(this.suitImage, x + this.width / 2, y + this.height / 2, 25, 25);
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

    translate(x + this.width - 2, y + this.height - 2);
    rotate(PI);

    if (this.rank !== 'Joker') {
      if (this.rankImage) {
        imageMode(CORNER); // CORNER works fine here with proper alignment
        tint(suitColor);
        image(this.suitImage, 0, 0, 20, 20);
        noTint();
      } else {
        text(
        (this.rank !== '10') ? this.rank[0] : this.rank, 0, 0
        );
      }
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
