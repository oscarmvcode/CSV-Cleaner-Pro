import { RemoveEmptyRows } from "./cleaners/RemoveEmptyRows.js";
import { NormalizeHeaders } from "./cleaners/NormalizeHeaders.js";
import { NormalizeNulls } from "./cleaners/NormalizeNulls.js";
import { NormalizeBooleans } from "./cleaners/NormalizeBooleans.js";
import { NormalizeDates } from "./cleaners/NormalizeDates.js";
import { NormalizeNumbers } from "./cleaners/NormalizeNumbers.js";
import { CapitalizeText } from "./cleaners/CapitalizeText.js";
import { ValidateEmails } from "./cleaners/ValidateEmails.js";
import { ValidateSchema } from "./cleaners/ValidateSchema.js";
import { RemoveInvalidRows } from "./cleaners/RemoveInvalidRows.js";
import { RemoveDuplicates } from "./cleaners/RemoveDuplicates.js";

/**
 * REGLA DE ORO: 
 * Se pasa el objeto {key, label, order} para que BaseCleaner no de error.
 * Las keys coinciden exactamente con el data-cleaner del HTML.
 */
export const CleanerRegistry = [
  // --- FASE 1: ESTRUCTURA ---
  new RemoveEmptyRows({ key: 'remove-empty-rows', label: 'Eliminando filas vacías', order: 0 }),
  new NormalizeHeaders({ key: 'normalize-headers', label: 'Normalizando encabezados', order: 1 }),

  // --- FASE 2: NORMALIZACIÓN ---
  new NormalizeNulls({ key: 'normalize-nulls', label: 'Normalizando nulos', order: 2 }),
  new NormalizeBooleans({ key: 'normalize-booleans', label: 'Normalizando booleanos', order: 3 }),
  new NormalizeDates({ key: 'normalize-dates', label: 'Normalizando fechas', order: 4 }),
  new NormalizeNumbers({ key: 'normalize-numbers', label: 'Limpiando números e ingresos', order: 5 }),

  // --- FASE 3: CONTENIDO ---
  new CapitalizeText({ key: 'capitalize-text', label: 'Corrigiendo mayúsculas (Quito)', order: 6 }),

  // --- FASE 4: VALIDACIÓN ---
  new ValidateEmails({ key: 'validate-emails', label: 'Validando correos', order: 7 }),
  new ValidateSchema({ key: 'validate-schema', label: 'Validando esquema', order: 8 }),

  // --- FASE 5: PURGA FINAL ---
  new RemoveInvalidRows({ key: 'remove-invalid-rows', label: 'Eliminando filas inválidas (Edad -5)', order: 9 }),
  new RemoveDuplicates({ key: 'remove-duplicates', label: 'Eliminando duplicados', order: 10 })
];