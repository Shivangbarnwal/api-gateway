export class Service {
  constructor(name) {
    this.name = name;
    this.metadata = {};
  }

  setMetadata(key, value) {
    this.metadata[key] = value;
  }

  getMetadata(key) {
    return this.metadata[key];
  }
}