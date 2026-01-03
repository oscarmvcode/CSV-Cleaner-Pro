import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveEmptyRows extends BaseCleaner {
 constructor(config) {
    super(config);
  }

  apply(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    return data.filter(row => {
      // Ignoramos completamente filas sin objeto válido
      if (!row || typeof row !== "object") return false;

      // Verificamos si al menos UNA columna (excepto id) tiene contenido real
      return Object.entries(row)
        .filter(([key]) => key !== "id")
        .some(([, value]) => {
          if (value === null || value === undefined) return false;

          const s = String(value).trim().toLowerCase();
          return s !== "" && s !== "null" && s !== "nan" && s !== "n/a";
        });
    });
  }
}
