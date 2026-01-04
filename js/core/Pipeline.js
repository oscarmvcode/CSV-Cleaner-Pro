// Pipeline.js
import { TextCleaner } from '../transformers/TextCleaner.js';
import { NumberNormalizer } from '../transformers/NumberNormalizer.js';
import { DateNormalizer } from '../transformers/DateNormalizer.js';
import { NullNormalizer } from '../transformers/NullNormalizer.js';
import { HeaderMapper } from './mapping/HeaderMapper.js';

export class Pipeline {

  constructor() {
    this.columnMap = {};
  }

  run(rows) {

    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: [], columnMap: {} };
    }

    /* ===============================
       1. SANITIZAR HEADERS
    =============================== */
    const sanitizedRows = rows.map(row => {
      const clean = {};
      Object.keys(row).forEach(k => {
        clean[String(k).trim()] = row[k];
      });
      return clean;
    });

    const headers = Object.keys(sanitizedRows[0]);

    /* ===============================
       2. MAPEO SEMÁNTICO REAL
    =============================== */
    this.columnMap = HeaderMapper.map(headers);

    console.log("🔍 ColumnMap:", this.columnMap);

    /* ===============================
       3. NORMALIZACIÓN SEGURA
    =============================== */
    const data = sanitizedRows.map(row => {
      const r = { ...row };

      const safeString = v => typeof v === 'string' ? v : String(v ?? '');

      if (this.columnMap.nombre && r[this.columnMap.nombre] != null) {
        r[this.columnMap.nombre] =
          TextCleaner.clean(safeString(r[this.columnMap.nombre]));
      }

      if (this.columnMap.email && r[this.columnMap.email] != null) {
        r[this.columnMap.email] =
          NullNormalizer.normalize(safeString(r[this.columnMap.email]));
      }

      if (this.columnMap.edad && r[this.columnMap.edad] != null) {
        r[this.columnMap.edad] =
          NumberNormalizer.age(r[this.columnMap.edad]);
      }

      if (this.columnMap.fecha && r[this.columnMap.fecha] != null) {
        r[this.columnMap.fecha] =
          DateNormalizer.normalize(safeString(r[this.columnMap.fecha]));
      }

      if (this.columnMap.ingreso && r[this.columnMap.ingreso] != null) {
        r[this.columnMap.ingreso] =
          NumberNormalizer.money(r[this.columnMap.ingreso]);
      }

      return r;
    });

    return {
      data,
      columnMap: this.columnMap
    };
  }
}
