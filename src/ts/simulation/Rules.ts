
export class Rules {

  private _players: number; public get players() { return this._players }
  private _minPlayers: number; public get minPlayers() { return this._minPlayers }
  private _gridWidth: number; public get gridWidth() { return this._gridWidth }
  private _gridHeight: number; public get gridHeight() { return this._gridHeight }
  private _seed: string; public get seed() { return this._seed }
  private _weights: number[]; public get weights() { return this._weights }

  public static fromJSON(source: any) {
    const rules = new Rules()
    rules._players = source.players
    rules._minPlayers = source.minPlayers
    rules._gridWidth = source.gridWidth
    rules._gridHeight = source.gridHeight
    rules._seed = source.seed
    rules._weights = source.weights

    return rules
  }
}