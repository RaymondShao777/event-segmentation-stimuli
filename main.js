import {Button} from "./modules/component.js"
import {start_game} from "./game.js"

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = `64px "verdana", sans-serif`;
ctx.fillText("Title", 200, 100);
const play_button = new Button(ctx, 150, 175, 100, 50, "#DBCDF0", "start");

function handle_play(e) {
  const rect = this.getBoundingClientRect();
  const mouse = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  if (play_button.is_on_button(mouse.x, mouse.y)) {
    canvas.removeEventListener('click', handle_play);
    canvas.removeEventListener('mousemove', hover);
    start_game();
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

canvas.addEventListener('click', handle_play);
canvas.addEventListener('mousemove', hover);
