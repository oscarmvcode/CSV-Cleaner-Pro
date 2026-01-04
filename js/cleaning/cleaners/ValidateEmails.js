// cleaners/ValidateEmails.js
import { BaseCleaner } from "./BaseCleaner.js";

export class ValidateEmails extends BaseCleaner {

  run(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return data.map(row => {
      const clean = { ...row };

      Object.keys(clean).forEach(col => {
        const colName = col.toLowerCase();

        if (!colName.includes("email") &&
            !colName.includes("correo") &&
            !colName.includes("mail")) return;

        const value = clean[col];

        if (value == null || String(value).trim() === "") {
          clean[col] = null;
          return;
        }

        const email = String(value).trim().toLowerCase();
        clean[col] = emailRegex.test(email) ? email : null;
      });

      return clean;
    });
  }
}
