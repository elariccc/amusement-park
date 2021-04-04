import Game from './game.js';
import soundsLoader from './components/sounds-loader.js';
import imagesLoader from './components/images-loader.js';

const loadingScreen = document.querySelector('#loading-screen');

const menu = document.querySelector('#menu');
const startButton = document.querySelector('#start-button');

const results = document.querySelector('#results');
const stats = document.querySelector(`#stats`);
const playAgainButton = document.querySelector('#play-again-button');

const timer = document.querySelector('#timer');

export { results, stats, timer };

const handlePlayAgainClick = () => {
  results.classList.remove('results--in');
  game.start();
};

const handleStartClick = () => {
  menu.classList.add('menu--out');
  game.start();
};

const handleMouseMove = event => {
  game.mouseX = event.pageX - 100;
};

startButton.onclick = handleStartClick;
playAgainButton.onclick = handlePlayAgainClick;

let game; 

(async function() {
  await imagesLoader.load([
    'img/balloon-yellow.png', 
    'img/balloon-yellow-pop.png', 
    'img/balloon-blue.png', 
    'img/balloon-blue-pop.png', 
    'img/balloon-purple.png', 
    'img/balloon-purple-pop.png', 
    'img/canvas-background.png',
    'img/knife.png',
  ]);

  await soundsLoader.load([
    'audio/balloon-pop.wav', 
    'audio/music.mp3',
  ]);

  document.onmousemove = handleMouseMove;
  
  game = new Game('game-field');

  loadingScreen.classList.add('loading--out');
})();