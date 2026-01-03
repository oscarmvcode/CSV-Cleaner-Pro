import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeDates extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  apply(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    // 1. Identificar qué columnas parecen contener fechas
    const dateColumns = Object.keys(data[0]).filter(key => {
      const k = key.toLowerCase();
      return k.includes("fecha") || k.includes("date") || k.includes("registro");
    });

    return data.map(row => {
      const clean = { ...row };

      dateColumns.forEach(col => {
        const rawValue = clean[col];

        // Manejo de valores vacíos o nulos
        if (!rawValue || String(rawValue).trim() === "" || String(rawValue).toUpperCase() === "N/A") {
          clean[col] = null;
          return;
        }

        // 2. Definir dateStr limpiando el valor original
        let dateStr = String(rawValue).trim();

        // Soporte básico para formato latino DD/MM/YYYY -> convertir a YYYY-MM-DD
        const latinRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
        const match = dateStr.match(latinRegex);
        if (match) {
          dateStr = `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
        }

        const d = new Date(dateStr);

        // 3. Validación de rango y veracidad
        if (isNaN(d.getTime()) || d.getFullYear() > 2100 || d.getFullYear() < 1900) {
          clean[col] = null; 
        } else {
          // Guardar en formato ISO estándar (YYYY-MM-DD)
          clean[col] = d.toISOString().split('T')[0];
        }
      });

      return clean;
    });
  }
}