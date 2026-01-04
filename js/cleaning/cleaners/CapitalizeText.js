// cleaners/CapitalizeText.js
import { BaseCleaner } from "./BaseCleaner.js";

export class CapitalizeText extends BaseCleaner {
  run(rows, columnMap = {}) {
    if (!Array.isArray(rows)) return rows;

    const targets = [
      columnMap.nombre,
      "nombre",
      "nombre_completo",
      "apellido",
      "ciudad"
    ].filter(Boolean);

    return rows.map(row => {
      const clean = { ...row };

      targets.forEach(k => {
        if (typeof clean[k] === "string") {
          clean[k] = clean[k]
            .toLowerCase()
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
      });

      return clean;
    });
  }
}
