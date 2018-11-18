import GLTFLoader = require('three-gltf-loader');
import {LogTag, Utils} from "./Utils";

export class Assets {

  private static cache = {}
  private static queue = []

  public static getAsset<TAsset>(alias: string) { return this.cache[alias] as TAsset }

  public static add(alias, url) {
    this.queue.push({
      alias: alias,
      url: url
    })
    return this
  }

  public static async loadAll() : Promise<void> {
    while (this.queue.length > 0) {
      const item = this.queue.shift()
      await this.load(item.alias, item.url)
    }
  }

  private static load(alias, url) : Promise<void> {
    return new Promise((resolve, reject) => {

      Utils.log(LogTag.ASSETS, `loading ${alias} from ${url}..`)
      let Loader
      let assetExtractor
      let args = []
      let callFunction = ''
      const ext = url.match(/\..{3,4}$/)[0]
      switch(ext) {
        case '.gltf':
          Loader = GLTFLoader;
          assetExtractor = result => this.cache[alias] = result.scene.children[0]
          callFunction = 'load'
          args = [
            url,
            result => {
              Utils.log(LogTag.ASSETS, `complete loading ${alias}`)
              assetExtractor(result)
              resolve()
            },
            progress => {},
            error => reject
            ]
          break;
      }

      const l = new Loader()
      try { l[callFunction](...args) } catch (e) { reject(e) }
    })
  }
}