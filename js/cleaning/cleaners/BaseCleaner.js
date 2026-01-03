export class BaseCleaner {
  /**
   * @param {Object} config
   * @param {string} config.key    Identificador único del cleaner
   * @param {string} config.label  Texto visible en la UI
   * @param {number} config.order  Orden de ejecución (obligatorio)
   */
  constructor({ key, label, order }) {
    if (
      typeof key !== "string" ||
      typeof label !== "string" ||
      typeof order !== "number"
    ) {
      throw new Error("BaseCleaner requiere key (string), label (string) y order (number)");
    }

    this.key = key;
    this.label = label;
    this.order = order;
  }

  /**
   * Método principal que DEBE implementar cada cleaner
   * @param {Array<Object>} rows
   * @returns {Array<Object>}
   */
  apply(rows) {
    throw new Error(
      `${this.constructor.name}: apply() no implementado`
    );
  }

  /**
   * Hook opcional previo
   */
  beforeApply(rows) {
    return rows;
  }

  /**
   * Hook opcional posterior
   */
  afterApply(rows) {
    return rows;
  }

  /**
   * Ejecución segura del cleaner
   */
  execute(rows) {
    if (!Array.isArray(rows)) {
      throw new TypeError(
        `${this.constructor.name} esperaba un array de filas`
      );
    }

    let result = this.beforeApply(rows);
    result = this.apply(result);
    result = this.afterApply(result);

    if (!Array.isArray(result)) {
      throw new TypeError(
        `${this.constructor.name} debe retornar un array`
      );
    }

    return result;
  }
}
