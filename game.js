// base game loop
var player_piece;
const player_img = new Image();
player_img.src = "assets/sprite.png";
const bg = new Image();
bg.src = "assets/bg.png";

function start_game() {
  player_piece = new player(player_img, 96, 96, 200-48, 160);
  game_area.start();
}

function update_game() {
  game_area.clear();
  game_area.context.drawImage(bg, 0, 0, game_area.canvas.width, game_area.canvas.height, 0, 0, game_area.canvas.width, game_area.canvas.height)
  player_piece.update();
}

// game window
var game_area = {
  canvas : document.getElementById("game"),
  start : function() {
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(update_game, 50);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// components
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
      this.to_move -= this.speed;
      this.image.src = `assets/sprite_${this.to_move}.png`;
    } else {
      this.image.src = "assets/sprite.png";
    }
    ctx = game_area.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// controllers
function move() {
  if (player_piece.to_move == 0) {
    player_piece.to_move = 8;
  }
}
// control player movement
window.addEventListener("keydown", (e) => {
  if (e.code == "ArrowRight") {
    move();
  }
});

