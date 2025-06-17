class Card {
  constructor(suit, rank, x, y) {
    this.suit = suit;
    this.rank = rank;
    this.width = 60;
    this.height = 90;
    this.x = x;
    this.y = y;

    // Dragging support
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // Original draw method (you can modify this one to pick what to show)
  draw(x = this.x, y = this.y) {
    // fill(255);
    // stroke(0);
    // rect(x, y, this.width, this.height, 5);
    // fill(0);
    // textSize(16);
    // text(`${this.rank} of ${this.suit}`, x + 5, y + 25);
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
    fill(255);
    stroke(0);
    rect(x, y, this.width, this.height, 5);
    fill(0);
    textSize(16);
    text(`${this.rank} of ${this.suit}`, x + 5, y + 25);
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
