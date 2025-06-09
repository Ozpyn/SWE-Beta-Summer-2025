let gameOptions = ["Blackjack"];
let gameSelect;
let startButton;
let engine = null;
let selectedGame = null;

function setup() {
  createCanvas(800, 600);

  gameSelect = createSelect();
  gameSelect.position(20, 20);
  gameSelect.option('Choose a game');
  for (let option of gameOptions) {
    gameSelect.option(option);
  }

  // Start button
  startButton = createButton('Start Game');
  startButton.position(160, 20);
  startButton.mousePressed(startGame);
  
}

function draw() {
  background(0, 200, 100);
}

function startGame() {
  selectedGame = gameSelect.value();
  if (selectedGame === 'Choose a game') {
    alert('Please select a game mode.');
    return;
  }

  let gameFile = `games/${selectedGame.toLowerCase()}.json`;

  // Load the game config and initialize engine
  loadJSON(gameFile, config => {
    engine = new GameEngine(config);
    engine.setup();
  }, () => {
    alert(`Could not load config for ${selectedGame}`);
  });
}
