import { CleanerRegistry } from "../cleaning/CleanerRegistry.js";

export class Orchestrator {
  constructor(state) {
    this.state = state;
  }

  async run(selectedKeys, onProgress) {
    const rawData = this.state.getRawData();
    
    // Copia profunda para no mutar el estado original accidentalmente
    let currentData = structuredClone(rawData);
    const initialCount = currentData.length;

    // 🔐 ÚNICA FUENTE DE VERDAD: Filtramos y ordenamos según la arquitectura definida en el Registry
    const activeRules = CleanerRegistry
      .filter(rule => selectedKeys.includes(rule.key))
      .sort((a, b) => a.order - b.order);

    const totalSteps = activeRules.length;

    for (let i = 0; i < totalSteps; i++) {
      const rule = activeRules[i];

      if (onProgress) {
        onProgress(
          Math.round(((i + 1) / totalSteps) * 100),
          rule.label
        );
      }

      // Ejecución mediante el método execute (que incluye hooks si los necesitas en el futuro)
      currentData = rule.execute(currentData);

      // Pausa visual para mejorar la experiencia de usuario
      await new Promise(resolve => setTimeout(resolve, 30));
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