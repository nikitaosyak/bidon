import {Renderer} from "./Renderer";
import {Resizer} from "./Resizer";
import {Emitter, Events} from "./events";
import {applyMixins} from "./mixins";
import {Utils} from "./utils/Utils";
import {CDB} from "./gen/CDB";

export class Facade implements Emitter {
  private static _instance: Facade
  private constructor() {

    applyMixins(Facade, [Emitter])
    applyMixins(Resizer, [Emitter])

    this._resizer = new Resizer()
    this._renderer = new Renderer()

    Utils.loadJSON('./gameData.cdb')
      .then(rawData => {
        this._cdb = new CDB(rawData)
        this.emit(Events.ASSETS_LOAD_COMPLETE)
      })
      .catch(e => {
        console.log('e?', e)
      })
  }

  public static get $() {
    return this._instance || (this._instance = new Facade())
  }

  private _cdb: CDB; get cdb() { return this._cdb }
  private readonly _renderer: Renderer; get renderer() { return this._renderer }
  private readonly _resizer: Resizer; get resizer() { return this._resizer }

  //
  // emitter mixin boilerplate
  dict: object = {};
  clear(event: Events): void {}
  emit(event: Events, ...eventData: any[]): void {}
  on(event: Events, callback: (...eventData: any[]) => void): void {}
}