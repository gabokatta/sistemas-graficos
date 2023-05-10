import {buildBuffers, buildIndex} from "../geometry.js";
import {BSpline} from "../curves/bspline.js";
import {Surface, SweepSurface} from "../sweep.js";
export class Cube {
  constructor(width, height = width) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.covers = [];
    this.rows = 75;
    this.cols = 75;
    this.width = width;
    this.height = height;
    let path = BSpline.straightLines([
      [0, -width / 2, 0],
      [0, height / 2, 0]
    ]);
    let shape = BSpline.straightLines([
      [-width / 2, -width / 2, 0],
      [-height / 2, width / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, -height / 2, 0],
      [-width / 2, -width / 2, 0]
    ]);
    let surface = new Surface(shape);
    this.sweep = new SweepSurface(surface, path);
    buildBuffers(this);
    buildIndex(this);
  }
  getPointData(alfa, beta) {
    let {p, n} = this.sweep.getPointData(alfa, beta);
    return {p, n};
  }
  draw(gl) {
    this.sweep.draw(gl);
  }
}
