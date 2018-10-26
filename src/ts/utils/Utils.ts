
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
}