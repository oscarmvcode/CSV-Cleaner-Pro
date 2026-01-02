import { BaseCleaner } from "./BaseCleaner.js";

export class CapitalizeText extends BaseCleaner {
  constructor() {
    super("capitalizeText", "Capitalizar nombres y ciudades");
  }

  apply(data) {
    if (!data.length) return data;

    // Identificamos columnas que suelen ser nombres o ciudades
    const textColumns = Object.keys(data[0]).filter(key => {
      const k = key.toLowerCase();
      return k.includes("nombre") || k.includes("ciudad") || k.includes("pais") || k.includes("apellido");
    });

    return data.map(row => {
      const clean = { ...row };
      textColumns.forEach(col => {
        if (row[col] && typeof row[col] === 'string') {
          const text = row[col].trim().toLowerCase();
          // Pone la primera letra en Mayúscula y el resto queda en minúscula
          clean[col] = text.charAt(0).toUpperCase() + text.slice(1);
        }
      });
      return clean;
    });
  }
}