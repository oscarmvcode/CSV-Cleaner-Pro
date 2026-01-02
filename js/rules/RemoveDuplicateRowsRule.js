import { Rule } from "./Rule.js";

export class RemoveDuplicateRowsRule extends Rule {
  apply(data) {
    const seen = new Set();
    return data.filter(row => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
