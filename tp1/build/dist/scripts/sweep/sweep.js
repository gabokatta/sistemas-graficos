import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {buildIndex} from "../geometry.js";
import {DrawMethod} from "../webgl.js";
export class SweepSurface {
  constructor(sweep, levels = -1) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.useCovers = true;
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
    if (this.useCovers) {
      let {top, bottom} = this.buildCoverBuffers();
      [top, bottom].forEach((c) => {
        gl.draw(c.position, c.index, c.normal, DrawMethod.Fan);
      });
    }
  }
  buildCoverBuffers() {
    if (this.coverBuffers)
      return this.coverBuffers;
    let top = {position: [], index: [], normal: []};
    let bottom = {position: [], index: [], normal: []};
    let topCenter = this.sweep.getPath().getPointData(1).p;
    let bottomCenter = this.sweep.getPath().getPointData(0).p;
    top.position.push(...topCenter);
    top.normal.push(0, 1, 0);
    const topCenterIndex = top.position.length;
    for (let j = 0; j <= this.cols; j++) {
      let {p} = this.getPointData(0, j);
      top.position.push(...p);
      top.normal.push(0, 1, 0);
    }
    for (let j = 0; j <= this.cols; j++) {
      top.index.push(topCenterIndex, j + 1, j);
    }
    top.index.push(topCenterIndex, 0, this.cols);
    console.log(top);
    bottom.position.push(...bottomCenter);
    const bottomCenterIndex = bottom.position.length;
    for (let j = 0; j <= this.cols; j++) {
      let {p} = this.getPointData(0, j);
      bottom.position.push(...p);
      bottom.normal.push(0, -1, 0);
    }
    for (let j = 0; j <= this.cols; j++) {
      bottom.index.push(bottomCenterIndex, j + 1, j);
    }
    bottom.index.push(bottomCenterIndex, 0, this.cols);
    this.coverBuffers = {top, bottom};
    return this.coverBuffers;
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
