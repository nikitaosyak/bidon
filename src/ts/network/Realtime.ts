import {Connection} from "./Connection";
import {Socket} from "@heroiclabs/nakama-js/dist/socket";
import {Emitter} from "../events";

export const NakamaEvent = {
  ondisconnect: 'ondisconnect',               // data: CloseEvent
  // onnotification: 'onnotification',           // data:
  // onchannelpresence: 'onchannelpresence',     // data:
  // onchannelmessage: 'onchannelmessage',       // data:
  onmatchdata: 'onmatchdata',                 // data:
  onmatchpresence: 'onmatchpresence',         // data:
  onmatchmakermatched: 'onmatchmakermatched', // data:
  // onstatuspresence: 'onstatuspresence',       // data:
  // onstreampresence: 'onstreampresence',       // data:
  // onstreamdata: 'onstreamdata'                // data:
}

export class Realtime implements Emitter {

  private owner: Connection
  private socket: Socket

  constructor(owner: Connection) {
    this.owner = owner
  }

  public connect() {
    this.socket = this.owner.nakama.createSocket(this.owner.nakama.useSSL, true)

    Object.keys(NakamaEvent).forEach(event => {
      this.socket[event] = data => this.emit(event, data)
    })

    return this.socket.connect(this.owner.auth.session, false)
  }

  dict: object = {};
  clear(event: any): void {}
  emit(event: any, ...eventData: any[]): void {}
  on(event: any, callback: (...eventData: any[]) => void): void {}
}