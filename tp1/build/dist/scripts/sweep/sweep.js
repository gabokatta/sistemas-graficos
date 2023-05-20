import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {buildIndex} from "../geometry.js";
import {DrawMethod} from "../webgl.js";
export class SweepSurface {
  constructor(sweep, levels = -1) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.binormal = [];
    this.tangent = [];
    this.reverseUV = false;
    this.uvFactors = [1, 1];
    this.uv = [];
    this.rows = 75;
    this.cols = 75;
    this.useCovers = true;
    this.covers = void 0;
    this.levels = levels <= -1 ? this.rows : levels;
    this.sweep = sweep;
    this.discretizedPath = this.sweep.discretizePath(1 / this.levels);
    this.discretizedShape = this.sweep.getShape().discretize(1 / this.cols);
    this.buildSweepableBuffers();
    buildIndex(this);
  }
  getCovers() {
    if (this.covers) {
      return this.covers;
    }
    this.covers = {top: this.topCover(), bottom: this.bottomCover(true)};
    return this.covers;
  }
  topCover(invertNormals = false) {
    let cover = {p: [], n: [], idx: []};
    let center = this.sweep.getPath().getPointData(1);
    cover.p.push(...center.p);
    cover.n.push(...invertNormals == true ? negateVec(center.t) : center.t);
    let shape = this.discretizedShape;
    for (let i = 0; i < shape.p.length; i++) {
      let point = this.getPointData(this.levels, i);
      cover.p.push(...point.p);
      cover.n.push(...invertNormals == true ? negateVec(point.t) : point.t);
    }
    let n_points = cover.p.length / 3;
    cover.idx.push(...Array(n_points).keys());
    return {p: cover.p, n: cover.n, idx: cover.idx};
  }
  bottomCover(invertNormals = false) {
    let cover = {p: [], n: [], idx: []};
    let center = this.sweep.getPath().getPointData(0);
    cover.p.push(...center.p);
    cover.n.push(...invertNormals == true ? negateVec(center.t) : center.t);
    let shape = this.discretizedShape;
    for (let i = 0; i < shape.p.length; i++) {
      let point = this.getPointData(0, i);
      cover.p.push(...point.p);
      cover.n.push(...invertNormals == true ? negateVec(point.t) : point.t);
    }
    let n_points = cover.p.length / 3;
    cover.idx.push(...Array(n_points).keys());
    return {p: cover.p, n: cover.n, idx: cover.idx};
  }
  buildSweepableBuffers() {
    let points = [];
    let normals = [];
    let binormals = [];
    let tangents = [];
    let uv = [];
    for (let i = 0; i <= this.levels; i++) {
      for (let j = 0; j <= this.cols; j++) {
        let {p, t, n, b, u, v} = this.getPointData(i, j);
        points.push(...p);
        tangents.push(...t);
        normals.push(...n);
        binormals.push(...b);
        if (this.reverseUV) {
          uv.push(v * this.uvFactors[1], u * this.uvFactors[0]);
        } else
          uv.push(u * this.uvFactors[0], v * this.uvFactors[1]);
      }
    }
    this.normal = normals;
    this.position = points;
    this.tangent = tangents;
    this.uv = uv;
  }
  getPointData(alfa, beta) {
    let path = this.discretizedPath;
    let shape = this.discretizedShape;
    let {posM, norM} = levelMatrices(path, alfa);
    let p = vec3.transformMat4(vec3.create(), shape.p[beta], posM);
    let t = vec3.transformMat4(vec3.create(), shape.t[beta], norM);
    let n = vec3.transformMat4(vec3.create(), shape.n[beta], norM);
    let b = vec3.transformMat4(vec3.create(), shape.b[beta], norM);
    let u = alfa / this.levels;
    let v = beta / this.cols;
    return {p, t, n, b, u, v};
  }
  draw(gl) {
    gl.draw(this.position, this.index, this.normal);
    if (this.useCovers) {
      let covers = this.getCovers();
      [covers.top, covers.bottom].forEach((c) => {
        gl.draw(c.p, c.idx, c.n, DrawMethod.Fan);
      });
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
function negateVec(vec) {
  return vec3.negate(vec3.create(), vec);
}
