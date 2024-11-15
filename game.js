import {Player} from "./modules/component.js"
import {wait, recordKeyPress, getDateISO} from "./modules/helper.js"

class Game {
  constructor(y, camWidth, bgs, ticks=64) {
    this.y = y;
    this.time = 0;
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.camWidth = camWidth;
    this.ticks = ticks; // ticks per second
    this.msPerTick = 1000/this.ticks;
    this.items = [];
    this.bgs = bgs;
    this.bgChange = 12800; //THIS IS HARD CODED BUT WE CAN CHANGE
  }

  // game loop given list of events
  async play(events){
    const durations = [];
    const globalStart = Date.now();

    for (const i in events) {
      const start = Date.now();
      let expected = start + this.msPerTick;
      const game_event = events[i];
      while (game_event.time > 1) {
        this.time++;
        const drift = Date.now() - expected;
        if (drift > expected) {
          console.log("ERROR");
        }
        game_event.update();
        this.draw();
        expected += this.msPerTick;
        await wait(Math.max(0, this.msPerTick-drift));
      }
      console.log((Date.now()-start)/1000);
    }

    return durations;
  }

  // the draw function does not change the state of the game
  draw(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw bg
    this.drawBg();

    // draw items
    for (const i in this.items) {
      if (!this.items[i].visible) {
        continue;
      }
      let itemImg = this.items[i].img;
      if (this.items[i].inBox) {
        itemImg = this.box;
      // draw label
      }

      if (this.items[i].labeled) {
        console.log('label');
        this.context.fillStyle = "black";
        this.context.strokeStyle = "white";
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        if (this.items[i].label) {
          this.context.font = 'normal 64px serif';
          var textWidth = this.context.measureText("This is a").width;
          var labelX = (this.items[i].width/2) + this.items[i].x - this.camX
          this.context.fillText("This is a", labelX - textWidth, this.y/5);
          this.context.strokeText("This is a", labelX - textWidth, this.y/5);
          this.context.font = 'bold 64px serif';
          this.context.fillText(this.items[i].label, labelX, this.y/5, this.camWidth);
          this.context.strokeText(this.items[i].label, labelX, this.y/5, this.camWidth);
        } else {
          this.context.font = 'normal 64px serif';
          var textWidth = this.context.measureText("Look at").width;
          var labelX = (this.items[i].width/2) + this.items[i].x - this.camX
          this.context.fillText("Look at", labelX - textWidth, this.y/5);
          this.context.strokeText("Look at", labelX - textWidth, this.y/5);
          this.context.font = 'bold 64px serif';
          this.context.fillText('this', labelX, this.y/5, this.camWidth);
          this.context.strokeText('this', labelX, this.y/5, this.camWidth);
        }
      }
      // check that item is in frame
      if ((this.items[i].x >= this.camX && this.items[i].x < (this.camX+this.camWidth)) ||
          (this.items[i].x+this.items[i].width > this.camX &&
           this.items[i].x+this.items[i].width <= (this.camX+this.camWidth))) {
        this.context.drawImage(itemImg,
          this.items[i].x - this.camX, this.items[i].y - this.camY,
          this.items[i].width, this.items[i].height);
      }
    }

    // draw player
    this.context.drawImage(this.player.img,
      this.player.x - this.camX, this.player.y - this.camY,
      this.player.width, this.player.height);

    // draw fg (grass) we would use this for parallax

  }

  // TODO THERE IS A WEIRD CLIP -> FIGURE OUT WHY
  drawBg() {
    let bg = this.bgs[Math.floor(this.camX/this.bgChange)];
    let sWidth = bg.width;
    let sHeight = bg.height;
    let dWidth = sWidth * this.y/sHeight;
    let dHeight = this.y;

    let offset = this.camX%dWidth/dWidth;
    // draw first segment
    this.context.drawImage(bg,
      offset*sWidth, 0, (1-offset)*sWidth, sHeight,
      0, 0, (1-offset)*dWidth, dHeight);
    // check if first segment needs to be drawn over
    if (this.bgNum(this.camX) != this.bgNum(this.camX+(1-offset)*dWidth)) {
      //draw second bg twice and be done
      bg = this.bgs[this.bgNum(this.camX)+1];
      sWidth = bg.width;
      sHeight = bg.height;
      dWidth = sWidth * this.y/sHeight;
      dHeight = this.y;
      this.context.drawImage(bg,
        0, 0, sWidth, sHeight,
        (this.bgNum(this.camX)+1)*this.bgChange-this.camX, 0, dWidth, dHeight);
      this.context.drawImage(bg,
        0, 0, sWidth, sHeight,
        dWidth+((this.bgNum(this.camX)+1)*this.bgChange-this.camX), 0, dWidth, dHeight);
      return;
    }
    // draw second segment
    this.context.drawImage(bg,
      0, 0, sWidth, sHeight,
      (1-offset)*dWidth, 0, dWidth, dHeight);
    // check if second segment needs to be drawn over
    if (this.bgNum(this.camX+(1-offset)*dWidth) != this.bgNum(dWidth+this.camX+(1-offset)*dWidth)) {
      //draw second bg twice and be done
      bg = this.bgs[this.bgNum(this.camX)+1];
      sWidth = bg.width;
      sHeight = bg.height;
      dWidth = sWidth * this.y/sHeight;
      dHeight = this.y;
      this.context.drawImage(bg,
        0, 0, sWidth, sHeight,
        (this.bgNum(this.camX)+1)*this.bgChange-this.camX, 0, dWidth, dHeight);
      this.context.drawImage(bg,
        0, 0, sWidth, sHeight,
        dWidth+((this.bgNum(this.camX)+1)*this.bgChange-this.camX), 0, dWidth, dHeight);
      return;
    }
    // draw final segment (if needed)
    this.context.drawImage(bg,
      0, 0, sWidth, sHeight,
      (2-offset)*dWidth, 0, dWidth, dHeight);
    // check if second segment needs to be drawn over
    if (this.bgNum(this.camX+this.camWidth) != this.bgNum(dWidth+this.camX+(1-offset)*dWidth)) {
      //draw second bg twice and be done
      bg = this.bgs[this.bgNum(this.camX)+1];
      sWidth = bg.width;
      sHeight = bg.height;
      dWidth = sWidth * this.y/sHeight;
      dHeight = this.y;
      this.context.drawImage(bg,
        0, 0, sWidth, sHeight,
        (this.bgNum(this.camX)+1)*this.bgChange-this.camX, 0, dWidth, dHeight);
      return;
    }
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

  set setBox(box){
    this.box = box;
  }

  bgNum(x) {
    return Math.floor(x/this.bgChange);
  }

  moveCamera(){
    this.camX = this.player.x - this.offset
  }
}

function drawLabel(game, item) {
  

}
export {Game}
