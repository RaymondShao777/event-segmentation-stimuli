import {revealLabel, hideLabel} from "./helper.js"
import {assets} from "../scenes/LoadingScene.js"

class GameEvent {
  _game;

  constructor (game, time) {
    this._game = game;
    this.time = time*game.ticks;
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
  constructor (game, time, distance=0, {item}={}) {
    super(game, time);
    this.distance = distance;
    this.speed = distance/(time*game.ticks);
    this.ticks_to_animate = 4;
    this.animateCurrent = 1;
    this.first = true;
  }

  // updates current tick
  update() {
    super.update();
    if (this.first) {
      this.target = this.game.player.x + this.distance;
      this.first = false;
    }
    // move player and picked up items
    let animate = (this.animateCurrent++ % this.ticks_to_animate == 0);
    if (this.time == 1){
      this.game.player.move(this.target-this.game.player.x, animate); //ensure that player will always move the correct distance overall
    } else {
      this.game.player.move(this.speed, animate);
    }

    // update camera
    this.game.moveCamera();
  }
}

// player picks up object
class PickupEvent extends GameEvent{
  constructor(game, time, item) {
    super(game, time);
    this.item = item;
    this.ticks_to_animate = Math.floor(this.time/30);
    this.animateCurrent = 1;
  }

  update() {
    super.update();

    let animate = (this.animateCurrent++ % this.ticks_to_animate == 0);
    if (animate) {
      this._game.player.animatePickup();
    }

  }
}

export class JumpEvent extends GameEvent{
  constructor(game, time, item) {
    super(game, time);
    this.item = item;
    this.ticks_to_animate = Math.floor(this.time/20);
    this.animateCurrent = 1;
    this.fall = this.time/2;
    this.first = true;
    this.speed = 150/(this.time);
  }

  update() {
    super.update();
    if (this.first) {
      this.target = this.game.player.y;
      this.first = false;
    }
    // move player and picked up items
    let animate = (this.animateCurrent++ % this.ticks_to_animate == 0);
    if (this.time == 1){
      this.game.player.jump(this.target-this.game.player.y, animate); //ensure that player will always move the correct distance overall
    } else if (this.time > this.fall) {
      this.game.player.jump(this.speed, animate);
    } else {
      this.game.player.jump(-this.speed, animate);
    }
  }
}

class LabelEvent extends GameEvent{
  constructor(game, time, item) {
    super(game, time);
    this.item = item;
    this.sound = assets.get('Look');
    if (item.label) {
      this.sound = assets.get(item.label);
    }
    this.play = Math.floor(game.ticks*(time-1.3)); //this is for the label (should show 1.3 seconds after the object is revealed)
    this.first = true;
  }

  update() {
    super.update();

    if (this.first) {
      this.sound.play();
      this.item.inBox = false;
      this.first = false;
      this._game.player.idle();
    }

    if (this.time == this.play) {
      this.item.labeled = true;
    }

    if (this.time == 1)
    {
      this.item.visible = false;
    }

  }
}

class IdleEvent extends GameEvent{
  constructor(game, time){
    super(game, time);
    this.first = true;
  }

  update(){
    super.update();
    if (this.first) {
      this._game.player.idle();
      this.first = false;
    }
  }
}

export {GameEvent, MoveEvent, PickupEvent, LabelEvent, IdleEvent}
