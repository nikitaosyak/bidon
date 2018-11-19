import {Client} from "@heroiclabs/nakama-js";
import {Auth} from "./Auth";
import {Realtime} from "./Realtime";
import {MatchMaker} from "./MatchMaker";
import {Battle} from "./Battle";

export class Connection {

  private readonly _nakama: Client; public get nakama(): Client { return this._nakama }
  private _auth: Auth; public get auth() : Auth { return this._auth }
  private _realtime: Realtime; public get realtime(): Realtime { return this._realtime }
  private _matchmaker: MatchMaker; public get matchmaker(): MatchMaker { return this._matchmaker }
  private _battle: Battle; public get battle(): Battle { return this._battle }

  public get saveSession() { return false }

  constructor() {
    this._nakama = new Client(
      'defaultkey', 'nikitka.codes')

    this._auth = new Auth(this)
    this._realtime = new Realtime(this)
    this._matchmaker = new MatchMaker(this)
    this._battle = new Battle(this)
  }

  public authenticate() { return this._auth.connect() }
  public goRealtime() { return this._realtime.connect() }

  public send() {

  }
}