import GLTFLoader = require('three-gltf-loader')

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
    console.log(this.cache)
  }

  private static load(alias, url) : Promise<void> {
    console.log(`loading ${alias} from ${url}..`)
    let Loader
    let assetExtractor
    const ext = url.match(/\..{3,4}$/)[0]
    switch(ext) {
      case '.gltf':
        Loader = GLTFLoader;
        assetExtractor = result => this.cache[alias] = result.scene.children[0]
        break;
    }

    return new Promise((resolve, reject) => {
      const l = new Loader()
      l.load(url, result => {
        console.log(`complete loading ${alias}`)
        assetExtractor(result)
        resolve()
      })
    })
  }
}