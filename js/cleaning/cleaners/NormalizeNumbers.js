// cleaners/NormalizeNumbers.js
import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeNumbers extends BaseCleaner {
  run(rows, columnMap = {}) {
    if (!Array.isArray(rows)) return rows;

    const moneyCols = [
      columnMap.ingreso,
      ...Object.keys(rows[0]).filter(k =>
        /(ingreso|salario|monto|total|valor)/i.test(k)
      )
    ].filter(Boolean);

    return rows.map(row => {
      const clean = { ...row };

      moneyCols.forEach(col => {
        let v = clean[col];
        if (v == null) {
          clean[col] = null;
          return;
        }

        let s = String(v).trim();

        if (/^\d{1,3}(\.\d{3})+,\d+$/.test(s))
          s = s.replace(/\./g, "").replace(",", ".");
        else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(s))
          s = s.replace(/,/g, "");
        else
          s = s.replace(/[^\d.-]/g, "");

        const num = Number(s);
        clean[col] =
          Number.isFinite(num) && num >= 0 && num <= 1_000_000
            ? Number(num.toFixed(2))
            : null;
      });

      return clean;
    });
  }
}
