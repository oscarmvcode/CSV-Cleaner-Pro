import { BaseCleaner } from "./BaseCleaner.js";

export class ValidateEmails extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  
  execute(data) {
    if (!Array.isArray(data)) return data;

    // Esta regex asegura: texto + @ + texto + . + al menos 2 letras (com, es, org)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return data.map(row => {
      const clean = { ...row };

      Object.keys(clean).forEach(col => {
        // Detectamos cualquier columna que se llame email, correo, etc.
        const colName = col.toLowerCase();
        if (!colName.includes("email") && !colName.includes("correo")) return;

        const value = clean[col];
        
        // Si está vacío, lo estandarizamos a null
        if (value === null || value === undefined || String(value).trim() === "") {
          clean[col] = null;
          return;
        }

        const email = String(value).trim().toLowerCase();

        // Si no pasa la validación (como "elena@gmail"), lo limpiamos a null
        clean[col] = emailRegex.test(email) ? email : null;
      });

      return clean;
    });
  }
}