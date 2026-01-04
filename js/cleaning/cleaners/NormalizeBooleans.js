// cleaners/NormalizeBooleans.js
import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeBooleans extends BaseCleaner {
  run(rows, columnMap = {}) {
    if (!Array.isArray(rows)) return rows;

    const fields = [
      columnMap.estado,
      "activo",
      "estado"
    ].filter(Boolean);

    const TRUE = ["true", "1", "yes", "si", "activo"];
    const FALSE = ["false", "0", "no", "inactivo"];

    return rows.map(row => {
      const clean = { ...row };

      fields.forEach(f => {
        const v = clean[f];
        if (v == null) return;

        const s = String(v).trim().toLowerCase();
        if (TRUE.includes(s)) clean[f] = true;
        else if (FALSE.includes(s)) clean[f] = false;
        else clean[f] = null;
      });

      return clean;
    });
  }
}
