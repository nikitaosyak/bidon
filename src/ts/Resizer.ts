import {Emitter, Events} from "./events";

export class Resizer implements Emitter {
  constructor() {
    this.emit(Events.RESIZE)
  }

  //
  // emitter mixin boilerplate
  dict: object = {};
  clear(event: Events): void {}
  emit(event: Events, ...eventData: any[]): void {}
  on(event: Events, callback: (...eventData: any[]) => void): void {}
}