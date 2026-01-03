import { NullNormalizer } from './NullNormalizer.js';

export class DateNormalizer {
  static normalize(value) {
    const v = NullNormalizer.normalize(value);
    if (!v) return null;

    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
}
