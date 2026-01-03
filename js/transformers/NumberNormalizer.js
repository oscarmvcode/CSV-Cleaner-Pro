import { NullNormalizer } from './NullNormalizer.js';

export class NumberNormalizer {
  static age(value) {
    const v = NullNormalizer.normalize(value);
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0) return null;
    return n;
  }

  static money(value) {
    const v = NullNormalizer.normalize(value);
    const n = Number(v);
    return isNaN(n) ? null : Number(n.toFixed(2));
  }
}
