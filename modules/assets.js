import {fileName} from "./helper.js"

// sound
function Sound(src) {
  this.Sound = document.createElement("audio");
  this.Sound.src = src;
  this.Sound.setAttribute("preload", "auto");
  this.Sound.setAttribute("controls", "none");
  this.Sound.style.display = "none";
  document.body.appendChild(this.Sound);
  this.play = function(){
    this.Sound.play();
  }
  this.stop = function(){
    this.Sound.pause();
  }
}

export function loadSound(src) {
  return new Sound(src);
}

// load images
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject(`Image failed to load: ${src}`);
  });
}

export class AssetManager {
  #assets = {};
  constructor(srcList=[]) {
    this.load(srcList);
  }

  // load asset(s)
  async load(srcs) {
    if (typeof(srcs) == 'string') {
      srcs = [srcs];
    }

    const promises = srcs.map((src) => {
      return new Promise(async (resolve) => {
        const name = fileName(src[1]);
        if (src[0] == 'sound') {
          this.#assets[name] = loadSound(src[1]);
          resolve();
        }
        if (src[0] == 'image') {
          const img = await loadImage(src[1]);
          this.#assets[name] = img;
          resolve();
        }
      });
    });
    return Promise.all(promises);
  }

  // get asset(s) from currently loaded assets
  get(assets) {
    if (typeof(assets) == 'string') {
      return this.#assets[assets];
    }

    return assets.map((asset) => {
      return this.#assets[asset];
    });
  }
}
