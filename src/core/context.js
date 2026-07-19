export class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.service = null;
    this.route = null;

    // Shared state for middlewares
    this.state = {};
  }
}