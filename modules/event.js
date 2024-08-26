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

  update() {
    this.time--;
  }
}
// moves player distance to the right, or to item
class MoveEvent extends GameEvent {
  constructor (game, time, auto=true, distance=0, {item}={}) {
    super(game, time, auto);
    this.distance = distance;
    this.speed = distance/(time*game.ticks);
    this.ticks_to_animate = 4;
    this.animateCurrent = 1;
  }

  // updates current tick
  update() {
    super.update();
    // move player and picked up items
    let animate = (this.animateCurrent++ % this.ticks_to_animate == 0);
    this.game.player.move(this.speed, animate);

    // update camera
    this.game.moveCamera();
  }
}

// player picks up object
class PickupEvent extends GameEvent{
  constructor(game, time, auto=true, item) {
    super(game, time, auto);
    this.item = item;
    this.speed = (this.item.x-
      (this._game.player.x+this._game.player.width))/(this.time);
  }

  update() {
    super.update();
    if (this.time == 1) {
      this._game.player.pickup(this.item);
      this.item.visible = false
    }
    this.item.x -= this.speed;
  }
}

// player drops object
class DropEvent extends GameEvent {
  constructor (game, time, auto=true, item) {
    super(game, time, auto);
    this.item = item;
    this.speed = this.game.player.width/this.time;
  }

  update() {
    super.update();
    if (!this.item.visible) {
      this.item.visible = true;
      this.game.player.drop(this.item);
    }
    this.item.move(this.speed);
  }
}

export {MoveEvent, PickupEvent, DropEvent}
