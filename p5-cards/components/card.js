class Card {
  constructor(suit, rank, x, y) {
    this.suit = suit;
    this.rank = rank;
    this.width = 60;
    this.height = 90;
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
      } else if (this.rank === 'Ace'){
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
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`BackArt`, x + 5, y + 25);
  }

  drawFront(x = this.x, y = this.y) {
    push();
    // Draw card background
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    
    // Determine suit color
    let suitColor;
    if (this.suit === 'Heart' || this.suit === 'Diamond') {
      suitColor = color(255, 0, 0); // Red
    } else {
      suitColor = color(0, 0, 0); // Black
    }
    
    // Draw rank and suit in top left
    fill(suitColor);
    textSize(12);
    textAlign(LEFT, TOP);
    
    if (this.rankImage) {
      // For face cards, use the rank image
      imageMode(CORNER);
      image(this.rankImage, x + 2, y + 2, 20, 20);
    } else {
      // For numeric cards and when images aren't loaded, use text
      text(this.rank, x + 2, y + 2);
    }
    
    // Draw large suit symbol in center, larger for aces who have details
    if (this.suitImage) {
      imageMode(CENTER);
      if (this.rank === 'Ace') {
        image(this.suitImage, x + this.width / 2, y + this.height / 2, 40, 40);
      } else {
        image(this.suitImage, x + this.width / 2, y + this.height / 2, 25, 25);
      }
    } else {
      // Fallback large suit symbol
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.getSuitSymbol(), x + this.width/2, y + this.height/2);
    }
    
    // Draw rank and suit in bottom right (rotated)
    textAlign(LEFT, TOP); // Because after rotation, (0,0) is effectively top-left of the rotated object

    translate(x + this.width - 2, y + this.height - 2);
    rotate(PI);

    if (this.rankImage) {
      imageMode(CORNER); // CORNER works fine here with proper alignment
      image(this.rankImage, 0, 0, 20, 20);
    } else {
      text(this.rank, 0, 0);
    }
    pop();
  }

  getSuitSymbol() {
    switch(this.suit.toLowerCase()) {
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
