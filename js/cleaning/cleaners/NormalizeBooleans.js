import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeBooleans extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    const TRUE_VALUES = ["true", "1", "yes", "si", "sí", "active"];
    const FALSE_VALUES = ["false", "0", "no", "inactive"];

    return data.map(row => {
      const clean = { ...row };

      Object.keys(clean).forEach(key => {
        const value = clean[key];
        if (typeof value === "string") {
          const normalized = value.trim().toLowerCase();
          if (TRUE_VALUES.includes(normalized)) clean[key] = true;
          else if (FALSE_VALUES.includes(normalized)) clean[key] = false;
        }
      });

      return clean;
    });
  }
}
