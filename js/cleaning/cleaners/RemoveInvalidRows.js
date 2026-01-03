import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveInvalidRows extends BaseCleaner {
  constructor(config) {
    super(config);
  }

  execute(data) {
    return data.filter(row => {
      // 1. Limpieza de Edad (Rango lógico de 0 a 115 años)
      const edad = parseInt(row.edad);
      const esEdadValida = !isNaN(edad) && edad >= 0 && edad <= 115;

      // 2. Limpieza de Identidad (Debe tener un nombre real)
      const tieneNombre = row.nombre && 
                          row.nombre !== "NULL" && 
                          row.nombre.trim().length > 2;

      // 3. Limpieza de IDs Fantasma
      const tieneId = row.id !== null && row.id !== undefined && row.id !== "";

      // Solo si cumple todas las condiciones la fila sobrevive
      return esEdadValida && tieneNombre && tieneId;
    });
  }
}