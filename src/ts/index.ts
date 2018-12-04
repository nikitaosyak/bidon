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
import {BATTLE_FRACTIONS, BattleEvent} from "./network/Battle";

window.onload = () => {

  const stats = new Stats()             // MACRO: prod-cutout
  stats.showPanel(0)                    // MACRO: prod-cutout
  document.body.appendChild(stats.dom)  // MACRO: prod-cutout

  const matchmake = () => {


  }

  const startGame = () => {
    Facade.$.connection.battle.on(BattleEvent.JOINED, e => {
      Facade.$.startNewSimulation()

      Facade.$.executor.addUnit(
        Facade.$.simulation.grid.respawns[Facade.$.connection.battle.data.myQueue],
        0,
        true,
        true
      )

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