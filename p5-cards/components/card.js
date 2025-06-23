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
    this.suitImage = null;
    this.rankImage = null;
    this.imagesLoaded = false;
    this.loadImages();
  }

  loadImages() {
    // Load suit image
    let suitFileName = this.suit.toLowerCase();
    if (suitFileName === 'hearts') suitFileName = 'heart';
    if (suitFileName === 'diamonds') suitFileName = 'diamond';
    if (suitFileName === 'clubs') suitFileName = 'club';
    if (suitFileName === 'spades') suitFileName = 'spade';
    
    // Load suit image
    this.suitImage = loadImage(`assets/suits/${suitFileName}.png`, 
      () => { this.imagesLoaded = true; },
      () => { console.log(`Failed to load suit image: ${suitFileName}`); }
    );

    // Load rank image (only for face cards)
    let rankFileName = this.rank.toLowerCase();
    if (rankFileName === 'jack' || rankFileName === 'queen' || 
        rankFileName === 'king' || rankFileName === 'joker') {
      this.rankImage = loadImage(`assets/rank/${rankFileName}.png`,
        () => { this.imagesLoaded = true; },
        () => { console.log(`Failed to load rank image: ${rankFileName}`); }
      );
    }
  }

  // Original draw method (you can modify this one to pick what to show)
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
    // Draw card background
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    
    // Determine suit color
    let suitColor;
    if (this.suit === 'Hearts' || this.suit === 'Diamonds') {
      suitColor = color(255, 0, 0); // Red
    } else {
      suitColor = color(0, 0, 0); // Black
    }
    
    // Draw rank and suit in top left
    fill(suitColor);
    textSize(10);
    textAlign(LEFT, TOP);
    
    if (this.rankImage && this.imagesLoaded) {
      // For face cards, use the rank image
      imageMode(CORNER);
      image(this.rankImage, x + 2, y + 2, 12, 12);
    } else {
      // For numeric cards and when images aren't loaded, use text
      text(this.rank, x + 2, y + 2);
    }
    
    // Draw suit symbol in top left (next to rank)
    if (this.suitImage && this.imagesLoaded) {
      imageMode(CORNER);
      image(this.suitImage, x + 15, y + 2, 8, 8);
    } else {
      // Fallback suit symbol
      text(this.getSuitSymbol(), x + 15, y + 2);
    }
    
    // Draw large suit symbol in center
    if (this.suitImage && this.imagesLoaded) {
      imageMode(CENTER);
      image(this.suitImage, x + this.width/2, y + this.height/2, 50, 50);
    } else {
      // Fallback large suit symbol
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.getSuitSymbol(), x + this.width/2, y + this.height/2);
    }
    
    // Draw rank and suit in bottom right (rotated)
    textSize(10);
    textAlign(RIGHT, BOTTOM);
    push();
    translate(x + this.width - 2, y + this.height - 2);
    rotate(PI);
    
    if (this.rankImage && this.imagesLoaded) {
      imageMode(CORNER);
      image(this.rankImage, 0, 0, 12, 12);
      image(this.suitImage, 15, 0, 8, 8);
    } else {
      text(this.rank, 0, 0);
      text(this.getSuitSymbol(), 15, 0);
    }
    pop();
    
    // Reset text alignment
    textAlign(LEFT, BASELINE);
  }

  getSuitSymbol() {
    switch(this.suit.toLowerCase()) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
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
