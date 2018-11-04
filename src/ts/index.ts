import {Facade} from "./Facade";
import {Events} from "./events";
import {Grid} from "./grid/Grid";
import Stats = require('Stats.js')

window.onload = () => {

  const stats = new Stats()
  stats.showPanel(0)
  document.body.appendChild(stats.dom)

  const gameLoop = () => {
    stats.begin()

    Facade.$.update(10)

    stats.end()
    requestAnimationFrame(gameLoop)
  }

  Facade.$.on(Events.ASSETS_LOAD_COMPLETE, () => {
    gameLoop()
    new Grid(12, 8)
  })
}