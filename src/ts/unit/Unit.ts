import {Object3D} from "three";
import {Action} from "./Action";
import {Visual} from "../mixins";
import {Coord} from "../grid/GridUtils";

export class Unit implements Visual {

  public location: Coord;
  private _behaviours: Action[]

  constructor(visual: Object3D, behaviours: Action[]) {
    this.setVisual(visual)
    this._behaviours = behaviours
  }

  visual: Object3D;
  setVisual(v: Object3D): void {}
}