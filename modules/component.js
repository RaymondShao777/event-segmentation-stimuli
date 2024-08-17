//import game_area from "../game.js"

class Component {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
  }
}

class Player extends Component {
  constructor(x, y, width, height, img, backpack) {
    super(x, y, width, height, img);
    this.backpack = backpack;
  }
}

function item(image, sound, width, height, x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.visible = true;
  this.to_move = 0;
  this.width = width;
  this.height = height;
  this.image = image;
  this.update = function() {
    // update animation if player is moving
    if (this.to_move != 0) {
      this.to_move -= 1;
    }
    if (this.visible) {
      const ctx = game_area.context;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}

function player(image, width, height, x, y) {
  this.x = x;
  this.y = y;
  this.speed = 1;
  this.to_move = 0;
  this.width = width;
  this.height = height;
  this.image = image;
  this.update = function() {
    // update animation if player is moving
    if (this.to_move != 0) {
      this.to_move -= 1;
      this.image.src = `assets/sprite_${this.to_move % 8}.png`;
    } else {
      this.image.src = "assets/sprite.png";
    }
    const ctx = game_area.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

function background(image, width, height, x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.to_move = 0;
  this.width = width;
  this.height = height;
  this.image = image;
  this.update = function() {
    // update animation if player is moving
    if (this.to_move != 0) {
      this.to_move -= speed;
      this.x += speed;
    }
    const ctx = game_area.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height, 0, 0, this.width, this.height);
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

export {item, Player, background, Button}
