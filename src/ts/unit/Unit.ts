import {Mesh} from "three";
import {Action} from "./Action";
import {Visual} from "../mixins";
import {Coord} from "../grid/GridUtils";

export class Unit implements Visual {

  public location: Coord;
  private _behaviours: Action[]

  constructor(visual: Mesh, behaviours: Action[]) {
    this.setVisual(visual)
    this._behaviours = behaviours
  }

  visual: Mesh;
  setVisual(v: Mesh): void {}
}