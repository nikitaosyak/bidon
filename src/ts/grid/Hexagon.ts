import {HexTemplate} from "../gen/HexTemplate";
import {Visual} from "../mixins";
import {Mesh, MeshPhongMaterial, MeshStandardMaterial, ShaderMaterial} from "three";
import {Assets} from "../utils/Assets";
import {Coord, GridUtils} from "./GridUtils";
import * as chroma from "chroma-js";

export enum HighlightMode {
  VISIBILITY,
  REACH,
  PATH
}

export class Hexagon implements Visual {

  private pos: Coord; public get location() { return this.pos }
  private _template: HexTemplate; public get template() { return this._template }
  private hiddenColor: string
  private visibleColor: string
  private reachColor: string
  private pathColor: string

  public visited: boolean = false
  public visible: boolean = false

  constructor(q: number, r: number, template:HexTemplate) {
    this.pos = new Coord(q, r)

    this._template = template
    this.hiddenColor = chroma.scale([this._template.visualMarker, '#222222']).mode('lab')(0.7).hex()
    this.visibleColor = chroma(this._template.visualMarker).hex()
    this.reachColor = chroma.scale([this._template.visualMarker, '#00FF00']).mode('lab')(0.5).hex()
    this.pathColor = chroma.scale([this._template.visualMarker, '#FFFFFF']).mode('lab')(0.7).hex()

    const meshTemplate = Assets.getAsset<Mesh>('hex')
    this.setVisual(new Mesh(meshTemplate.geometry.clone(), new MeshStandardMaterial({
      color: this.hiddenColor, metalness: 0.2, emissiveIntensity: 0, emissive: 0x22FF22
    })))

    GridUtils.setSpaceFromCoord(this.visual.position, this.pos)
    this.visual.rotateY(-GridUtils.spaceAngleFromCoord(this.pos))

  }

  public highlight(mode: HighlightMode): void {
    switch (mode) {
      case HighlightMode.VISIBILITY:
        this.visible = true
        this.visual.material['color'].set(this.visibleColor)
        break
      case HighlightMode.REACH:
        // this.visual.material['emissiveIntensity'] = 0.1
        this.visual.material['color'].set(this.reachColor)
        break
      case HighlightMode.PATH:
        // this.visual.material['emissiveIntensity'] = 0.2
        this.visual.material['color'].set(this.pathColor)
        break
    }
    this.visited = true
    // this.visual.material['lights'].set(lights)
  }

  public clearState():void {
    this.visible = false
    this.visited = false
    this.visual.material['color'].set(this.hiddenColor)
    // this.visual.material['emissiveIntensity'] = 0
  }

  visual: Mesh;
  setVisual(v: Mesh) {}
}
