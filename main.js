import {Button} from "./modules/component.js"
import {MoveEvent} from "./modules/event.js"
import {Game} from "./game.js"
/*-------------------------------------------------
 * ASSET LOADING (KEEP THIS HERE FOR NOW)
 -------------------------------------------------*/

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
const bg = images[1];
const object_imgs = []
for (let i = 10; i < 18; i++) {
  object_imgs.push(images[i]);
}
//---------------------------------------------------------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// turn off antialiasing
ctx.imageSmoothingEnabled= false;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `64px "verdana", sans-serif`;
ctx.fillText("Title", 200, 100);
const play_button = new Button(ctx, 150, 175, 100, 50, "#DBCDF0", "start");


// intialize game
let game = new Game(1600, 300, 400, bg, 64, player_img);
let events = [new MoveEvent(game, 20, true, 30),
  new MoveEvent(game, 1, true, 30)];

function handle_play(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  if (play_button.is_on_button(mouse.x, mouse.y)) {
    canvas.removeEventListener('click', handle_play);
    canvas.removeEventListener('mousemove', hover);
    game.play(events);
  }
}

function hover(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  play_button.is_on_button(mouse.x, mouse.y);
}

canvas.addEventListener('click', handle_play);
canvas.addEventListener('mousemove', hover);


