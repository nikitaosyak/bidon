import {Facade} from "./Facade";
import {Events} from "./events";
import {Grid} from "./grid/Grid";

window.onload = () => {

  const gameLoop = () => {
    Facade.$.update(10)
    requestAnimationFrame(gameLoop)
  }

  Facade.$.on(Events.ASSETS_LOAD_COMPLETE, () => {
    gameLoop()
    new Grid(12, 8)
  })
}