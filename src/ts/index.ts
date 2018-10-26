import {Facade} from "./Facade";
import {Events} from "./events";

window.onload = () => {

  const gameLoop = () => {
    Facade.$.renderer.update(10)
    requestAnimationFrame(gameLoop)
  }

  Facade.$.on(Events.ASSETS_LOAD_COMPLETE, () => {
    console.log(Facade.$)
    gameLoop()
  })
}