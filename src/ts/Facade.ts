import {Emitter, AppEvent} from "./events";
import {applyMixins, IUpdatable, Visual} from "./mixins";
import {Utils} from "./utils/Utils";
import {CDB} from "./gen/CDB";
import {Assets} from "./utils/Assets";
import {Hexagon} from "./grid/Hexagon";
import {Unit} from "./unit/Unit";
import {Connection} from "./network/Connection";
import {Realtime} from "./network/Realtime";
import {Battle} from "./network/Battle";
import {Grid} from "./grid/Grid";
import {GridInput} from "./grid/GridInput";
import {Executor} from "./simulation/Executor";
import {Resizer} from "./render/Resizer";
import {Renderer} from "./render/Renderer";

export interface Simulation {
  grid: Grid,
  input: GridInput
}

export class Facade implements Emitter, IUpdatable {
  private static _instance: Facade
  private constructor() {

    applyMixins(Facade, [Emitter])
    applyMixins(Resizer, [Emitter])
    applyMixins(Realtime, [Emitter])
    applyMixins(Battle, [Emitter])
    applyMixins(Hexagon, [Visual])
    applyMixins(Unit, [Visual])

    this._connection = new Connection()
    this._resizer = new Resizer()
    this._renderer = new Renderer()
    this._executor = new Executor()

    this._resizer.on(AppEvent.RESIZE, () => {
      this._renderer.resize(this._resizer)
    })
  }

  public static eloop: Emitter = new Emitter()

  public static get $() {
    return this._instance || (this._instance = new Facade())
  }

  public injectCDBData(rawData: string) { this._cdb = new CDB(rawData) }
  private _cdb: CDB; get cdb() { return this._cdb }

  private readonly _renderer: Renderer; get renderer() { return this._renderer }
  private readonly _resizer: Resizer; get resizer() { return this._resizer }
  private readonly _connection: Connection; get connection() { return this._connection }
  private readonly _executor: Executor; get executor() { return this._executor }

  public simulation : Simulation = {
    grid: undefined,
    input: undefined
  }

  public startNewSimulation() {
    this.simulation.grid = new Grid(Facade.$.connection.battle.rules)
    this.simulation.input = new GridInput(this.simulation.grid)
  }

  public update(dt:number): void {
    this._resizer.update(dt)
    this._renderer.update(dt)
  }

  //
  // emitter mixin boilerplate
  dict: object = {};
  clear(event: any): void {}
  emit(event: any, ...eventData: any[]): void {}
  on(event: any, callback: (...eventData: any[]) => void): void {}
}