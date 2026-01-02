export class StateManager {
  
  constructor() {
    this.rawData = [];
    this.cleanedData = [];
    
    this.currentPage = 1;
    this.rowsPerPage = 50; 
  }

  setRawData(data) {
    this.rawData = data;
    this.cleanedData = [...data];
    this.currentPage = 1; // Resetear a la primera página al cargar nuevo archivo
  }

  getRawData() {
    return this.rawData;
  }

  setCleanedData(data) {
    this.cleanedData = data;
    this.currentPage = 1; // Resetear página tras cada limpieza
  }

  getCleanedData() {
    return this.cleanedData;
  }

  // --- MÉTODOS DE PAGINACIÓN ---

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getRowsPerPage() {
    return this.rowsPerPage;
  }

  /**
   * Obtiene solo el segmento de datos para la página actual
   * Ejemplo: Si es página 2, devuelve de la fila 51 a la 100
   */
  getPaginatedData() {
    const data = this.cleanedData.length > 0 ? this.cleanedData : this.rawData;
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return data.slice(start, end);
  }

  getTotalPages() {
    const data = this.cleanedData.length > 0 ? this.cleanedData : this.rawData;
    return Math.ceil(data.length / this.rowsPerPage) || 1;
  }

  clear() {
    this.rawData = [];
    this.cleanedData = [];
    this.currentPage = 1;
  }
}