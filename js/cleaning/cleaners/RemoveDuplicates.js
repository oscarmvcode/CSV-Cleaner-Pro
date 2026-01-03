import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveDuplicates extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  execute(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    const seen = new Set();

    return data.filter(row => {
      // Creamos la huella usando solo los datos CLAVE
      // Ignoramos ID y columnas que suelen estar vacías para poder agrupar
      const nombre = String(row.nombre || "").trim().toLowerCase();
      const ciudad = String(row.ciudad || "").trim().toLowerCase();
      
      // Si el nombre está vacío, no lo procesamos aquí (lo hará RemoveInvalidRows)
      if (!nombre) return true;

      const fingerprint = `${nombre}|${ciudad}`;

      if (seen.has(fingerprint)) {
        return false; 
      }

      seen.add(fingerprint);
      return true;
    });
  }
}