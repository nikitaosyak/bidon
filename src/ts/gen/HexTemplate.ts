
namespace gen {
  export enum Modifier { WALKABLE, NONWALKABLE }
  export class HexTemplate {

    public readonly id: string
    public readonly element: Element
    public readonly visualmarker: number
    public readonly modifier: Modifier

  }
}