import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeNulls extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    return data.map(row => {
      const clean = {};
      Object.keys(row).forEach(key => {
        const v = row[key];
        clean[key] =
          v === "" ||
          v === " " ||
          v === "null" ||
          v === "NULL" ||
          v === "NaN" ||
          v === "N/A" ||
          (typeof v === "number" && isNaN(v))
            ? null
            : v;
      });
      return clean;
    });
  }
}
