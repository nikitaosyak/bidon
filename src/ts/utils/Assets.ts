import GLTFLoader = require('three-gltf-loader');
import {Utils} from "./Utils";
import {TextureLoader} from "three";

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

      console.log(`%cloading ${alias} from ${url}..`, Utils.LOG_ASSETS)
      let Loader
      let assetExtractor
      const onLoad = result => {
        console.log(`%ccomplete loading ${alias}`, Utils.LOG_ASSETS)
        assetExtractor(result)
        resolve()
      }
      const ext = url.match(/\..{3,4}$/)[0]
      switch(ext) {
        case '.gltf':
          Loader = GLTFLoader;
          assetExtractor = result => this.cache[alias] = result.scene.children[0]
          break;
        case '.png':
          Loader = TextureLoader;
          assetExtractor = texture => this.cache[alias] = texture
      }

      const l = new Loader()
      try { l.load(url, onLoad, undefined, reject) } catch (e) { reject(e) }
    })
  }
}