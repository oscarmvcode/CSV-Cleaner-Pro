import { StateManager } from "./StateManager.js";
import { Orchestrator } from "./Orchestrator.js";
import { CSVLoader } from "../utils/CSVLoader.js";
import { CSVExporter } from "../utils/CSVExporter.js";
import { TableRenderer } from "../ui/TableRenderer.js";
import { ChecklistPanel } from "../ui/ChecklistPanel.js";

/* ===============================
   INSTANCIAS PRINCIPALES
================================ */
const loader = new CSVLoader();
const state = new StateManager();
const orchestrator = new Orchestrator(state);
const renderer = new TableRenderer();

/* ===============================
   ELEMENTOS DOM
================================ */
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("csvInput");
const fileStatus = document.getElementById("fileStatus");
const messageBox = document.getElementById("messageBox");

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");

/* ===============================
   UI HELPERS
================================ */
function showMessage(type, text) {
  messageBox.className = `message ${type}`;
  messageBox.textContent = text;
  messageBox.classList.remove("hidden");

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 4000);
}

function showOverlay(text) {
  overlayText.textContent = text;
  overlay.classList.remove("hidden", "success");
}

function showSuccess(text) {
  overlay.classList.add("success");
  overlayText.textContent = text;
}

function hideOverlay() {
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 800);
}

/* ===============================
   CARGA DE ARCHIVOS
================================ */
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

/* ===============================
   PROCESAR ARCHIVO
================================ */
function handleFile(file) {
  if (!file) return;

  const allowedTypes = [
    "text/csv",
    "text/plain",
    "application/vnd.ms-excel"
  ];

  if (!allowedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
    showMessage("error", "Formato no soportado. Usa CSV o TXT.");
    return;
  }

  showOverlay("Cargando archivo…");

  /* ===============================
    PROCESAR ARCHIVO 
================================ */
loader.load(file)
    .then(data => {
        state.setRawData(data);
        state.setCurrentPage(1); // Nos aseguramos de empezar en la página 1

        // 1. Obtenemos solo las primeras 50 filas del state
        const initialData = state.getPaginatedData(); 
        
        // 2. Obtenemos los números de página reales
        const currentPage = state.getCurrentPage();
        const totalPages = state.getTotalPages();

        // 3. Renderizamos pasando los 3 parámetros necesarios
        renderer.render(initialData, currentPage, totalPages);

        fileStatus.textContent =
            `Archivo: ${file.name} — Filas: ${state.getRawData().length}`;

        showMessage("success", "Archivo cargado correctamente.");
        showSuccess("Listo");
        hideOverlay();
    })
    .catch(err => {
        hideOverlay();
        showMessage("error", err.message);
    });
}

/* ===============================
    LIMPIAR CSV (Corrección Paginación)
================================ */
document.getElementById("cleanBtn").addEventListener("click", async () => {
    // 1. VALIDACIÓN FÍSICA DEL INPUT Y DEL ESTADO
    const fileInput = document.getElementById("csvInput");
    const rawData = state.getRawData();
    const selectedRules = ChecklistPanel.getSelectedCleaners();

    // BLOQUEO: Si no hay archivo en el input Y el estado está vacío
    if (!fileInput.files[0] && (!rawData || rawData.length === 0)) {
        showMessage("warning", "Primero debes cargar un archivo CSV.");
        return; 
    }

    // 2. VALIDACIÓN DE REGLAS
    if (!selectedRules || selectedRules.length === 0) {
        showMessage("warning", "Selecciona al menos una regla de limpieza.");
        return; 
    }

    const progressBar = document.getElementById("progressBar");
    const progressStep = document.getElementById("progressStep");

    showOverlay("Iniciando limpieza...");
  
    try {
        const result = await orchestrator.run(selectedRules, (percent, label) => {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressStep) progressStep.innerText = `Aplicando: ${label}`;
        });

        // Extraemos los datos y los metadatos del resumen
        const finalData = result.data || result;
        const summary = result.summary || {};
        const remainingCount = summary.remainingRows !== undefined ? summary.remainingRows : finalData.length;
        const removedRows = summary.removedRows || 0;

        // --- ACTUALIZACIÓN DE ESTADO ---
        state.setCleanedData(finalData); 
        state.setCurrentPage(1); // <--- CRÍTICO: Reiniciamos a la pág 1 para evitar "undefined"

        // --- ACTUALIZACIÓN DE UI ---
        const fileName = fileInput.files[0] ? fileInput.files[0].name : "Archivo";
        const fileStatus = document.getElementById("fileStatus"); // Aseguramos capturar el elemento
        if (fileStatus) {
            fileStatus.textContent = `Archivo: ${fileName} — Filas finales: ${remainingCount}`;
        }
        
        // Renderizado con los 3 parámetros para llenar los labels correctamente
        renderer.render(
            state.getPaginatedData(), 
            state.getCurrentPage(), 
            state.getTotalPages()
        ); 
        
        // Mensaje enriquecido con el resumen
        const msg = removedRows > 0 
            ? `¡Listo! Se eliminaron ${removedRows} filas y quedaron ${remainingCount}.`
            : `¡Listo! Datos normalizados correctamente.`;
        
        showMessage("success", msg);

    } catch (error) {
        console.error("Error en limpieza:", error);
        showMessage("error", "Error en el procesamiento de datos.");
    } finally {
        setTimeout(() => {
            hideOverlay();
            if (progressBar) progressBar.style.width = "0%";
            if (progressStep) progressStep.innerText = "";
        }, 1000);
    }
});
/* ===============================
   EXPORTAR CSV LIMPIO
================================ */
document.getElementById("exportBtn").addEventListener("click", () => {
  const cleaned = state.getCleanedData();

  if (!cleaned || cleaned.length === 0) {
    showMessage("warning", "No hay datos limpios para exportar.");
    return;
  }

  CSVExporter.download(cleaned);
});

/* ===============================
    LÓGICA DE NAVEGACIÓN
================================ */

// Función para cambiar de página (Se llama desde los botones de la tabla)
window.changePage = (pageNumber) => {
    const totalPages = state.getTotalPages();
    
    // Validar que la página esté en el rango correcto
    if (pageNumber < 1 || pageNumber > totalPages) return;

    state.setCurrentPage(pageNumber);
    
    // Obtenemos solo el "pedazo" de 50 filas
    const dataToShow = state.getPaginatedData(); 
    renderer.render(dataToShow, pageNumber, totalPages);
};
