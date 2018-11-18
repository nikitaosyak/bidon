import {Client} from "@heroiclabs/nakama-js";
import {Auth} from "./Auth";
import {Realtime} from "./Realtime";

export class Connection {

  private readonly _nakama: Client; public get nakama(): Client { return this._nakama }
  private _auth: Auth; public get auth() : Auth { return this._auth }
  private socket: Realtime; public get sock(): Realtime { return this.socket }
  public get saveSession() { return false }

  constructor() {
    this._nakama = new Client(
      'defaultkey', 'nikitka.codes')

    this._auth = new Auth(this)
    this.socket = new Realtime(this)
  }

  public authenticate() { return this._auth.connect() }
  public goRealtime() { return this.socket.connect() }

  public send() {

  }
}