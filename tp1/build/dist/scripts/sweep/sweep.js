import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {buildIndex} from "../geometry.js";
export class SweepSurface {
  constructor(sweep) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.useCovers = false;
    this.sweep = sweep;
    this.buildSweepableBuffers();
    buildIndex(this);
  }
  buildSweepableBuffers() {
    let points = [];
    let normals = [];
    let tangents = [];
    let path = this.sweep.discretizePath(1 / this.rows);
    let shape = this.sweep.getShape().discretize(1 / this.cols);
    for (let i = 0; i <= this.rows; i++) {
      let {posM, norM} = levelMatrices(path, i);
      for (let j = 0; j <= this.cols; j++) {
        let p = vec3.transformMat4(vec3.create(), shape.p[j], posM);
        let t = vec3.transformMat4(vec3.create(), shape.t[j], norM);
        let n = vec3.transformMat4(vec3.create(), shape.n[j], norM);
        points.push(...p);
        tangents.push(...t);
        normals.push(...n);
      }
    }
    this.normal = normals;
    this.position = points;
  }
  getPointData(alfa, beta) {
    throw new Error("Sweep Surface has no need to provide point data, Sweepable is in charge of filling the buffers.");
  }
  draw(gl) {
    console.log(this);
    gl.draw(this.position, this.index, this.normal);
    if (this.useCovers) {
    }
  }
}
export function levelMatrices(data, index) {
  return {
    posM: positionMatrix(data.n[index], data.b[index], data.t[index], data.p[index]),
    norM: normalMatrix(data.n[index], data.b[index], data.t[index], data.p[index])
  };
}
function positionMatrix(n, b, t, p) {
  return mat4.fromValues(n[0], n[1], n[2], 0, b[0], b[1], b[2], 0, t[0], t[1], t[2], 0, p[0], p[1], p[2], 1);
}
function normalMatrix(n, b, t, p) {
  return mat4.fromValues(n[0], n[1], n[2], 0, b[0], b[1], b[2], 0, t[0], t[1], t[2], 0, 0, 0, 0, 0);
}
