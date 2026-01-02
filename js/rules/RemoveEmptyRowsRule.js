import { Rule } from "./Rule.js";

export class RemoveEmptyRowsRule extends Rule {
  apply(data) {
    return data.filter(row =>
      Object.values(row).some(value => value && value.toString().trim() !== "")
    );
  }
}
