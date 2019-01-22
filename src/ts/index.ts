import {Facade} from "./Facade";
import {AppEvent} from "./events";
import {Grid} from "./grid/Grid";
import Stats = require('Stats.js')
import {Utils} from "./utils/Utils";
import {Rules} from "./simulation/Rules";
import {FRACTION_COLOR, BattleEvent} from "./network/Battle";
import {CDB} from "./gen/CDB";
import {Assets} from "./utils/Assets";

window.onload = () => {

  const stats = new Stats()             // MACRO: prod-cutout
  stats.showPanel(0)                    // MACRO: prod-cutout
  document.body.appendChild(stats.dom)  // MACRO: prod-cutout

  const startGame = () => {
    Facade.$.connection.battle.on(BattleEvent.JOINED, e => {
      Facade.$.startNewSimulation()

      Facade.$.executor.addUnit(
        Facade.$.simulation.grid.respawns[Facade.$.connection.battle.faction],
        Facade.$.connection.battle.faction,
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
  Utils.loadJSON('./gameData.cdb')
    .then(rawData => {
      Assets.add('hex', 'assets/hex/hex.gltf')
      Assets.add('ui_attack', 'assets/ui/attack.png')
      Assets.add('ui_cancel', 'assets/ui/cancel.png')
      Assets.add('ui_walk', 'assets/ui/walk.png')
        .loadAll().then(() => {
        Utils.loadJSON('./rules.json').then(rulesRaw => {
          const rules = Rules.fromJSON(JSON.parse(rulesRaw))
          console.log(rules)

          Facade.$.injectCDBData(rawData)
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
    })
    .catch(Utils.logPromisedError)
}