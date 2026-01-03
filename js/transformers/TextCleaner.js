import { NullNormalizer } from './NullNormalizer.js';

export class TextCleaner {
  static clean(value) {
    const v = NullNormalizer.normalize(value);
    if (!v) return null;

    return v
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
