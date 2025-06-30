class Game {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setup() { }
    draw() { }
    mousePressed() { }
}
