import {buildBuffers, buildIndex} from "./geometry.js";
export class RevolutionSurface {
  constructor(shape) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.shape = shape;
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
