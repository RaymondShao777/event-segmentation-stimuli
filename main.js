import {Player, Button, Item} from "./modules/component.js"
import {MoveEvent, PickupEvent, DropEvent} from "./modules/event.js"
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
const playerMoveSrc = []
const playerPickupSrc = []
const objSrc = []

for (let i = 0; i < 16; i++) {
  const obj_id = Math.floor(Math.random() * 30) + 1
  playerMoveSrc.push(`assets/w${i+1}.png`);
  if (i < 7){
    playerPickupSrc.push(`assets/r${i+1}.png`);
  }
  objSrc.push(`assets/${obj_id}.png`);
//  sounds.push(`assets/${obj_id}.m4a`);
  sounds.push(new sound(`assets/test.m4a`));
}

const images = await preload(srcs);
const playerMove = await preload(playerMoveSrc);
const playerPickup = await preload(playerPickupSrc);
const player_img = playerMove[0];
const bg = images[1];
const object_imgs = await preload(objSrc);
//---------------------------------------------------------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
// turn off antialiasing (do this if we use pixel art)
// ctx.imageSmoothingEnabled= false;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `64px "verdana", sans-serif`;
ctx.fillText("Title", 200, 100);
const play_button = new Button(ctx, 150, 175, 100, 50, "#DBCDF0", "start");


// intialize game
let game = new Game(1800, 300, 400, bg, false);
// add player
game.addPlayer = new Player(75, (300-200)*0.75, 125, 200, player_img);
game.player.addMoveAnimation = playerMove;
game.player.addPickupAnimation = playerPickup;
// add objects
const item1 = new Item(300, 175, 84, 84, object_imgs[0]);
game.addItem = item1;
// add events
let events = [new MoveEvent(game, 5, 100),
  new PickupEvent(game, 0.5, item1),
  new MoveEvent(game, 10, 200),
  new DropEvent(game, 0.5, item1)];

function handlePlay(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  if (play_button.is_on_button(mouse.x, mouse.y)) {
    canvas.removeEventListener('click', handlePlay);
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

canvas.addEventListener('click', handlePlay);
canvas.addEventListener('mousemove', hover);


