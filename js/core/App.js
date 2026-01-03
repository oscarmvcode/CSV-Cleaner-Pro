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
const progressBar = document.getElementById("progressBar");
const progressStep = document.getElementById("progressStep");

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

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file) return;

  const allowedTypes = ["text/csv", "text/plain", "application/vnd.ms-excel"];
  if (!allowedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
    showMessage("error", "Formato no soportado. Usa CSV o TXT.");
    return;
  }

  showOverlay("Cargando archivo…");

  loader.load(file)
    .then(data => {
      state.setRawData(data);
      state.setCurrentPage(1);

      // Renderizado inicial
      renderer.render(
        state.getPaginatedData(), 
        state.getCurrentPage(), 
        state.getTotalPages()
      );

      fileStatus.textContent = `Archivo: ${file.name} — Filas: ${data.length}`;
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
   LIMPIAR CSV (Uso exclusivo de Orchestrator)
================================ */
document.getElementById("cleanBtn").addEventListener("click", async () => {
    const rawData = state.getRawData();
    const selectedKeys = ChecklistPanel.getSelectedCleaners();

    // 1. Validaciones previas
    if (!rawData || rawData.length === 0) {
        showMessage("warning", "Primero debes cargar un archivo CSV.");
        return; 
    }

    if (!selectedKeys || selectedKeys.length === 0) {
        showMessage("warning", "Selecciona al menos una regla de limpieza.");
        return; 
    }

    showOverlay("Iniciando limpieza...");
  
    try {
        // Ejecución a través del Orchestrator
        // El Orchestrator usará el CleanerRegistry internamente para filtrar por 'selectedKeys'
        const result = await orchestrator.run(selectedKeys, (percent, label) => {
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressStep) progressStep.innerText = `Aplicando: ${label}`;
        });

        // El resultado viene del Orchestrator con la estructura: { data, summary }
        const { data, summary } = result;

        // --- ACTUALIZACIÓN DE ESTADO ---
        state.setCleanedData(data); 
        state.setCurrentPage(1); 

        // --- ACTUALIZACIÓN DE UI ---
        if (fileStatus) {
            fileStatus.textContent = `Archivo procesado — Filas finales: ${summary.remainingRows}`;
        }
        
        renderer.render(
            state.getPaginatedData(), 
            state.getCurrentPage(), 
            state.getTotalPages()
        ); 
        
        const msg = summary.removedRows > 0 
            ? `¡Listo! Se eliminaron ${summary.removedRows} filas.`
            : `¡Listo! Datos normalizados correctamente.`;
        
        showSuccess(msg);
        showMessage("success", msg);

    } catch (error) {
        console.error("Error en limpieza:", error);
        showMessage("error", "Error en el procesamiento de datos.");
    } finally {
        setTimeout(() => {
            hideOverlay();
            if (progressBar) progressBar.style.width = "0%";
            if (progressStep) progressStep.innerText = "";
        }, 1500);
    }
});

/* ===============================
   EXPORTAR Y NAVEGACIÓN
================================ */
document.getElementById("exportBtn").addEventListener("click", () => {
  const cleaned = state.getCleanedData();
  if (!cleaned || cleaned.length === 0) {
    showMessage("warning", "No hay datos limpios para exportar.");
    return;
  }
  CSVExporter.download(cleaned);
});

window.changePage = (pageNumber) => {
    const totalPages = state.getTotalPages();
    if (pageNumber < 1 || pageNumber > totalPages) return;

    state.setCurrentPage(pageNumber);
    renderer.render(state.getPaginatedData(), pageNumber, totalPages);
};