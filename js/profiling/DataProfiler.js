export class DataProfiler {
  static countNulls(data, column) {
    return data.filter(r => !r[column]).length;
  }
}
