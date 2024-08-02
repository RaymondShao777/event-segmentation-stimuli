import game_area from "../game.js"

function component(image, width, height, x, y, speed) {
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
      this.to_move -= 1;
    }
    const ctx = game_area.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
      this.image.src = `assets/sprite_${this.to_move}.png`;
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

export {component, player, background}
