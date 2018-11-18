import {Object3D} from "three";

export function applyMixins(target: any, mixins: any[]):void {
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      target.prototype[name] = mixin.prototype[name];
    });
  });
}

export class Visual {
  visual: Object3D
  setVisual(v: Object3D) {
    this.visual = v
    this.visual['self'] = this
  }
}

export interface IUpdatable { update(dt: number): void }