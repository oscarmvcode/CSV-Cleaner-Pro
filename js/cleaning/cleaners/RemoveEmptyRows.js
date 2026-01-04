// cleaners/RemoveEmptyRows.js
import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveEmptyRows extends BaseCleaner {

  run(data) {
    if (!Array.isArray(data)) return data;

    return data.filter(row => {
      if (!row || typeof row !== "object") return false;

      const realValues = Object.entries(row)
        .filter(([k]) => !k.startsWith("__") && k.trim() !== "")
        .map(([, v]) => {
          if (v === null || v === undefined) return null;
          const s = String(v).trim().toLowerCase();
          if (["", "null", "nan", "n/a", "undefined", "-"].includes(s)) return null;
          return v;
        })
        .filter(v => v !== null && v !== 0);

      return realValues.length >= 2;
    });
  }
}
