import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeHeaders extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    return data.map(row => {
      const clean = {};
      Object.keys(row).forEach(key => {
        if (!key) return;
        const nk = String(key)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w]/g, "");
        clean[nk] = row[key];
      });
      return clean;
    });
  }
}
