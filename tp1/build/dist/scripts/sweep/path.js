export class Path {
  constructor(shape, path) {
    this.shape = shape;
    this.path = path;
  }
  getPath() {
    return this.path;
  }
  getShape() {
    return this.shape;
  }
  discretizePath(delta) {
    return this.path.discretize(delta);
  }
}
