import { BaseCleaner } from "./BaseCleaner.js";

export class CapitalizeText extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(rows) {
  return rows.map(row => {
    const clean = { ...row };
    Object.keys(clean).forEach(col => {
      const k = col.toLowerCase().trim();
      // Forzamos la detección de columnas de texto
      if (k.includes("ciudad") || k.includes("nombre") || k.includes("apellido")) {
        if (clean[col]) {
          clean[col] = String(clean[col])
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase()); // Esto convierte "quito" en "Quito" infaliblemente
        }
      }
    });
    return clean;
  });
}
}