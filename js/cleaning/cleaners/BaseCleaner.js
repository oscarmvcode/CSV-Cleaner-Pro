// cleaners/BaseCleaner.js
export class BaseCleaner {

  constructor({ key, label, order } = {}) {
    this.key = key ?? "unnamed";
    this.label = label ?? "Unnamed cleaner";
    this.order = Number.isFinite(order) ? order : 0;
  }

  /**
   * Método base de ejecución
   * - Soporta columnMap
   * - Evita crashes
   * - No interfiere con la lógica del cleaner
   */
  execute(rows, columnMap) {
    if (!Array.isArray(rows)) return rows;

    try {
      return this.run
        ? this.run(rows, columnMap)
        : rows;
    } catch (err) {
      console.error(
        `❌ Error en cleaner "${this.label}" (${this.key}):`,
        err
      );
      return rows; // FAIL-SAFE: no rompe el pipeline
    }
  }

  /**
   * Método que cada cleaner debe implementar
   * (execute NO se sobreescribe, run SÍ)
   */
  run(rows /*, columnMap */) {
    return rows;
  }
}
