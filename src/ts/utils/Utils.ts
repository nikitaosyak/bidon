
export class Utils {

  static loadJSON(url) {
    return new Promise<string>((resolve, reject) => {
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
      req.send(null)
    })
  }

  static getEnumOptions(E: any): number[] {
    return Object.keys(E)
      .filter(k => typeof E[k] !== 'number')
      .map(v => Number(v))
  }

  static getEnumOptionsStr(E: any): string[] {
    return Object.keys(E)
      .filter(k => typeof E[k] === 'number')
  }
}