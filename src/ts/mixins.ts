import {Mesh, Object3D} from "three";

export function applyMixins(target: any, mixins: any[]):void {
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      target.prototype[name] = mixin.prototype[name];
    });
  });
}

export class Visual {
  visual: Mesh
  setVisual(v: Mesh) {
    this.visual = v
  }
}

export interface IUpdatable { update(dt: number): void }