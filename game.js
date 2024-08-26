import {Player} from "./modules/component.js"

const wait = ms => new Promise(res => setTimeout(res, ms));
const readKey = () => new Promise(resolve => window.addEventListener('keydown', resolve, { once: true }));
const waitKeyPress = async () => {
  const keyStart = Date.now();
  document.getElementById('instr').style.display = 'inline';
  await readKey();
  document.getElementById('instr').style.display = 'none';
  return Date.now()-keyStart;
}

class Game {
  constructor(x, y, camWidth, bg, auto = true, ticks=64) {
    this.x = x;
    this.y = y;
    this.time = 0;
    this.auto = auto;
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.bg = bg;
    this.bgRealWidth = this.bg.width;
    this.bgRealHeight = this.bg.height;
    this.bgWidth = this.bgRealWidth * this.y/this.bgRealHeight;
    this.bgHeight = this.y;
    this.camWidth = camWidth;
    this.ticks = ticks; // ticks per second
    this.msPerTick = 1000/this.ticks;
    this.items = []
  }
  // game loop given list of events
  async play(events){
    for (const i in events) {
      const start = Date.now();
      let expected = start + this.msPerTick;
      const game_event = events[i];
      while (game_event.time > 1) {
        this.time++;
        // handle a keypress event
        if (!this.auto && this.time%(64*2) == 0) {
          expected += await waitKeyPress();
        }
        const drift = Date.now() - expected;
        if (drift > expected) {
          console.log("ERROR");
        }
        game_event.update();
        this.draw();
        expected += this.msPerTick;
        await wait(Math.max(0, this.msPerTick-drift));
      }
      console.log((Date.now() - start)/1000);
    }
  }

  // the draw function does not change the state of the game
  draw(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw bg
    // TODO EDIT CODE SO THAT IT DOES NOT WARP THE IMAGE
    let bgOffset = this.camX%this.bgWidth/this.bgWidth;
    // draw x pre
    this.context.drawImage(this.bg,
      bgOffset*this.bgRealWidth, 0, (1-bgOffset)*this.bgRealWidth, this.bgRealHeight,
      0, 0, (1-bgOffset)*this.camWidth, this.y);
    // draw x post
    this.context.drawImage(this.bg,
      0, 0, bgOffset*this.bgRealWidth, this.bgRealHeight,
      (1-bgOffset)*this.camWidth, 0, bgOffset*this.camWidth, this.y);
    // draw final segment (if needed)

    // draw items
    for (const i in this.items) {
      if (!this.items[i].visible) {
        continue;
      }
      // check that item is in frame
      if ((this.items[i].x >= this.camX && this.items[i].x < (this.camX+this.camWidth)) ||
          (this.items[i].x+this.items[i].width > this.camX &&
           this.items[i].x+this.items[i].width <= (this.camX+this.camWidth))) {
        this.context.drawImage(this.items[i].img,
          this.items[i].x - this.camX, this.items[i].y - this.camY,
          this.items[i].width, this.items[i].height);
      }
    }

    // draw player
    this.context.drawImage(this.player.img,
      this.player.x - this.camX, this.player.y - this.camY,
      this.player.width, this.player.height);

  }

  set addPlayer(newPlayer){
    this.player = newPlayer;
    this.offset = this.player.x;
    this.moveCamera();
    this.camY = 0;
  }

  set addItem(newItem){
    this.items.push(newItem);
  }

  set setAuto(auto){
    this.auto = auto;
  }

  moveCamera(){
    this.camX = this.player.x - this.offset
  }
}

export {Game}
