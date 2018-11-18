import {Emitter, AppEvent} from "./events";
import {IUpdatable} from "./mixins";

export class Resizer implements Emitter, IUpdatable {

  private _width: number; public get width() { return this._width }
  private _height: number; public get height() { return this._height }
  private _ar: number; public get ar() { return this._ar }

  constructor() {

  }

  update(dt: number): void {
    const w = document.documentElement.clientWidth
    const h = document.documentElement.clientHeight

    if (this._width !== w || this._height !== h) {
      this._width = w; this._height = h
      this._ar = this._width / this._height
      this.emit(AppEvent.RESIZE)
    }
  }

  //
  // emitter mixin boilerplate
  dict: object = {};
  clear(event: any): void {}
  emit(event: any, ...eventData: any[]): void {}
  on(event: any, callback: (...eventData: any[]) => void): void {}
}