let cardScale = 1; // scale factor for card dimensions
let cardRatio = 1.5; // width / height ratio for cards

let defaultCardWidth = 0;
let defaultCardHeight = 0;
let defaultCornerRadius = 0;
let defaultCornerIndent = 0;

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
    let verticalLimit = window.innerHeight / (8 / cardScale);
    let horizontalLimit = window.innerWidth / ((8 / cardScale) * cardRatio);
    if (horizontalLimit * 1.5 < verticalLimit) {
      defaultCardWidth = horizontalLimit;
      defaultCardHeight = horizontalLimit * cardRatio;
    } else {
      defaultCardWidth = verticalLimit / cardRatio;
      defaultCardHeight = verticalLimit;
    }
    this.width = defaultCardWidth;
    this.height = defaultCardHeight;
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
      image(spade, x + this.width / 2, y + this.height / 3, defaultCardWidth / 4, defaultCardWidth / 4);

      // 180° rotation - heart
      push();
      translate(x + this.width / 2, y + (this.height * 2) / 3);
      rotate(PI); // 180 degrees in radians
      image(heart, 0, 0, defaultCardWidth / 4, defaultCardWidth / 4);
      pop();

      // 90° rotation left (counter-clockwise) - diamond
      push();
      translate(x + this.width / 3, y + this.height / 2);
      rotate(-HALF_PI); // -90 degrees
      image(diamond, 0, 0, defaultCardWidth / 4, (defaultCardWidth / 4 * 1.2));
      pop();

      // 90° rotation right (clockwise) - club
      push();
      translate(x + (this.width * 2) / 3, y + this.height / 2);
      rotate(HALF_PI); // 90 degrees
      image(club, 0, 0, defaultCardWidth / 4, (defaultCardWidth / 4 * 1.2));
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
    this.calculateDimensions();
    push();

    // Draw card background
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, defaultCornerRadius);

    // Determine suit color
    const suitColor = (this.suit === 'Heart' || this.suit === 'Diamond' || this.suit === 'Red')
      ? color(255, 0, 0)
      : color(0, 0, 0);

    // Draw top-left corner
    push();
    fill(suitColor);
    tint(suitColor);
    this.drawCorner(x, y, false);
    pop();

    // Draw bottom-right corner (rotated)
    push();
    fill(suitColor);
    tint(suitColor);
    this.drawCorner(x + this.width, y + this.height, true);
    pop();

    noTint();

    // Draw main image content
    tint(suitColor)
    imageMode(CENTER);
    if (this.rankImage) {
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
      image(img, x + this.width / 2, y + this.height / 2, 0.9 * drawWidth, 0.9 * drawHeight);
      noTint();
    } else if (this.suitImage) {
      tint(suitColor);
      let img = this.suitImage;
      let centerX = x + this.width / 2;
      let centerY = y + this.height / 2;

      // Max icon size and aspect correction
      let maxIconWidth = this.width / 6;
      let maxIconHeight = this.height / 6;
      let aspect = img.width / img.height;
      let iconWidth = maxIconWidth;
      let iconHeight = maxIconWidth / aspect;
      if (iconHeight > maxIconHeight) {
        iconHeight = maxIconHeight;
        iconWidth = maxIconHeight * aspect;
      }

      if (this.rank === 'Ace') {
        // One large symbol in the center
        let maxWidth = this.width / 1.5;
        let maxHeight = this.height / 1.5;
        let drawWidth = maxWidth;
        let drawHeight = maxWidth / aspect;
        if (drawHeight > maxHeight) {
          drawHeight = maxHeight;
          drawWidth = maxHeight * aspect;
        }
        image(img, centerX, centerY, drawWidth, drawHeight);

      } else if (!isNaN(parseInt(this.rank))) {
        let count = parseInt(this.rank);
        let pipPositions = [];

        // Define pip positions (percentages of card height and width)
        // Format: [xOffsetRatio, yOffsetRatio]
        // Do not change the order of these cases, as they are sequentially dependent
        // Fallthrough logic for pip positions to reduce redundancy
        switch (count) {
          case 2:
            pipPositions.push([0.5, 0.25], [0.5, 0.75]);
            break;
          case 3:
            pipPositions.push([0.5, 0.2], [0.5, 0.5], [0.5, 0.8]);
            break;
          case 5:
            pipPositions.push([0.5, 0.5]);
          case 4:
            pipPositions.push([0.3, 0.25], [0.7, 0.25], [0.3, 0.75], [0.7, 0.75]);
            break;
          case 7:
            pipPositions.push([0.5, 0.65]);
          case 6:
            pipPositions.push([0.3, 0.2], [0.7, 0.2], [0.3, 0.5], [0.7, 0.5], [0.3, 0.8], [0.7, 0.8]);
            break;
          case 10:
            pipPositions.push([0.5, 0.7]);
          case 9:
            pipPositions.push([0.5, 0.3]);
          case 8:
            pipPositions.push([0.25, 0.2], [0.75, 0.2], [0.25, 0.4], [0.75, 0.4],
              [0.25, 0.6], [0.75, 0.6], [0.25, 0.8], [0.75, 0.8]);
            break;
        }

        // Draw all pip positions
        let INSET_RATIO = 0.25; // 10% inset for pip positions
        for (let [xRatio, yRatio] of pipPositions) {
          let insetX = this.width * INSET_RATIO;
          let insetY = this.height * (INSET_RATIO / 2);
          let usableWidth = this.width - 2 * insetX;
          let usableHeight = this.height - 2 * insetY;

          let drawX = x + insetX + usableWidth * xRatio;
          let drawY = y + insetY + usableHeight * yRatio;

          image(img, drawX, drawY, iconWidth, iconHeight);
        }

      }

      noTint();
    } else {
      // fallback text if images aren't available
      fill(0);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.rank, x + this.width / 2, y + this.height / 2);
    }

    pop();
  }

  drawCorner(x, y, rotate180 = false) {
    push();
    translate(x, y);
    if (rotate180) rotate(PI);

    const suitColor = (this.suit === 'Heart' || this.suit === 'Diamond' || this.suit === 'Red')
      ? color(255, 0, 0)
      : color(0, 0, 0);
    fill(suitColor);
    noStroke();
    tint(suitColor);
    let rankChar = this.rank === '10' ? '10' : this.rank[0];
    textFont(BaronNeue);
    textSize(this.width / 4);
    textAlign(LEFT, TOP);
    let charWidth = textWidth(rankChar);
    let textX = defaultCornerIndent / 3 + ((this.width / 4 - charWidth) / 2);
    let textY = defaultCornerIndent / 5;
    if ((this.rank !== 'Joker')) {
      text(rankChar, textX, textY);
    }
    if (this.suitImage) {
      imageMode(CORNER);
      image(
        this.suitImage,
        defaultCornerIndent / 2,
        5.5 * defaultCornerIndent,
        this.width / 4,
        this.width / 4
      );
    }
    noTint();
    pop();
  }

  drawCenter(x, y) {

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
