import { BaseCleaner } from "./BaseCleaner.js";

export class ValidateEmails extends BaseCleaner {
  constructor() {
    super("validateEmails", "Validar formato de emails");
  }

  apply(data) {
    // Regex estándar para validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return data.map(row => {
      const clean = { ...row };
      
      // Buscamos la columna que se llame email
      Object.keys(clean).forEach(col => {
        if (col.toLowerCase().includes("email")) {
          const email = String(clean[col]).trim();
          if (!emailRegex.test(email)) {
            clean[col] = null; // Si no es válido, lo hacemos NULL
          }
        }
      });
      return clean;
    });
  }
}