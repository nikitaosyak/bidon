
export function applyMixins(target: any, mixins: any[]):void {
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      target.prototype[name] = mixin.prototype[name];
    });
  });
}