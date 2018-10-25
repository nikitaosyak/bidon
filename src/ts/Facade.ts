import {Renderer} from "./Renderer";
import {Resizer} from "./Resizer";
import {Emitter, Events} from "./events";
import {applyMixins} from "./mixins";

export class Facade {
  private static _instance: Facade
  private constructor() {

    applyMixins(Resizer, [Emitter])

    this._resizer = new Resizer()
    this._renderer = new Renderer()
  }

  public static get $() {
    return this._instance || (this._instance = new Facade())
  }

  private readonly _renderer: Renderer; get renderer() { return this._renderer }
  private readonly _resizer: Resizer; get resizer() { return this._resizer }
}