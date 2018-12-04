import {Coord, GridUtils} from "../grid/GridUtils";
import {Unit} from "../unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Facade} from "../Facade";
import {BATTLE_FRACTIONS} from "../network/Battle";
import {TweenLite} from 'gsap'

export class Executor {

  public addUnit(at: Coord, fraction: number, visualise: boolean, propagate) {
    const u = new Unit(fraction, new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: BATTLE_FRACTIONS[fraction]})
    ))

    propagate && Facade.$.connection.battle.addUnits(at)
    Facade.$.simulation.grid.addUnit(u, at)

    if (visualise) {
      Facade.$.simulation.grid.redrawVisibility()
      Facade.$.simulation.grid.centerOnLocation(u.location)
    }
  }

  public moveUnit(at: Coord, path: Coord[], visualize: boolean, propagate: boolean) {
    console.log('moving along path: ', JSON.stringify(path))

    if (propagate) {
      Facade.$.connection.battle.moveUnit(at, path)
    }

    const grid = Facade.$.simulation.grid
    const unit = grid.getU(at)

    const goOneStep = (to: Coord) => {
     visualize && grid.centerOnLocationAnimated(to, 0.45)
     TweenLite.to(unit.visual.position, 0.5, Object.assign({
       onComplete: () => {
         grid.moveUnitInternal(unit, to)
         grid.deselectAll()
         grid.redrawVisibility()
         if (path.length > 0) {
           goOneStep(path.splice(0, 1)[0])
         } else {
           grid.deselectAll()
           grid.redrawVisibility()
         }
       }
     }, GridUtils.getSpaceFromCoord(to)))
    }
    grid.deselectAll()
    grid.redrawVisibility()
    goOneStep(path.splice(0, 1)[0])
  }
}