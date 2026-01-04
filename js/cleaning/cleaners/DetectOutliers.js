// cleaners/DetectOutliers.js
import { BaseCleaner } from "./BaseCleaner.js";

export class DetectOutliers extends BaseCleaner {
  run(rows) {
    if (!Array.isArray(rows) || rows.length < 5) return rows;

    const keys = Object.keys(rows[0]);
    const cleanRows = rows.map(r => ({ ...r }));

    keys.forEach(key => {
      const values = cleanRows
        .map(r => {
          const v = r[key];
          return typeof v === "number" && Number.isFinite(v) ? v : null;
        })
        .filter(v => v !== null);

      if (values.length < 5) return;

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(
        values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
      );

      if (!std) return;

      cleanRows.forEach(r => {
        const v = r[key];
        if (typeof v === "number" && Math.abs(v - mean) > 3 * std) {
          r[`is_outlier_${key}`] = true;
        }
      });
    });

    return cleanRows;
  }
}
