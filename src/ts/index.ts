import {Facade} from "./Facade";
import {Events} from "./events";
import {Grid} from "./grid/Grid";
import Stats = require('Stats.js')
import {GridInput} from "./grid/GridInput";      // MACRO: prod-cutout

window.onload = () => {

  const stats = new Stats()             // MACRO: prod-cutout
  stats.showPanel(0)                    // MACRO: prod-cutout
  document.body.appendChild(stats.dom)  // MACRO: prod-cutout

  const gameLoop = () => {
    stats.begin()                       // MACRO: prod-cutout
    Facade.$.update(10)
    stats.end()                         // MACRO: prod-cutout
    requestAnimationFrame(gameLoop)
  }

  Facade.$.on(Events.ASSETS_LOAD_COMPLETE, () => {
    gameLoop()
    const grid = new Grid(15, 9)
    const input = new GridInput(grid)
  })
}