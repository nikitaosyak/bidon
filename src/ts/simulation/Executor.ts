import {Coord} from "../grid/GridUtils";
import {Unit} from "../unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Facade} from "../Facade";
import {BATTLE_FRACTIONS} from "../network/Battle";

export class Executor {

  public addUnit(at: Coord, fraction: number, visualise: boolean, propagate) {
    const u = new Unit(fraction, new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: BATTLE_FRACTIONS[fraction]})
    ), [])

    propagate && Facade.$.connection.battle.addUnits(at)
    Facade.$.simulation.grid.addUnit(u, at)

    if (visualise) {
      Facade.$.simulation.grid.redrawVisibility()
      Facade.$.simulation.grid.centerOnLocation(u.location)
    }
  }
}