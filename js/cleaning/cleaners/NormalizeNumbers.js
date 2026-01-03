import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeNumbers extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  execute(data) {
    return data.map(row => {
      const clean = { ...row };
      
      // Buscamos columnas de dinero o ingresos
      Object.keys(clean).forEach(key => {
        const k = key.toLowerCase();
        if (k.includes("ingreso") || k.includes("salario") || k.includes("precio")) {
          let val = clean[key];
          
          // Si es el texto "abc" o basura, lo tratamos como null
          if (typeof val === "string" && val.trim().toLowerCase() === "abc") {
            clean[key] = null;
          } else if (val !== null && val !== undefined && val !== "") {
            const num = parseFloat(val);
            // .toFixed(2) asegura que 500 se convierta en "500.00"
            clean[key] = !isNaN(num) ? num.toFixed(2) : null;
          }
        }
      });
      return clean;
    });
  }
}