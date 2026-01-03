import { TextCleaner } from '../transformers/TextCleaner.js';
import { NumberNormalizer } from '../transformers/NumberNormalizer.js';
import { DateNormalizer } from '../transformers/DateNormalizer.js';
import { NullNormalizer } from '../transformers/NullNormalizer.js';

export class Pipeline {
  run(rows) {
    return rows.map(r => ({
      id: Number(r.id) || null,
      nombre: TextCleaner.clean(r.nombre),
      email: NullNormalizer.normalize(r.email),
      edad: NumberNormalizer.age(r.edad),
      ciudad: TextCleaner.clean(r.ciudad),
      fecha_registro: DateNormalizer.normalize(r.fecha_registro),
      ingreso: NumberNormalizer.money(r.ingreso)
    }));
  }
}
