export class Pipeline {

  constructor(cleaners) {
    this.cleaners = cleaners;
  }

  run(data) {
    return this.cleaners.reduce(
      (current, cleaner) => cleaner.clean(current),
      data
    );
  }

}
