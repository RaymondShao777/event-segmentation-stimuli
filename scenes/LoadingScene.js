import {AssetManager} from "../modules/assets.js"
import {getDateISO, fileName, fetchURL} from "../modules/helper.js"
import {Game} from "../game.js"
import {Player, Button, Item} from "../modules/component.js"
import {MoveEvent, IdleEvent, PickupEvent, JumpEvent, LabelEvent} from "../modules/event.js"

export const assets = new AssetManager();

export class LoadingScene {
  constructor() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    // draw loading screen
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `64px "verdana", sans-serif`;
    this.ctx.fillText("Loading", 400, 300);
  }

  update() {}

  async start() {
    const srcList = [
      //general use images
      //["image", `${fetchURL}resources/w1.png`],
      ["image", `${fetchURL}resources/bg.png`],
      ["image", `${fetchURL}resources/box1.png`],
      ["image", `${fetchURL}resources/box2.png`],
      ["image", `${fetchURL}resources/box3.png`],
      ["image", `${fetchURL}resources/Beach_Background.png`],
      ["image", `${fetchURL}resources/City_Background.png`],
      ["image", `${fetchURL}resources/Desert_Background.png`],
      ["image", `${fetchURL}resources/Flower_Background.png`],
      ["image", `${fetchURL}resources/Hill_Background.png`],
      ["image", `${fetchURL}resources/Arctic_Background.png`],
      ["image", `${fetchURL}resources/Night_Forest_Background.png`],
      ["image", `${fetchURL}resources/Park_Background.png`],
      //sounds
      ["sound", `${fetchURL}resources/Bink.ogg`],
      ["sound", `${fetchURL}resources/Leam.ogg`],
      ["sound", `${fetchURL}resources/Look.ogg`]
    ];

    //familiar objects
    const objSrc = [];
    const labelSounds = ['Bink', 'Leam', 'Zeb', 'Yok', 'Wug', 'Vab', 'Tri', 'Noop', 'Mel', 'Kern', 'Hux', 'Dax'];
    for (const name in labelSounds) {
      for (let i = 1; i < 4; i++){
        srcList.push(["sound", `${fetchURL}resources/${labelSounds[name]}.ogg`]);
      }
    }

    //novel objects
    const objNums = [];
    for (let i = 1; i < 31; i++) {
      objNums.push(i);
    }
    for (const objNum in objNums) {
      for (let i = 1; i < 4; i++){
        srcList.push(["image", `${fetchURL}resources/obj${objNums[objNum]}_${i}.png`]);
        objSrc.push(`obj${objNums[objNum]}_${i}`);
      }
    }

    //animations
    //reaching
    const reachSrc = [];
    for (let i = 1; i < 31; i++){
      srcList.push(["image", `${fetchURL}resources/reach${i}.png`]);
      reachSrc.push(`reach${i}`);
    }
    //walking
    const walkSrc = [];
    for (let i = 1; i < 17; i++){
      srcList.push(["image", `${fetchURL}resources/walk${i}.png`]);
      walkSrc.push(`walk${i}`);
    }
    //jumping
    const jumpSrc = [];
    for (let i = 1; i < 21; i++){
      srcList.push(["image", `${fetchURL}resources/jump${i}.png`]);
      jumpSrc.push(`jump${i}`);
    }

    await assets.load(srcList);

    // play game once all assets load

    const playerMove = assets.get(walkSrc);
    const playerPickup = assets.get(reachSrc);
    const playerJump = assets.get(jumpSrc);
    const playerImg = assets.get('walk1');
    const bgs = [assets.get('Beach_Background'),
                 assets.get('City_Background'),
                 assets.get('Desert_Background'),
                 assets.get('Flower_Background'),
                 assets.get('Hill_Background'),
                 assets.get('Arctic_Background'),
                 assets.get('Night_Forest_Background'),
                 assets.get('Park_Background'),
                 ];

    // intialize game
    let game = new Game(600, 800, bgs);

    // add player
    game.addPlayer = new Player(75, (600-400)*0.75, 250, 400, playerImg);
    game.setBox = assets.get(`box1`);
    game.player.addMoveAnimation = playerMove;
    game.player.addPickupAnimation = playerPickup;
    game.player.addJumpAnimation = playerJump;

    // add objects & events
    let events = [new MoveEvent(game, 1.5, 400)];
    for (let trialNum = 0; trialNum < 6; trialNum++) {
      for (let i = 0; i < 3; i++){
        const item1 = new Item((12800*trialNum)+(4000*i)+800, 165, 360, 360, assets.get(`obj${5*trialNum+1}_${i+1}`), labelSounds[2*trialNum]);
        const item2 = new Item((12800*trialNum)+(4000*i)+1600, 165, 360, 360, assets.get(`obj${5*trialNum+2}_${i+1}`));
        const item3 = new Item((12800*trialNum)+(4000*i)+2400, 165, 360, 360, assets.get(`obj${5*trialNum+3}_${i+1}`), labelSounds[2*trialNum + 1]);
        const item4 = new Item((12800*trialNum)+(4000*i)+3200, 165, 360, 360, assets.get(`obj${5*trialNum+4}_${i+1}`));
        const item5 = new Item((12800*trialNum)+(4000*i)+4000, 165, 360, 360, assets.get(`obj${5*trialNum+5}_${i+1}`));
        game.addItem = item1;
        game.addItem = item2;
        game.addItem = item3;
        game.addItem = item4;
        game.addItem = item5;
        // add events
        events.push(this.chooseEvent(i, game, 1, item1));
        events.push(new IdleEvent(game, 0.5));
        events.push(new LabelEvent(game, 3.5, item1));
        events.push(new MoveEvent(game, 3, 800));

        events.push(this.chooseEvent(i, game, 1, item2));
        events.push(new IdleEvent(game, 0.5));
        events.push(new LabelEvent(game, 3.5, item2));
        events.push(new MoveEvent(game, 3, 800));

        events.push(this.chooseEvent(i, game, 1, item3));
        events.push(new IdleEvent(game, 0.5));
        events.push(new LabelEvent(game, 3.5, item3));
        events.push(new MoveEvent(game, 3, 800));

        events.push(this.chooseEvent(i, game, 1, item4));
        events.push(new IdleEvent(game, 0.5));
        events.push(new LabelEvent(game, 3.5, item4));
        events.push(new MoveEvent(game, 3, 800));

        events.push(this.chooseEvent(i, game, 1, item5));
        events.push(new IdleEvent(game, 0.5));
        events.push(new LabelEvent(game, 3.5, item5));
        events.push(new MoveEvent(game, 3, 800));
      }
      //events.push(new MoveEvent(game, 3, 12000));
      events.push(new MoveEvent(game, 3, 800));
    }

    // start timer
    const start = Date.now();
    // play game
    const durations = await game.play(events);
    const finish = Date.now();
  }

  chooseEvent(i, game, time, item) {
    switch(i){
      case 0:
        return new JumpEvent(game, time, item);
      case 1:
        return new IdleEvent(game, time, item);
      case 2:
        return new PickupEvent(game, time, item);
    }
  }
}
