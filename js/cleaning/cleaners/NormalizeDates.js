import { BaseCleaner } from "./BaseCleaner.js";

export class NormalizeDates extends BaseCleaner {
  constructor() {
    super("normalizeDates", "Normalizar fechas");
  }

  apply(data) {
    if (!data.length) return data;

    const dateColumns = Object.keys(data[0]).filter(key => {
      const k = key.toLowerCase();
      const val = data[0][key];
      return k.includes("fecha") || k.includes("date") || k.includes("registro") || 
             (val && (String(val).includes("-") || String(val).includes("/")));
    });

    return data.map(row => {
      const clean = { ...row };

      dateColumns.forEach(col => {
        let value = row[col];

        if (value === null || value === undefined || String(value).trim() === "") {
          return; 
        }

        // --- MEJORA: Pre-procesamiento de formato DD/MM/YYYY o DD-MM-YYYY ---
        let dateStr = String(value).trim();
        
        // Si detectamos que empieza con día (2 dígitos) y tiene barras o guiones
        // Ejemplo: 15/10/2024 -> 2024-10-15
        const latinFormat = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
        const match = dateStr.match(latinFormat);

        if (match) {
          // Reordenamos a formato ISO (YYYY-MM-DD) para que Date() no se confunda
          dateStr = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        }

        const d = new Date(dateStr);
        
        if (!isNaN(d.getTime())) {
          // Usamos getUTC para evitar que el cambio de zona horaria reste un día
          const year = d.getUTCFullYear();
          const month = String(d.getUTCMonth() + 1).padStart(2, '0');
          const day = String(d.getUTCDate()).padStart(2, '0');
          
          clean[col] = `${year}-${month}-${day}`;
        }
      });

      return clean;
    });
  }
}