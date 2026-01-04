import { HeaderDictionary } from "./HeaderDictionary.js";

export class HeaderMapper {

  // Normaliza un header: minúsculas, quita acentos, espacios y símbolos
  static normalizeHeader(header) {
    return String(header || "")
      .toLowerCase()
      .normalize("NFD")                 // quita acentos
      .replace(/[\u0300-\u036f]/g, "")  // elimina diacríticos
      .replace(/[^a-z0-9]/g, "");       // solo letras y números
  }

  // Mapea headers del CSV a semantic keys
  static map(headers, sampleRow = {}) {
    const map = {};

    // Normaliza todos los headers del CSV
    const normalizedHeaders = headers.map(h => ({
      original: h,
      normalized: HeaderMapper.normalizeHeader(h)
    }));

    Object.entries(HeaderDictionary).forEach(([semanticKey, cfg]) => {
      // Coincidencia exacta
      let matchedHeader = normalizedHeaders.find(hObj =>
        cfg.keywords.some(k =>
          HeaderMapper.normalizeHeader(k) === hObj.normalized
        )
      );

      // Coincidencia parcial si exacta falla
      if (!matchedHeader) {
        matchedHeader = normalizedHeaders.find(hObj =>
          cfg.keywords.some(k =>
            hObj.normalized.includes(HeaderMapper.normalizeHeader(k))
          )
        );
      }

      map[semanticKey] = matchedHeader ? matchedHeader.original : undefined;
    });

    return map;
  }

  static resolve(headers, sampleRow = {}) {
    return this.map(headers, sampleRow);
  }
}
