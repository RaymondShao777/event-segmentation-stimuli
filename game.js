import {item, player, background} from "./modules/component.js"

// base game loop
var player_piece;
var bg;
var item_event = 0;
function start_game() {
  bg = new background(bg_img, game_area.canvas.width, game_area.canvas.height, 0, 0, 50);
  player_piece = new player(player_img, 96, 96, 150-48, 160);
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
    // turn off antialiasing
    this.context.imageSmoothingEnabled= false;
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// controllers
function move() {
  if (player_piece.to_move == 0) {
    player_piece.to_move = 16;
    bg.to_move = 16 * bg.speed;
    item_event += 1;
  }
}

// control player movement
window.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") {
    move();
    sounds[0].play();
  }
});

// sound
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

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

const sounds = []

for (let i = 0; i < 8; i++) {
  const obj_id = Math.floor(Math.random() * 30) + 1
  srcs.push(`assets/sprite_${i}.png`);
  srcs.push(`assets/${obj_id}.png`);
//  sounds.push(`assets/${obj_id}.m4a`);
  sounds.push(new sound(`assets/test.m4a`));
}

const images = await preload(srcs);
const player_img = images[0];
const bg_img = images[1];
const object_imgs = []
for (let i = 10; i < 18; i++) {
  object_imgs.push(images[i]);
}

// begin the game loop
//start_game();

export {start_game}
export default game_area
