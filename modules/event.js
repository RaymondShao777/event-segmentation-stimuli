class GameEvent {
  _game;

  constructor (game, time, auto) {
    this._game = game;
    this.time = time*game.ticks;
    this.auto = auto;
  }

  get game() {
    return this._game;
  }
}
// moves player distance to the right, or to item
class MoveEvent extends GameEvent {
  constructor (game, time, auto=true, distance=0, {item}={}) {
    super(game, time, auto);
    this.distance = distance;
    this.speed = distance/(time*game.ticks);
  }

  // updates current tick
  update() {
    this.time--;
    // move player
    // move picked up items
  }
}

// player picks up object
function pickup(game, time, auto=true, item) {
  console.log()
}

// player drops object
function drop(game, time, auto=true, item) {
  console.log()
}

export {MoveEvent}
