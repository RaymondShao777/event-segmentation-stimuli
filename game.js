import {item, Player, background} from "./modules/component.js"

const wait = ms => new Promise(res => setTimeout(res, ms));

function Game(x, y, camSizeX, bg, ticks=64, player_img) {
  this.canvas = document.getElementById("game");
  this.context = this.canvas.getContext("2d");
  this.bg = bg;
  this.x = x;
  this.y = y;
  this.camSizeX = camSizeX;
  this.offset = camSizeX/4;
  //HARD CODED PLAYER SIZE
  this.player = new Player(this.offset, 0, 100, 200, player_img);
  this.camX = this.player.x-this.offset;
  this.camY = 0;
  this.ticks = ticks; // ticks per second
  this.msPerTick = 1000/this.ticks;
  // game loop given list of events
  this.play = async function(events){
    for (const i in events) {
      const game_event = events[i];
      const start = Date.now();
      let expected = start + this.msPerTick;
      while (game_event.time > 0) {
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
  this.draw = function(){
    // draw bg first
    this.context.drawImage(this.bg, this.camX, this.camY, this.camSizeX, this.y, 0, 0, this.camSizeX, this.y);

    // draw player
    this.context.drawImage(this.player.img, this.player.x - this.camX, this.player.y - this.camY, this.player.width, this.player.height);
  }
}

export {Game}
