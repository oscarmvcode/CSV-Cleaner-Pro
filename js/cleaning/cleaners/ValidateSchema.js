// cleaners/ValidateSchema.js
import { BaseCleaner } from "./BaseCleaner.js";

export class ValidateSchema extends BaseCleaner {
  constructor(config) {
    super(config);
  }
  apply(data) {
    return data.map(row => {
      const clean = { ...row };
      let valid = true;

      if ("edad" in clean && (clean.edad === null || clean.edad < 0)) {
        valid = false;
      }

      Object.keys(clean).forEach(k => {
        if (k.toLowerCase().includes("fecha") && clean[k] !== null) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(clean[k])) {
            valid = false;
          }
        }
      });

      clean.__isValid = valid;
      return clean;
    });
  }
}
