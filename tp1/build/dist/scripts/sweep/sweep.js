import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {buildIndex} from "../geometry.js";
export class SweepSurface {
  constructor(sweep, levels = -1) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.sweep = sweep;
    this.levels = levels <= -1 ? this.rows : levels;
    this.buildSweepableBuffers();
    buildIndex(this);
  }
  buildSweepableBuffers() {
    let points = [];
    let normals = [];
    let tangents = [];
    for (let i = 0; i <= this.levels; i++) {
      for (let j = 0; j <= this.cols; j++) {
        let {p, t, n} = this.getPointData(i, j);
        points.push(...p);
        tangents.push(...t);
        normals.push(...n);
      }
    }
    this.normal = normals;
    this.position = points;
  }
  getPointData(alfa, beta) {
    let path = this.sweep.discretizePath(1 / this.levels);
    let shape = this.sweep.getShape().discretize(1 / this.cols);
    let {posM, norM} = levelMatrices(path, alfa);
    let p = vec3.transformMat4(vec3.create(), shape.p[beta], posM);
    let t = vec3.transformMat4(vec3.create(), shape.t[beta], norM);
    let n = vec3.transformMat4(vec3.create(), shape.n[beta], norM);
    return {p, t, n};
  }
  draw(gl) {
    gl.draw(this.position, this.index, this.normal);
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
