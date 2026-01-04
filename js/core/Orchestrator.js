// Orchestrator.js
import { CleanerRegistry } from "../cleaning/CleanerRegistry.js";
import { Pipeline } from "./Pipeline.js";

export class Orchestrator {
  constructor(state) {
    this.state = state;
  }

  async run(selectedKeys = [], onProgress) {

    const rawData = this.state.getRawData() || [];

    if (!Array.isArray(rawData) || rawData.length === 0) {
      throw new Error("No hay datos cargados para limpiar");
    }

    let currentData = structuredClone(rawData);
    const initialCount = currentData.length;

    console.log("1️⃣ Datos listos para procesar:", currentData[0]);

    /* ================= PIPELINE ================= */
    const pipeline = new Pipeline();
    const { data, columnMap } = pipeline.run(currentData);

    currentData = data;

    /* ================= REGLAS ACTIVAS ================= */
    const activeRules = CleanerRegistry
      .filter(rule => selectedKeys.includes(rule.key))
      .sort((a, b) => a.order - b.order);

    const totalSteps = activeRules.length || 1;

    for (let i = 0; i < activeRules.length; i++) {
      const rule = activeRules[i];

      if (onProgress) {
        onProgress(
          Math.round(((i + 1) / totalSteps) * 100),
          rule.label
        );
      }

      // 🔐 Ejecución segura con o sin columnMap
      currentData = rule.execute.length > 1
        ? rule.execute(currentData, columnMap)
        : rule.execute(currentData);

      console.log(`✅ ${rule.label} → Filas: ${currentData.length}`);

      await new Promise(r => setTimeout(r, 30));
    }

    this.state.setCleanedData(currentData);

    return {
      data: currentData,
      summary: {
        initialRows: initialCount,
        remainingRows: currentData.length,
        removedRows: initialCount - currentData.length
      }
    };
  }
}
