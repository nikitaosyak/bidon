import {Euler, Object3D} from "three";

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
    // this.visual.rotation.copy(new Euler(0, 0, -Math.PI/2))
  }
}

export class VisualHex extends Visual {
  setVisual(v: Object3D) {
    super.setVisual(v)
    // v.rotation.copy(new Euler(0, 0, -Math.PI/2))
  }
}

export interface IUpdatable { update(dt: number): void }