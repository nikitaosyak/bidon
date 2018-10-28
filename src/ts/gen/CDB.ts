import {CDBID} from "./base";
import {UnitTemplate} from "./UnitTemplate";
import {HexTemplate} from "./HexTemplate";

export class CDB {
  public readonly data:any
  
  private unitTemplateStorage : object = {}
  private hexTemplateStorage : object = {}

  private createUnitTemplate(json: any):UnitTemplate { return new UnitTemplate(json) }
  private createHexTemplate(json: any):HexTemplate { return new HexTemplate(json) }

  public getUnitTemplate(key: CDBID): UnitTemplate { return this.unitTemplateStorage[key] }
  public getHexTemplate(key: CDBID): HexTemplate { return this.hexTemplateStorage[key] }
  
  // ctor
  constructor(rawData:string) {
    this.data = JSON.parse(rawData)
    
    this.data.sheets.forEach(sheet => {
      const storage = this[`${sheet.name[0].toLowerCase()}${sheet.name.slice(1)}Storage`]
      sheet.lines.forEach(line => {
        storage[line.id] = this[`create${sheet.name}`](line)
      })
    })
  }
}
