export class NumberNormalizer {
  static normalize(value) {
    if (!value) return null;
    return Number(value.toString().replace(/[^0-9.-]/g, ""));
  }
}
