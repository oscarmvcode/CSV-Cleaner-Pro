import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeNulls extends BaseCleaner {
  constructor() {
    super("normalizeNulls", "Normalizar nulos");
  }

  apply(data) {
    return data.map(row => {
      const clean = {};
      for (const k in row) {
        const v = row[k];
        clean[k] =
          v === "" || v === "null" || v === "NULL" ? null : v;
      }
      return clean;
    });
  }
}
