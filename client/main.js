import {Player, Button, Item} from "./modules/component.js"
import {MoveEvent, PickupEvent, DropEvent} from "./modules/event.js"
import {Game} from "./game.js"
import {click, images, playerMove, playerPickup, playerImg, bg, objectImgs} from "./modules/assets.js"
const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");
// turn off antialiasing (do this if we use pixel art)
// ctx.imageSmoothingEnabled= false;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `64px "verdana", sans-serif`;
ctx.fillText("Title", 200, 100);
const play_button = new Button(ctx, 150, 175, 100, 50, "#DBCDF0", "start");


// intialize game
let game = new Game(1800, 300, 400, bg);
// add player
game.addPlayer = new Player(75, (300-200)*0.75, 125, 200, playerImg);
game.player.addMoveAnimation = playerMove;
game.player.addPickupAnimation = playerPickup;
// add objects
const item1 = new Item(300, 175, 84, 84, objectImgs[0]);
game.addItem = item1;
// add events
let events = [new MoveEvent(game, 5, 100),
  new PickupEvent(game, 0.5, item1),
  new MoveEvent(game, 10, 200),
  new DropEvent(game, 0.5, item1)];

async function handlePlay(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  if (play_button.is_on_button(mouse.x, mouse.y)) {
    canvas.removeEventListener('click', handlePlay);
    canvas.removeEventListener('mousemove', hover);
    // FOR TESTING
    const uid = 4010;
    const first = "jane";
    const last = "doe";
    // set game settings
    const res = await fetch(`http://localhost:3000/api/participants/${uid}`);
    // play game
    if (res.ok) {
      const data = await res.json();
      game.setAuto = data['auto'];
      const condition = data['auto'] ? 0 : 1;
      const durations = await game.play(events);
      console.log(JSON.stringify({
        uid: uid,
        first: first,
        last: last,
        condition: condition,
        durations: durations,
      }));

      // send participant info to server
      fetch('http://localhost:3000/api/participants', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          uid: uid,
          first: first,
          last: last,
          condition: condition,
          durations: durations,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            alert("Response failed to record");
            return;
          }
          console.log("Response recorded!")
        })
      return;
    }
    // participant has already done study
    alert("You've already participated!")
  }
}

function hover(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  play_button.is_on_button(mouse.x, mouse.y);
}

canvas.addEventListener('click', handlePlay);
canvas.addEventListener('mousemove', hover);
