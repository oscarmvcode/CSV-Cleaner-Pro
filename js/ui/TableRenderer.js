export class TableRenderer {
  // 1. Valores por defecto (= 1) para evitar el error de "undefined"
  render(data, currentPage = 1, totalPages = 1) {
    const container = document.getElementById("table");
    
    if (!data || data.length === 0) {
      container.innerHTML = `<div class="p-5 text-center text-muted">No hay datos para mostrar</div>`;
      return;
    }

    const headers = Object.keys(data[0]);

    // TABLA con contenedor responsive
    let html = `
      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover table-bordered align-middle mb-0">
          <thead class="table-dark">
            <tr>${headers.map(h => `<th class="px-3">${h}</th>`).join("")}</tr>
          </thead>
          <tbody>`;

    data.forEach(row => {
      html += "<tr>";
      headers.forEach(h => {
        const value = (row[h] === undefined || row[h] === null) ? "" : row[h];
        
        let content = "";
        const lowerValue = String(value).toLowerCase().trim();

        // 2. Lógica visual para NULL y Booleanos 
        if (lowerValue === "" || lowerValue === "null") {
          content = `<span class="badge text-bg-light border text-muted fw-normal">NULL</span>`;
        } else if (value === true || lowerValue === "true") {
          content = `<span class="badge text-bg-success-subtle text-success border-success-subtle">true</span>`;
        } else if (value === false || lowerValue === "false") {
          content = `<span class="badge text-bg-danger-subtle text-danger border-danger-subtle">false</span>`;
        } else {
          content = value;
        }
        
        html += `<td class="px-3">${content}</td>`;
      });
      html += "</tr>";
    });

    html += `</tbody></table></div>`;

    // 3. PAGINACIÓN protegida contra valores nulos
    html += `
      <div class="d-flex justify-content-between align-items-center p-3 bg-white border-top">
        <div class="text-muted small">
          Página <b>${currentPage}</b> de <b>${totalPages}</b>
        </div>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
              <button class="page-link" onclick="window.changePage(${currentPage - 1})">Anterior</button>
            </li>
            <li class="page-item active">
              <span class="page-link">${currentPage}</span>
            </li>
            <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
              <button class="page-link" onclick="window.changePage(${currentPage + 1})">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>`;

    container.innerHTML = html;
  }
}