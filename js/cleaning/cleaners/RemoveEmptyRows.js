import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveEmptyRows extends BaseCleaner {
  constructor() {
    super("removeEmptyRows", "Eliminar filas vacías");
  }

  apply(data) {
    if (!data || data.length === 0) return [];

    return data.filter(row => {
      // Convertimos los valores a array
      const keys = Object.keys(row);
      const values = Object.values(row);

      // Verificamos si hay contenido real ignorando la primera columna (ID)
      // Empezamos desde el índice 1 (nombre, edad, etc.)
      const hasContent = values.slice(1).some(v => {
        if (v === null || v === undefined) return false;
        const s = String(v).trim().toLowerCase();
        return s !== "" && s !== "null" && s !== "undefined";
      });

      // Si no tiene contenido en las columnas de datos, la borramos
      return hasContent;
    });
  }
}