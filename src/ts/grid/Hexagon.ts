import {HexTemplate} from "../gen/HexTemplate";
import {Visual} from "../mixins";
import {Mesh, MeshPhongMaterial, MeshStandardMaterial, ShaderMaterial} from "three";
import {Assets} from "../utils/Assets";
import {Coord, GridUtils} from "./GridUtils";
import tinycolor = require('tinycolor2')

export enum HighlightMode {
  VISIBILITY,
  REACH,
  PATH
}

export class Hexagon implements Visual {

  private pos: Coord; public get location() { return this.pos }
  private _template: HexTemplate; public get template() { return this._template }
  private originalColor: tinycolorInstance

  public visited: boolean = false
  public visible: boolean = false

  constructor(q: number, r: number, template:HexTemplate) {
    this.pos = new Coord(q, r)

    this._template = template
    this.originalColor = tinycolor(this._template.visualMarker).darken(30)

    const meshTemplate = Assets.getAsset<Mesh>('hex')
    this.setVisual(new Mesh(meshTemplate.geometry.clone(), new MeshStandardMaterial({
      color: this.originalColor.toHexString(), metalness: 0.1, emissiveIntensity: 0, emissive: 0x22FF22
    })))

    GridUtils.setSpaceFromCoord(this.visual.position, this.pos)
    this.visual.rotateY(-GridUtils.spaceAngleFromCoord(this.pos))

  }

  public highlight(mode: HighlightMode): void {
    switch (mode) {
      case HighlightMode.VISIBILITY:
        this.visible = true
        this.visual.material['color'].set(this.originalColor.clone().lighten(30).toHexString())
        break
      case HighlightMode.REACH:
        this.visual.material['emissiveIntensity'] = 0.15
        break
      case HighlightMode.PATH:
        this.visual.material['emissiveIntensity'] = 0.3
        break
    }
    this.visited = true
    // this.visual.material['lights'].set(lights)
  }

  public clearState():void {
    this.visible = false
    this.visited = false
    this.visual.material['color'].set(this.originalColor.toHexString())
    this.visual.material['emissiveIntensity'] = 0
  }

  visual: Mesh;
  setVisual(v: Mesh) {}
}
