import { BaseCleaner } from "./BaseCleaner.js";

export class DetectOutliers extends BaseCleaner {
  constructor() {
    super("detectOutliers", "Detectar outliers");
  }

  apply(data) {
    if (!data.length) return data;
    const keys = Object.keys(data[0]);

    keys.forEach(key => {
      const nums = data
        .map(row => {
          const val = row[key];
          return (val !== null && val !== "" && !isNaN(val)) ? Number(val) : NaN;
        })
        .filter(n => !isNaN(n)); 

      if (nums.length < 5) return; 

      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      const std = Math.sqrt(
        nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length
      );

      if (std === 0) return;

      data.forEach(row => {
        const v = Number(row[key]);
        if (!isNaN(v) && row[key] !== null && row[key] !== "") {
          if (Math.abs(v - mean) > 3 * std) {
            row[`is_outlier_${key}`] = "ANOMALY";
          }
        }
      });
    });

    return data;
  }
}