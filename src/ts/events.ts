
export enum Events {
  ASSETS_LOAD_COMPLETE,
  RESIZE
}

export class Emitter {
  dict: object
  constructor() {}


  on(event:Events, callback:(...eventData:any[]) => void) {
    if (event in this.dict) {
      this.dict[event].push(callback)
    } else {
      this.dict[event] = [callback]
    }
  }

  clear(event:Events) {
    if (event in this.dict) {
      delete this.dict[event]
    }
  }

  emit(event:Events, ...eventData:any[]) {
    if (event in this.dict) {
      this.dict[event].forEach(callback => callback.apply(null, eventData))
    }
  }
}