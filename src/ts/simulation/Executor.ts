import {Coord} from "../grid/GridUtils";
import {Unit} from "../unit/Unit";
import {Mesh, MeshBasicMaterial, SphereBufferGeometry} from "three";
import {Facade} from "../Facade";

export class Executor {

  public addUnit(at: Coord, fraction: number, visualise: boolean, propagate) {
    const u = new Unit(new Mesh(
      new SphereBufferGeometry(0.7, 8, 8),
      new MeshBasicMaterial({color: fraction})
    ), [])

    propagate && Facade.$.connection.battle.addUnits(at)
    Facade.$.simulation.grid.addUnit(u, at)

    if (visualise) {
      Facade.$.simulation.grid.redrawVisibility()
      Facade.$.simulation.grid.centerOnLocation(u.location)
    }
  }
}