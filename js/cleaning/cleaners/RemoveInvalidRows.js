// cleaners/RemoveInvalidRows.js
import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveInvalidRows extends BaseCleaner {

  run(data) {
    if (!Array.isArray(data)) return data;

    return data.filter(row => {
      if (row.__isValid === false) return false;

      const nombre =
        row.nombre ||
        row.nombre_completo ||
        row.persona ||
        row.full_name;

      const email =
        row.email ||
        row.correo ||
        row.correo_electronico ||
        row.mailcontacto;

      const edad =
        row.edad ||
        row.anos ||
        row.anos_de_vida ||
        row.edadpersona;

      if (!nombre || !email) return false;
      if (edad != null && Number(edad) <= 0) return false;

      return true;
    });
  }
}
