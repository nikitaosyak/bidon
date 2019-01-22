
export enum AppEvent {
  RESIZE,
}

export class Emitter {
  dict: object = {}
  constructor() {}

  on(event:any, callback:(...eventData:any[]) => void) {
    if (event in this.dict) {
      this.dict[event].push(callback)
    } else {
      this.dict[event] = [callback]
    }
  }

  clear(event:any) {
    if (event in this.dict) {
      delete this.dict[event]
    }
  }

  emit(event:any, ...eventData:any[]) {
    if (event in this.dict) {
      this.dict[event].forEach(callback => callback.apply(null, eventData))
    }
  }
}