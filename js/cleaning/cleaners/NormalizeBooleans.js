import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeBooleans extends BaseCleaner {
  constructor() {
    super("normalizeBooleans", "Normalizar valores lógicos (Si/No)");
  }

  apply(data) {
    const trueValues = ["true", "1", "yes", "si", "sí", "active"];
    const falseValues = ["false", "0", "no", "inactive"];

    return data.map(row => {
      const clean = { ...row };
      
      if (clean.hasOwnProperty("activo")) {
        const val = String(clean["activo"]).toLowerCase().trim();
        
        if (trueValues.includes(val)) {
          clean["activo"] = true;
        } else if (falseValues.includes(val)) {
          clean["activo"] = false;
        } else {
          clean["activo"] = null; // Para cosas como "N/A"
        }
      }
      return clean;
    });
  }
}