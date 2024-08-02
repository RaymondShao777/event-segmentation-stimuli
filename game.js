import {component, player, background} from "./modules/component.js"

// base game loop
var player_piece;
var bg;
function start_game() {
  bg = new background(bg_img, game_area.canvas.width, game_area.canvas.height, 0, 0, 50);
  player_piece = new player(player_img, 96, 96, 200-48, 160);
  game_area.start();
}

function update_game() {
  game_area.clear();
  bg.update();
  player_piece.update();
}

// game window
let game_area = {
  canvas : document.getElementById("game"),
  start : function() {
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(update_game, 100);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// controllers
function move() {
  if (player_piece.to_move == 0) {
    player_piece.to_move = 8;
    bg.to_move = 8 * bg.speed;
  }
}

// control player movement
window.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") {
    move();
  }
});

// preload images
function preload(srcs) {
  const promises = srcs.map((src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = () => reject(`Image failed to load: ${src}`);
    });
  });

  return Promise.all(promises);
}

const srcs = [
  "assets/sprite.png",
  "assets/bg.png",
];

for (let i = 0; i < 8; i++) {
  srcs.push(`assets/sprite_${i}.png`);
}

const images = await preload(srcs);
const player_img = images[0];
const bg_img = images[1];

// begin the game loop
start_game();

export default game_area
