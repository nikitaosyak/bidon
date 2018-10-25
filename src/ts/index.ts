import {Facade} from "./Facade";

window.onload = () => {

  Facade.$

  const gameLoop = () => {
    Facade.$.renderer.update(10)
    requestAnimationFrame(gameLoop)
  }

  gameLoop()
}