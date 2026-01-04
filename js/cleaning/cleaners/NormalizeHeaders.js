// cleaners/NormalizeHeaders.js
import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeHeaders extends BaseCleaner {
  run(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return rows;

    return rows.map(row => {
      const clean = {};
      Object.entries(row).forEach(([key, value]) => {
        const nk = String(key)
          .trim()
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_")
          .replace(/[^\w]/g, "")
          .replace(/_+/g, "_");

        clean[nk || `col_${Math.random().toString(36).slice(2, 6)}`] = value;
      });
      return clean;
    });
  }
}
