export class TextCleaner {
  static clean(value) {
    if (!value) return value;
    return value.toString().trim().toLowerCase();
  }
}
