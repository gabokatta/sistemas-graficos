import {buildBuffers, buildIndex} from "./geometry.js";
export class SweepSurface {
  constructor(shape, path) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.shape = shape;
    this.path = path;
    buildBuffers(this);
    buildIndex(this);
  }
  getPointData(alfa, beta) {
    throw new Error("Method not implemented.");
  }
  draw(gl) {
    throw new Error("Method not implemented.");
  }
}
