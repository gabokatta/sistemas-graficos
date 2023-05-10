import {buildBuffers, buildIndex} from "./geometry.js";
import {DrawMethod} from "./webgl.js";
import {mat4, vec3} from "../../snowpack/pkg/gl-matrix.js";
import {DEFAULT_DELTA} from "./curves/segment.js";
import {applyTransform} from "./util.js";
export class SweepSurface {
  constructor(shape, path) {
    this.index = [];
    this.position = [];
    this.normal = [];
    this.rows = 75;
    this.cols = 75;
    this.drawCovers = false;
    this.shape = shape;
    this.path = path;
    this.transform = mat4.create();
    buildBuffers(this);
    buildIndex(this);
  }
  setTransform(transform) {
    this.shape.setTransform(transform);
    this.transform = transform;
    return this;
  }
  getPointData(alfa, beta) {
    let pathPoint = this.path.getPointData(alfa);
    this.shape.applyOrientation(pathPoint);
    return this.shape.shapePoint(beta);
  }
  draw(gl) {
    gl.draw(this.position, this.index, this.normal);
    if (this.drawCovers) {
      let start = this.path.getPointData(0);
      let end = this.path.getPointData(1);
      let startBuf = this.shape.applyOrientation(start).getBuffers(1 / this.cols);
      let endBuf = this.shape.applyOrientation(end).getBuffers(1 / this.cols, true);
      for (let buf of [startBuf, endBuf]) {
        gl.draw(buf.p, buf.idx, buf.n, DrawMethod.Fan);
      }
    }
  }
}
export class Surface {
  constructor(shape, orientation = {p: [0, 0, 0], t: [0, 0, -1], n: [0, 1, 0]}) {
    this.transform = mat4.create();
    this.fill = true;
    this.outline = false;
    this.system = true;
    this.shape = shape;
    this.orientation = orientation;
  }
  setTransform(transform) {
    this.shape.setTransform(transform);
    this.transform = transform;
    return this;
  }
  applyOrientation(orientation) {
    if (!orientation.b) {
      orientation.b = vec3.cross(vec3.create(), orientation.t, orientation.n);
    }
    return this.setTransform(buildLevelMatrix(orientation));
  }
  getOrientation() {
    let {p, t, n} = this.orientation;
    let b = [...vec3.cross(vec3.create(), t, n).values()];
    this.orientation.b = b;
    return applyTransform(this.transform, {p, t, n, b});
  }
  shapePoint(u) {
    let {p, n, t, b} = this.shape.getPointData(u);
    return {p, n, t, b};
  }
  draw(gl) {
    let {p: center, t, n, b} = this.getOrientation();
    if (this.outline)
      this.shape.glDraw(gl);
    if (this.fill) {
      let points = [...center];
      let normals = [...t];
      for (let u = 0; u <= 1.001; u = u + DEFAULT_DELTA) {
        const {p} = this.shape.getPointData(u);
        points.push(...p);
        normals.push(...t);
      }
      let n_points = points.length / 3;
      let index = [...Array(n_points).keys()];
      gl.draw(points, index, normals, DrawMethod.Fan);
    }
    if (this.system) {
      gl.drawVec(center, t, 2, [1, 0, 0, 1, 0, 0]);
      gl.drawVec(center, n, 2, [0, 1, 0, 0, 1, 0]);
      gl.drawVec(center, b, 2, [0, 0, 1, 0, 0, 1]);
    }
  }
  getBuffers(delta = DEFAULT_DELTA, invertNormals = false) {
    const {p: center, t: _t} = this.getOrientation();
    const t = invertNormals ? vec3.fromValues(-1 * _t[0], -1 * _t[1], -1 * _t[2]) : _t;
    let points = [...center];
    let normals = [...t];
    for (let u = 0; u <= 1.001; u = u + delta) {
      const {p} = this.shape.getPointData(u);
      points.push(...p);
      normals.push(...t);
    }
    let n_points = points.length / 3;
    let index = [...Array(n_points).keys()];
    return {p: points, idx: index, n: normals};
  }
}
function buildLevelMatrix(orientation) {
  let transform = mat4.fromValues(orientation.b[0], orientation.b[1], orientation.b[2], 0, orientation.n[0], orientation.n[1], orientation.n[2], 0, orientation.t[0], orientation.t[1], orientation.t[2], 0, orientation.p[0], orientation.p[1], orientation.p[2], 1);
  return transform;
}
