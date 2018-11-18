import {Facade} from "./Facade";
import {Events} from "./events";
import {Grid} from "./grid/Grid";
import Stats = require('Stats.js')
import {GridInput} from "./grid/GridInput";
import {Unit} from "./unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Coord} from "./grid/GridUtils";
import {Utils} from "./utils/Utils";

window.onload = () => {

  const stats = new Stats()             // MACRO: prod-cutout
  stats.showPanel(0)                    // MACRO: prod-cutout
  document.body.appendChild(stats.dom)  // MACRO: prod-cutout


  const startGame = () => {
    const grid = new Grid(15, 9)
    const input = new GridInput(grid)
    const u = new Unit(new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: 0x2222CC})
    ), [])
    const u1 = new Unit(new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: 0x2222CC})
    ), [])

    grid.addUnit(u, new Coord(1, 2))
    grid.addUnit(u1, new Coord(0, 5))
    grid.redrawVisibility()

    const gameLoop = () => {
      stats.begin()                       // MACRO: prod-cutout
      Facade.$.update(10)
      stats.end()                         // MACRO: prod-cutout
      requestAnimationFrame(gameLoop)
    }
    gameLoop()
  }

  Facade.$.on(Events.ASSETS_LOAD_COMPLETE, () => {
    Facade.$.connection.connect()
      .then(() => {
        startGame()
      })
      .catch(Utils.logPromisedError)
  })
}