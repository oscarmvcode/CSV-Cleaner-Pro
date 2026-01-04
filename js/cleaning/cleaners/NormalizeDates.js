// cleaners/NormalizeDates.js
import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeDates extends BaseCleaner {
  run(rows, columnMap = {}) {
    if (!Array.isArray(rows) || rows.length === 0) return rows;

    const dateCols = [
      columnMap.fecha,
      ...Object.keys(rows[0]).filter(k =>
        /(fecha|date|registro|fec)/i.test(k)
      )
    ].filter(Boolean);

    return rows.map(row => {
      const clean = { ...row };

      dateCols.forEach(col => {
        const raw = clean[col];
        if (!raw) {
          clean[col] = null;
          return;
        }

        const v = String(raw).trim().replace(/\./g, "/");
        let y, m, d;

        if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
          [y, m, d] = v.split("-").map(Number);
        } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(v)) {
          [d, m, y] = v.split("/").map(Number);
          if (y < 100) y += 2000;
        } else {
          clean[col] = null;
          return;
        }

        const test = new Date(y, m - 1, d);
        clean[col] =
          test.getFullYear() === y &&
          test.getMonth() === m - 1 &&
          test.getDate() === d
            ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
            : null;
      });

      return clean;
    });
  }
}
