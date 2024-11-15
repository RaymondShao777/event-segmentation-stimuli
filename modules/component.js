import {rgbString} from "./helper.js"

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

  jump(distance) {
    this.y -= distance;
  }
}

class Item extends Component {
  constructor(x, y, width, height, img, label="") {
    super(x, y, width, height, img);
    this.visible = true;
    this.inBox = true;
    this.label = label;
    this.labeled = false;

  }
}

class Player extends Component {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.idleImg = img;
  }

  animatePickup(){
    // advances animation
    if (this.current >= this.pickupCycle.length){
      this.current = 0;
    }
    this.img = this.pickupCycle[this.current++];
  }

  jump(distance, animate = false){
    super.jump(distance);
    if (! animate)
      return;

    // advances animation
    this.img = this.jumpCycle[this.current];
    this.current++;
    if (this.current == this.jumpCycle.length){
      this.current = 0;
    }
  }

  move(distance, animate = false){
    super.move(distance);

    if (! animate)
      return;
    // advances animation
    this.img = this.moveCycle[this.current];
    this.current++;
    if (this.current == this.moveCycle.length){
      this.current = 0;
    }
  }

  idle(){
    this.img = this.idleImg;
  }

  set addMoveAnimation(moves){
    this.moveCycle = moves;
    this.current = 0;
  }

  set addPickupAnimation(pickup){
    this.pickupCycle = pickup;
    this.current = 0;
  }

  set addJumpAnimation(jump){
    this.jumpCycle = jump;
    this.current = 0;
  }
}

class Button {
  #rgb;

  constructor(canvas, callback=()=>{return;}, x=0, y=0, width=100, height=100, fill_color="red", text="") {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.darken = false;
    this.width = width;
    this.height = height;
    this.ctx.fillStyle = fill_color;
    // allows color strings
    this.#rgb = this.ctx.fillStyle.match(/[\d\w]{2}/g).map((hex) => {
      return parseInt(`0x${hex}`);
    });
    this.text = text;

    // add button effects (hover and press effect)
    const hover = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this.isOnButton(mouse.x, mouse.y);
    };
    this.canvas.addEventListener('mousemove', hover);

    const onPress = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      if (this.isOnButton(mouse.x, mouse.y)) {
        canvas.removeEventListener('click', onPress);
        canvas.removeEventListener('mousemove', hover);
        callback();
      };
    };
    this.canvas.addEventListener('click' , onPress);

    // draw the button
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
    this.ctx.fillStyle = rgbString(rgb);
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

  // checks if button is being hovered (also enables darkening)
  isOnButton(x, y) {
    if ((x >= this.x && x <= this.x+this.width) &&
      (y >= this.y && y <= this.y+this.height))
      this.darken = true;
    else
      this.darken = false;
    this.draw();
    return this.darken;
  }

}


export {Player, Button, Item}
