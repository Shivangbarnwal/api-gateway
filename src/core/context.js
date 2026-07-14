export class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;

    // Shared state for middlewares
    this.state = {};
  }
}