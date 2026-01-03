import { BaseCleaner } from "./BaseCleaner.js";

export class DetectOutliers extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return rows;

    const keys = Object.keys(rows[0]);

    return rows.map(row => ({ ...row })).map((_, __, clonedRows) => {
      keys.forEach(key => {
        const values = clonedRows
          .map(r => {
            const v = r[key];
            return typeof v === "number" || (!isNaN(v) && v !== "" && v !== null)
              ? Number(v)
              : null;
          })
          .filter(v => v !== null);

        if (values.length < 5) return;

        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance =
          values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
          values.length;
        const std = Math.sqrt(variance);

        if (std === 0) return;

        clonedRows.forEach(r => {
          const v = Number(r[key]);
          if (!isNaN(v) && Math.abs(v - mean) > 3 * std) {
            r[`outlier_${key}`] = true;
          }
        });
      });

      return _;
    });
  }
}
