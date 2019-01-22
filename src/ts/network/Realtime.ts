import {Connection} from "./Connection";
import {Socket} from "@heroiclabs/nakama-js/dist/socket";
import {Emitter} from "../events";
import {Utils} from "../utils/Utils";

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
  private _sock: Socket; public get sock(): Socket { return this._sock }

  constructor(owner: Connection) {
    this.owner = owner
  }

  public connect() {
    console.log('%ccreating websocket connection', Utils.LOG_NETWORK)
    this._sock = this.owner.nakama.createSocket(this.owner.nakama.useSSL, false)

    Object.keys(NakamaEvent).forEach(event => {
      this._sock[event] = data => this.emit(event, data)
    })

    return this._sock.connect(this.owner.auth.session, false)
  }

  dict: object = {};
  clear(event: any): void {}
  emit(event: any, ...eventData: any[]): void {}
  on(event: any, callback: (...eventData: any[]) => void): void {}
}