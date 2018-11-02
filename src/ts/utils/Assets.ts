import GLTFLoader = require('three-gltf-loader')

export class Assets {

  private static _cache = {}

  public static getAsset<TAsset>(alias: string) { return this._cache[alias] as TAsset }

  public static load(alias, url) {
    console.log(alias, url)
    let Loader
    let assetExtractor
    const ext = url.match(/\..{3,4}$/)[0]
    switch(ext) {
      case '.gltf':
        Loader = GLTFLoader;
        assetExtractor = result => this._cache[alias] = result.scene.children[0]
        break;
    }

    return new Promise((resolve, reject) => {
      const l = new Loader()
      l.load(url, result => {
        console.log(alias, url, result)
        assetExtractor(result)
        resolve()
      })
    })
  }
}