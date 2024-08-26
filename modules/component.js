//import game_area from "../game.js"

class Component {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
  }

  move(distance) {
    this.x += distance;
  }
}

class Item extends Component {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.visible = true;
  }
}

class Player extends Component {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.backpack = [];
  }

  pickup(item){
    this.backpack.push(item);
    item.x = this.x;
  }

  animatePickup(){
    // advances animation
    if (this.current >= this.pickupCycle.length){
      this.current = 0;
    }
    this.img = this.pickupCycle[this.current++];
  }

  animateDrop(){
    // advances animation
    if (this.current >= this.pickupCycle.length || this.current == -1){
      this.current = this.pickupCycle.length - 1;
    }
    this.img = this.pickupCycle[this.current--];
  }

  drop(item){
    this.backpack = this.backpack.splice(this.backpack.indexOf(item), 1);
  }

  move(distance, animate = false){
    super.move(distance);
    for (const i in this.backpack) {
      this.backpack[i].move(distance);
    }

    if (! animate)
      return;
    // advances animation
    this.img = this.moveCycle[this.current];
    this.current++;
    if (this.current == this.moveCycle.length){
      this.current = 0;
    }
  }

  set addMoveAnimation(moves){
    this.moveCycle = moves;
    this.current = 0;
  }

  set addPickupAnimation(pickup){
    this.pickupCycle = pickup;
    this.current = 0;
  }
}

class Button {
  #rgb;

  constructor(ctx, x, y, width, height, fill_color="red", text="") {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.darken = false;
    this.width = width;
    this.height = height;
    this.ctx.fillStyle = fill_color;
    this.#rgb = this.ctx.fillStyle.match(/[\d\w]{2}/g).map((hex) => {
      return parseInt(`0x${hex}`);
    });
    this.text = text;
    this.draw();
  }

  draw() {
    // set color based on mouse pos
    let rgb;
    if (this.darken) {
      rgb = this.#rgb.map((color) => {
        return color * 0.75;
      });
    } else {
      rgb = this.#rgb;
    }
    this.ctx.fillStyle = rgb_string(rgb);
    // draw button
    this.ctx.beginPath();
    this.ctx.roundRect(this.x, this.y, this.width, this.height, this.width*this.height/1000);
    this.ctx.fill();
    // set text color based on luminosity of fill
    const luminance = 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2];
    if (luminance > 127.5) {
      this.ctx.fillStyle = 'black';
    } else {
      this.ctx.fillStyle = 'white';
    }
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${Math.floor(this.height/2)}px "verdana", sans-serif`;
    this.ctx.fillText(this.text, this.x+(this.width/2), this.y+(this.height/2), this.width);
  }

  is_on_button(x, y) {
    if ((x >= this.x && x <= this.x+this.width) &&
      (y >= this.y && y <= this.y+this.height))
      this.darken = true;
    else
      this.darken = false;
    this.draw();
    return this.darken;
  }
}

function rgb_string(rgb) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export {Player, Button, Item}
