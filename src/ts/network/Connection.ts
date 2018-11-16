import {Client} from "@heroiclabs/nakama-js";
import {Auth} from "./Auth";

export class Connection {

  private readonly _nakama: Client; public get nakama(): Client { return this._nakama }
  private auth: Auth
  private presenses
  public get saveSession() { return false }

  constructor() {
    this._nakama = new Client(
      'defaultkey', 'nikitka.codes')

    this.auth = new Auth(this)
  }

  public connect() { return this.auth.connect() }

  public send() {

  }
}