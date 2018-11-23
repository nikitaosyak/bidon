import {Connection} from "./Connection";
import {
  MatchmakerMatched,
  JoinMatch,
  Presence,
  Match,
  MatchPresenceEvent,
  LeaveMatch, MatchData, MatchDataSend
} from "@heroiclabs/nakama-js/dist/socket";
import {Utils} from "../utils/Utils";
import {NakamaEvent} from "./Realtime";
import {Rules} from "../simulation/Rules";
import {Emitter} from "../events";
import {Coord} from "../grid/GridUtils";
import {Facade} from "../Facade";

export class BattleData {
  public ticket: string
  public token: string
  public match_id: string
  public myQueue: number
}

export enum BattleState {
  OFFLINE,
  WAITING_FOR_JOIN,
  WAITING_FOR_ALL_PLAYERS,
  WAITING_FOR_MY_TURN,
  LEAVING_MATCH
}

export enum BattleEvent {
  JOINED,
  MY_TURN_STARTED,
  MY_TURN_ENDED,
  TURN_DATA,
  LEFT
}

export enum BattleOpCodes {
  ADD_UNIT = 1,
  MOVE_UNIT = 2
}

export const BATTLE_FRACTIONS = [
  0x2222CC, 0xCC2222, 0x22CC22, 0xCC22CC
]

export class Battle implements Emitter {

  private JOIN_MATCH: JoinMatch = {
    match_join: {
      match_id: undefined,
      token: undefined,
      metadata: undefined
    }
  }

  private LEAVE_MATCH: LeaveMatch = {
    match_leave: {
      match_id: undefined
    }
  }

  private MATCH_DATA: MatchDataSend = {
    match_data_send: {
      match_id: undefined,
      op_code: undefined,
      data: undefined,
      presence: undefined,
    }
  }

  private owner: Connection
  private _state: BattleState = BattleState.OFFLINE; public get state(): BattleState { return this._state }
  private _rules: Rules; public get rules(): Rules { return this._rules }
  private _data: BattleData; public get data(): BattleData { return this._data }
  private _players: Presence[]; public get players(): Presence[] { return this._players }

  constructor(owner: Connection) {
    this.owner = owner

    this.owner.realtime.on(NakamaEvent.onmatchpresence, (e: MatchPresenceEvent) => {
      if (e.match_id !== this.data.match_id) {console.error('match_id mismatch'); return}

      if ('joins' in e) {
        this._players = this._players.concat(e.joins)
      }

      if ('leaves' in e) {
        for (let i = this._players.length-1; i >= 0; --i) {
          e.leaves.forEach(leftee => {
            if (this._players[i].user_id !== leftee.user_id) return
            this._players.splice(i, 1)
          })
        }
      }

      console.log(`%ccurrent presence: ${JSON.stringify(this._players.map(p => p.username))}`, Utils.LOG_BATTLE)

      if (this._state === BattleState.WAITING_FOR_ALL_PLAYERS) {
        if (this._players.length === this.rules.players) {
          this.emit(BattleEvent.JOINED)
          if (this.data.myQueue === 0) {
            this.emit(BattleEvent.MY_TURN_STARTED)
          } else {
            // this.emit(BattleEvent.)
          }
        }
      } else {
        if (this._players.length < this.rules.minPlayers) {
          console.log(`%cwill abandon match, players left`, Utils.LOG_BATTLE)
          this.leaveMatch()
        }

        if (this._players.length > this.rules.players) {
          console.error('have more players than expected :(')
          this.leaveMatch()
        }
      }
    })

    this.owner.realtime.on(NakamaEvent.onmatchdata, (data: MatchData) => {
      const exec = Facade.$.executor
      const packet = data.data as any
      switch (data.op_code) {
        case BattleOpCodes.ADD_UNIT:
          exec.addUnit(
            Coord.fromSerialized(packet.position),
            1,
            false, false)
          break
        case BattleOpCodes.MOVE_UNIT:
          exec.moveUnit(
            Coord.fromSerialized(packet.at),
            Coord.fromSerializedArray(packet.path),
            false,
            false)
          this.emit(BattleEvent.MY_TURN_STARTED)
          break
      }
    })
  }

  public async join(rules:Rules, matched: MatchmakerMatched) {
    if (this.state !== BattleState.OFFLINE) {console.error('already inside another match!'); return}

    this._rules = rules
    this._state = BattleState.WAITING_FOR_JOIN

    this._data = new BattleData()
    this._data.ticket = matched.ticket
    this._data.token = matched.token

    console.log(`%cwill join match`, Utils.LOG_BATTLE)
    this.JOIN_MATCH.match_join.token = matched.token

    let result : any = await this.owner.realtime.sock.send(this.JOIN_MATCH)
    result = result.match as Match
    this._data.match_id = this.MATCH_DATA.match_data_send.match_id = result.match_id
    this._data.myQueue = result.presences.length
    this._players = result.presences.splice(0)
    this._state = BattleState.WAITING_FOR_ALL_PLAYERS
  }

  public leaveMatch() {
    this._state = BattleState.LEAVING_MATCH

    this.LEAVE_MATCH.match_leave.match_id = this._data.match_id
    this._state = BattleState.OFFLINE
    this._rules = null
    this._data = null
    this._players = null
    this.owner.realtime.sock.send(this.LEAVE_MATCH)

    this.emit(BattleEvent.LEFT)
  }

  public async addUnits(at: Coord) {
    this.MATCH_DATA.match_data_send.op_code = BattleOpCodes.ADD_UNIT
    this.MATCH_DATA.match_data_send.data = {fraction: this.data.myQueue, position: at.serialize()}
    this.owner.realtime.sock.send(this.MATCH_DATA)
  }

  public moveUnit(at: Coord, path: Coord[]) {
    this.MATCH_DATA.match_data_send.op_code = BattleOpCodes.MOVE_UNIT
    this.MATCH_DATA.match_data_send.data = {at: at.serialize(), path: Coord.serializeArray(path)}
    this.owner.realtime.sock.send(this.MATCH_DATA)
    this.emit(BattleEvent.MY_TURN_ENDED)
  }

  dict: object = {};
  clear(event: any): void {}
  emit(event: any, ...eventData: any[]): void {}
  on(event: any, callback: (...eventData: any[]) => void): void {}
}