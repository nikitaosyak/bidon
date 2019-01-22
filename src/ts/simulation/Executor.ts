import {Coord, GridUtils} from "../grid/GridUtils";
import {Unit} from "../unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Facade} from "../Facade";
import {FRACTION_COLOR} from "../network/Battle";
import {TweenLite} from 'gsap'
import {Utils} from "../utils/Utils";

export class Executor {

  public addUnit(at: Coord, faction: number, visualise: boolean, propagate) {
    console.log(`%cadd unit of f[${faction}] at ${at}`, Utils.LOG_EXECUTOR)
    const u = new Unit(faction, new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: FRACTION_COLOR[faction]})
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
    const unit = grid.getUnitAt(at)

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