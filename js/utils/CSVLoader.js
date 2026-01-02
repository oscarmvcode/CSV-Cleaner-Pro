export class CSVLoader {
  load(file) {
    return new Promise((resolve, reject) => {

      if (typeof Papa === "undefined") {
        reject(new Error("PapaParse no está cargado"));
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimiter: "", // autodetecta , ; \t
        complete: result => {

          if (!result.data || result.data.length === 0) {
            reject(new Error("El archivo está vacío o mal formado"));
            return;
          }

          
  if (!result.data || result.data.length === 0) {
    reject(new Error("El archivo no contiene filas de datos."));
    return;
  }

  
  const headers = Object.keys(result.data[0]);
  if (headers.length < 1 || headers.every(h => h.includes("__parsed_extra"))) {
    reject(new Error("El formato del CSV es inválido o no tiene encabezados claros."));
    return;
  }

          if (!result.meta.fields || result.meta.fields.length < 2) {
            reject(new Error("El CSV no tiene encabezados válidos"));
            return;
          }

          resolve(result.data);
        },
        error: err => reject(err)
      });

    });
  }
}
