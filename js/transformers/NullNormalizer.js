export class NullNormalizer {
  static normalize(value) {
    if (value === undefined || value === null) return null;

    const v = String(value).trim().toLowerCase();

    if (v === '' || v === 'null' || v === 'nan' || v === 'n/a') {
      return null;
    }

    return value;
  }
}
