import {Facade} from "./Facade";
import {AppEvent} from "./events";
import {Grid} from "./grid/Grid";
import Stats = require('Stats.js')
import {GridInput} from "./grid/GridInput";
import {Unit} from "./unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Coord} from "./grid/GridUtils";
import {Utils} from "./utils/Utils";
import {Rules} from "./simulation/Rules";
import {BattleEvent} from "./network/Battle";

window.onload = () => {

  const stats = new Stats()             // MACRO: prod-cutout
  stats.showPanel(0)                    // MACRO: prod-cutout
  document.body.appendChild(stats.dom)  // MACRO: prod-cutout

  const matchmake = () => {

  }

  const startGame = () => {
    Facade.$.connection.battle.on(BattleEvent.JOINED, e => {
      const grid = new Grid(Facade.$.connection.battle.rules)
      const input = new GridInput(grid)
      const u = new Unit(new Mesh(
        new SphereBufferGeometry(0.7, 8, 8),
        new MeshBasicMaterial({color: 0x2222CC})
      ), [])
      const u1 = new Unit(new Mesh(
        new SphereBufferGeometry(0.7, 8, 8),
        new MeshBasicMaterial({color: 0x2222CC})
      ), [])

      const start = grid.respawns[Facade.$.connection.battle.data.myQueue]
      grid.addUnit(u, start)
      // grid.addUnit(u1, new Coord(0, 5))
      grid.redrawVisibility()

      const gameLoop = () => {
        stats.begin()                       // MACRO: prod-cutout
        Facade.$.update(10)
        stats.end()                         // MACRO: prod-cutout
        requestAnimationFrame(gameLoop)
      }
      gameLoop()
    })
  }

  // show asset loading here
  Facade.$.on(AppEvent.ASSETS_LOAD_COMPLETE, () => {
    // show UI here

    Utils.loadJSON('./rules.json').then(rulesRaw => {
      const rules = Rules.fromJSON(JSON.parse(rulesRaw))
      console.log(rules)
      Facade.$.connection.matchmaker.setRules(rules)
      Facade.$.connection.auth.connect()
        .then(Facade.$.connection.realtime.connect.bind(Facade.$.connection.realtime))
        .then(Facade.$.connection.matchmaker.findMatch.bind(Facade.$.connection.matchmaker))
        .then(startGame)
        .catch(e => {
          Utils.logPromisedError(e)
        })
    })
  })
}