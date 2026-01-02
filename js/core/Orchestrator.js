import { CleanerRegistry } from "../cleaning/CleanerRegistry.js";

export class Orchestrator {
  constructor(state) {
    this.state = state;
  }

  async run(selectedKeys, onProgress) {
    const rawData = this.state.getRawData();
    // Copia profunda para no afectar los datos originales
    let currentData = JSON.parse(JSON.stringify(rawData));
    const initialCount = currentData.length;
    
    // Filtramos las reglas que el usuario marcó en la interfaz
    const activeRules = CleanerRegistry.filter(rule => selectedKeys.includes(rule.key));
    const totalSteps = activeRules.length;

    for (let i = 0; i < totalSteps; i++) {
      const rule = activeRules[i];
      
      if (onProgress) {
        // Notificamos el progreso con el nombre de la regla (ej: "Normalizando fechas")
        onProgress(Math.round(((i + 1) / totalSteps) * 100), rule.label);
      }

      // Aplicación de la regla de limpieza
      currentData = rule.apply(currentData);

      // Pequeña pausa para que la UI no se bloquee y se vea el progreso
      await new Promise(resolve => setTimeout(resolve, 50)); 
    }

    // Guardamos los datos finales en el estado global
    this.state.setCleanedData(currentData);

    // Devolvemos un resumen más completo para mostrar en la interfaz
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