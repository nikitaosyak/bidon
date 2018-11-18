
export enum LogTag {
  ASSETS,
  NETWORK,
  ERROR
}

export class Utils {

  static loadJSON(url) {
    return new Promise<any>((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.overrideMimeType('application/json')
      req.open('GET', url, true)
      req.onreadystatechange = () => {
        if (req.readyState === 2 || req.readyState === 3) return
        if (req.readyState === 4 && req.status === 200) {
          resolve(req.responseText)
        } else {
          reject()
        }
      }
      req.onerror = reject
      req.send(null)
    })
  }

  static getEnumOptions(E: any): number[] {
    const options = Object.keys(E)
    let len = options.length/2
    return options.splice(0, len).map(o => Number(o))
  }

  static getEnumKeys(E: any): string[] {
    const options = Object.keys(E)
    let len = options.length/2
    return options.splice(len)
  }

  private static randomPool = 'ABCDEFGHIJKLMNOPabcdefghijklmnop'
  static randomStr(len: number = 8): string {
    let result = ''
    for (let i = 0; i < len; i++)
      result += this.randomPool.charAt(Math.floor(
        Math.random() * this.randomPool.length
      ))

    return result
  }

  public static async logPromisedError(value: Response | any) : Promise<void> {
    if (value instanceof Response) {
      const json = await value.json()
      return Utils.log(LogTag.ERROR, `${value.status}: ${JSON.stringify(json)}`)
    }
    return Utils.log(LogTag.ERROR, value)
  }

  private static colors = {
    [LogTag.ASSETS]: 'background: #222; color: #bada55',
    [LogTag.NETWORK]: 'background: #2222AA; color: #E2E2E2'
  }
  private static prefix = {
    [LogTag.ASSETS]: 'ASSETS:',
    [LogTag.NETWORK]: 'NETWORK:'
  }
  public static log(tag : LogTag, content: any) {
    if (tag === LogTag.ERROR) {
      console.trace(content)
    } else {
      console.log(`%c ${this.prefix[tag]}${content} `, this.colors[tag])
    }
  }
}