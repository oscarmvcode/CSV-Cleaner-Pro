export class RuleEngine {
  constructor(rules = []) {
    this.rules = rules;
  }

  execute(data) {
    return this.rules.reduce((result, rule) => {
      return rule.apply(result);
    }, data);
  }
}
