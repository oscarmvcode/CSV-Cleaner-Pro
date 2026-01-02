export class BaseCleaner {
  constructor(key, label) {
    this.key = key;
    this.label = label;
  }

  apply(data) {
    throw new Error("apply() debe implementarse");
  }
}
