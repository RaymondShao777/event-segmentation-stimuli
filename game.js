import {item, Player, background} from "./modules/component.js"

const wait = ms => new Promise(res => setTimeout(res, ms));

class Game {
  constructor(x, y, camSizeX, bg, ticks=64) {
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.bg = bg;
    this.x = x;
    this.y = y;
    this.camSizeX = camSizeX;
    this.offset = camSizeX/4;
    this.ticks = ticks; // ticks per second
    this.msPerTick = 1000/this.ticks;
    this.items = []
  }
  // game loop given list of events
  async play(events){
    for (const i in events) {
      const game_event = events[i];
      const start = Date.now();
      let expected = start + this.msPerTick;
      while (game_event.time > 1) {
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
    // draw bg first
    this.context.drawImage(this.bg, this.camX, this.camY, this.camSizeX, this.y,
      0, 0, this.camSizeX, this.y);

    // draw items
    for (const i in this.items) {
      if (!this.items[i].visible) {
        continue;
      }
      // check that item is in frame
      if ((this.items[i].x >= this.camX && this.items[i].x < (this.camX+this.camSizeX)) ||
          (this.items[i].x+this.items[i].width > this.camX &&
           this.items[i].x+this.items[i].width <= (this.camX+this.camSizeX))) {
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
    this.player = newPlayer
    this.moveCamera()
    this.camY = 0
  }

  set addItem(newItem){
    this.items.push(newItem);
  }

  moveCamera(){
    this.camX = this.player.x - this.offset
  }
}

export {Game}
