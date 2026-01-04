// cleaners/ValidateSchema.js
import { BaseCleaner } from "./BaseCleaner.js";

export class ValidateSchema extends BaseCleaner {

  run(data, columnMap = {}) {
    if (!Array.isArray(data)) return data;

    return data.map(row => {
      const clean = { ...row };
      let valid = true;

      if (columnMap.edad && clean[columnMap.edad] != null) {
        const age = Number(clean[columnMap.edad]);
        if (!Number.isFinite(age) || age <= 0 || age > 120) {
          valid = false;
        }
      }

      if (columnMap.fecha && clean[columnMap.fecha]) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(clean[columnMap.fecha])) {
          valid = false;
        }
      }

      if (columnMap.email && clean[columnMap.email]) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean[columnMap.email])) {
          valid = false;
        }
      }

      if (columnMap.ingreso && clean[columnMap.ingreso] != null) {
        const num = Number(clean[columnMap.ingreso]);
        if (Number.isNaN(num) || num < 0) {
          valid = false;
        }
      }

      clean.__isValid = valid;
      return clean;
    });
  }
}
