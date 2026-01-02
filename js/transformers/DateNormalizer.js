export class DateNormalizer {
  static normalize(value) {
    const d = new Date(value);
    return isNaN(d) ? null : d.toISOString().split("T")[0];
  }
}
