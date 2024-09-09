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
  "../assets/sprite.png",
  "../assets/bg.png",
];

const sounds = []
const playerMoveSrc = []
const playerPickupSrc = []
const objSrc = []

for (let i = 0; i < 16; i++) {
  const obj_id = Math.floor(Math.random() * 30) + 1
  playerMoveSrc.push(`../assets/w${i+1}.png`);
  if (i < 7){
    playerPickupSrc.push(`../assets/r${i+1}.png`);
  }
  objSrc.push(`../assets/${obj_id}.png`);
}

const images = await preload(srcs);
const playerMove = await preload(playerMoveSrc);
const playerPickup = await preload(playerPickupSrc);
const playerImg = playerMove[0];
const bg = images[1];
const objectImgs = await preload(objSrc);
const click = new sound("../assets/click.ogg");

export {images, playerMove, playerPickup, playerImg, bg, objectImgs, click}
