import {Connection} from "./Connection";
import {MatchmakerMatched, JoinMatch, Presence, Match, MatchPresenceEvent} from "@heroiclabs/nakama-js/dist/socket";
import {Utils} from "../utils/Utils";
import {NakamaEvent} from "./Realtime";

export class BattleData {
  public ticket: string
  public token: string
  public match_id: string
  public users: {user_id: string, username: string}[]
}

export enum BattleState {
  OFFLINE,
  WAITING_FOR_JOIN,
  WAITING_FOR_AUTHORITATIVE_DATA,
}

export class Battle {

  private JOIN_MATCH: JoinMatch = {
    match_join: {
      match_id: undefined,
      token: undefined,
      metadata: undefined
    }
  }

  private owner: Connection
  private _state: BattleState = BattleState.OFFLINE; public get state(): BattleState { return this._state }
  private _data: BattleData; public get data(): BattleData { return this._data }

  constructor(owner: Connection) {
    this.owner = owner

    this.owner.realtime.on(NakamaEvent.onmatchpresence, (e: MatchPresenceEvent) => {
      // console.log(e)
    })
  }

  public async join(matched: MatchmakerMatched) {
    if (this.state !== BattleState.OFFLINE) {console.error('already inside another match!'); return}

    this._state = BattleState.WAITING_FOR_JOIN

    this._data = new BattleData()
    this._data.ticket = matched.ticket
    this._data.token = matched.token
    this._data.users = matched.users.map(v => (<any>v).presence as Presence) //TODO: bug patch

    console.log(`%cwill join match`, Utils.LOG_BATTLE)
    this.JOIN_MATCH.match_join.token = matched.token

    let result : any = await this.owner.realtime.sock.send(this.JOIN_MATCH)
    result = result.match as Match
    this._data.match_id = result.match_id
    this._state = BattleState.WAITING_FOR_AUTHORITATIVE_DATA
  }
}