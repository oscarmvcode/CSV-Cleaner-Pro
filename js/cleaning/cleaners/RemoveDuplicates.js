import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveDuplicates extends BaseCleaner {
  constructor() {
    super("removeDuplicates", "Eliminar duplicados");
  }

  apply(data) {
    const seen = new Set();

    return data.filter(row => {
      const key = JSON.stringify(
        Object.values(row).map(v =>
          v === null || v === undefined ? "" : String(v).trim()
        )
      );

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
