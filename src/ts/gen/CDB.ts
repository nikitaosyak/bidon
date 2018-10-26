
export module gen {
  export class CDB {
    public readonly data:object
    
    // fields
    
    // ctor
    constructor(rawData:string) {
      this.data = JSON.parse(rawData)
    }
  }
}