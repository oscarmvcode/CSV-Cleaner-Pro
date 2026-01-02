import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeHeaders extends BaseCleaner {
  constructor() {
    super("normalizeHeaders", "Normalizar encabezados");
  }

  apply(data) {
    return data.map(row => {
      const clean = {};
      for (const k in row) {
        const nk = k
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w]/g, "");
        clean[nk] = row[k];
      }
      return clean;
    });
  }
}
