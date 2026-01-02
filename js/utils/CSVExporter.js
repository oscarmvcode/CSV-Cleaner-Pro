export class CSVExporter {
  static download(data, fileName = "datos_limpios.csv") {
    if (!data || data.length === 0) return;

    // 1. Obtener encabezados
    const headers = Object.keys(data[0]).join(",");
    
    // 2. Obtener filas
    const rows = data.map(row => 
      Object.values(row).map(value => {
        // Escapar comas dentro de los textos
        const str = String(value);
        return str.includes(",") ? `"${str}"` : str;
      }).join(",")
    ).join("\n");

    const csvContent = headers + "\n" + rows;

    // 3. Añadir el BOM de UTF-8 (\uFEFF)
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    
    // 4. Crear link de descarga
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}