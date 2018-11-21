import {Connection} from "./Connection";
import {MatchmakerAdd, MatchmakerMatched, MatchmakerRemove} from "@heroiclabs/nakama-js/dist/socket";
import {Utils} from "../utils/Utils";
import {NakamaEvent} from "./Realtime";
import {Rules} from "../simulation/Rules";

export class MatchMaker {

  private owner: Connection
  private currentTicket: string = null
  private currentRules: Rules

  private REMOVE_FROM_QUEUE : MatchmakerRemove = { matchmaker_remove: { ticket: null } }
  private ADD_TO_QUEUE : MatchmakerAdd = {
    matchmaker_add: {
      min_count: 2,
      max_count: 2,
      query: '*',
      string_properties: new Map<string, string>(),
      numeric_properties: new Map<string, number>()
    }
  }


  constructor(owner: Connection) {
    this.owner = owner

    this.owner.realtime.on(NakamaEvent.onmatchmakermatched, (result: MatchmakerMatched) => {
      if (this.currentTicket == null) {console.error(`I don't have match ticket, yet i got matched`); return}
      if (this.currentTicket !== result.ticket) {console.error(`Ticket mismatch!`); return}

      this.owner.battle.join(this.currentRules, result)
    })
  }

  public setRules(rules: Rules) {
    this.currentRules = rules
    this.ADD_TO_QUEUE.matchmaker_add.min_count = rules.minPlayers
    this.ADD_TO_QUEUE.matchmaker_add.max_count = rules.players
  }

  public async findMatch() {
    const response = await this.owner.realtime.sock.send(this.ADD_TO_QUEUE)
    this.currentTicket = response['matchmaker_ticket'].ticket
    console.log(`%cgot ticket ${this.currentTicket}`, Utils.LOG_NETWORK)
  }

  public async cancelMatch() {
    if (this.currentTicket === null) {console.error('dont have ticket yet!' ); return}
    this.REMOVE_FROM_QUEUE.matchmaker_remove.ticket = this.currentTicket
    console.log(`%crejecting ticket ${this.currentTicket}`, Utils.LOG_NETWORK)
    this.currentTicket = null
    await this.owner.realtime.sock.send(this.REMOVE_FROM_QUEUE)
  }

}