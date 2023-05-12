export class Path {
  constructor(shape, path) {
    this.shape = shape;
    this.path = path;
  }
  getShape() {
    return this.shape;
  }
  discretizePath(delta) {
    return this.path.discretize(delta);
  }
}
