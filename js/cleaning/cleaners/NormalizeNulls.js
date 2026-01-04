// cleaners/NormalizeNulls.js
import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeNulls extends BaseCleaner {
  run(rows) {
    if (!Array.isArray(rows)) return rows;

    const NULLS = new Set(["", "null", "nan", "undefined", "n/a", "none"]);

    return rows.map(row => {
      const clean = { ...row };

      Object.keys(clean).forEach(k => {
        const v = clean[k];
        if (v == null) clean[k] = null;
        else if (typeof v === "string" && NULLS.has(v.trim().toLowerCase())) {
          clean[k] = null;
        }
      });

      return clean;
    });
  }
}
