// cleaners/RemoveDuplicates.js
import { BaseCleaner } from "./BaseCleaner.js";

export class RemoveDuplicates extends BaseCleaner {

  run(data) {
    if (!Array.isArray(data) || data.length === 0) return data;

    const map = new Map();

    data.forEach(row => {
      const key = this.buildKey(row);

      if (!map.has(key)) {
        map.set(key, row);
      } else {
        const existing = map.get(key);
        if (this.score(row) > this.score(existing)) {
          map.set(key, row);
        }
      }
    });

    return Array.from(map.values());
  }

  buildKey(row) {
    const email =
      row.correo_electronico ||
      row.email ||
      row.mail ||
      row.mailcontacto;

    if (email) {
      return `email:${String(email).trim().toLowerCase()}`;
    }

    const name =
      row.nombre_completo ||
      row.nombre ||
      row.persona ||
      row.user;

    const date =
      row.fecha_nacimiento ||
      row.fecha_registro ||
      row.fechaalta;

    if (name && date) {
      return `name-date:${String(name).toLowerCase()}|${date}`;
    }

    return JSON.stringify(row);
  }

  score(row) {
    let score = 0;

    Object.values(row).forEach(v => {
      if (v !== null && v !== undefined && v !== "") score++;
    });

    if (row.email || row.correo_electronico) score += 2;
    if (typeof row.ingreso_mensual === "number") score += 2;
    if (row.fecha_registro || row.fechaalta) score += 1;

    return score;
  }
}
