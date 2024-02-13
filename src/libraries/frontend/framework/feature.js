// I guess this isn't overkill if I also incorporate
// feature flags into this class (?)

/**
 * @example
 * const feature = new Feature({
 *    featurePath: '.indexedDB',
 *    supportMap: new Map([
 *      ['chrome', 23],
 *      ['firefox', 16],
 *      ['safari', 10],
 *    ]),
 * });
 * console.log(feature.name); // globalThis.indexedDB
 * console.log(feature.hasSupport); // true
 */
export class Feature {
  constructor({ featurePath, supportMap = new Map() }) {
    this.featurePath = featurePath;
    this.supportMap = supportMap;
  }

  get name() {
    return "globalThis" + this.featurePath;
  }

  get hasSupport() {
    return Boolean(globalThis[this.featurePath.slice(1)]);
  }
}

/**
 * @example
 * const featureSet = new FeatureSet([
 *   new Feature({
 *    featurePath: '.indexedDB',
 *    supportMap: new Map([
 *      ['chrome', 23],
 *      ['firefox', 16],
 *      ['safari', 10],
 *    ]),
 *  }),
 *  new Feature({
 *   featurePath: '.fetch',
 *   supportMap: new Map([
 *     ['chrome', 42],
 *     ['firefox', 39],
 *     ['safari', 10],
 *   ]),
 * }),
 * ]);
 * console.log(featureSet.hasSupport); // true
 * console.log(featureSet.requirements); // Map(3) { 'chrome' => 42, 'firefox' => 39, 'safari' => 10 }
 */
export class FeatureSet {
  constructor(features) {
    this.features = new Map();

    for (const feature of features) {
      this.features.set(feature.name, feature);
    }
  }

  get hasSupport() {
    return this.features.every((feature) => feature.hasSupport);
  }

  get requirements() {
    const result = new Map();

    for (const [, { supportMap }] of this.features) {
      for (const [platform, version] of supportMap) {
        result.set(platform, Math.max(result.get(platform) ?? 0, version));
      }
    }

    return result;
  }
}
