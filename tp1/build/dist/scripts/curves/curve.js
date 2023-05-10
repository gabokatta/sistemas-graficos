import {mat4, vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {DEFAULT_DELTA, Segment} from "./segment.js";
import {DrawMethod} from "../webgl.js";
export class Curve {
  constructor(points, level) {
    this.length = 0;
    this.B = [];
    this.dB = [];
    this.transform = mat4.create();
    this.controlPoints = points;
    this.level = level;
    this.segments = this.buildSegments();
  }
  draw(ctx) {
    this.segments.forEach((s) => {
      s.drawOnCanvas(ctx, true);
    });
  }
  glDraw(gl, delta = DEFAULT_DELTA, controlPoints = false) {
    let {p, n} = this.discretize(delta);
    const idx = [...Array(p.length / 3).keys()];
    gl.draw(p, idx, n, DrawMethod.LineStrip);
  }
  discretize(delta = DEFAULT_DELTA) {
    let discretized = {p: [], n: [], b: [], t: []};
    for (let u = 0; u <= 1.001; u += delta) {
      let data = this.getPointData(u);
      discretized.p.push(...data.p);
      discretized.n.push(...data.n);
      discretized.b.push(...data.b);
      discretized.t.push(...data.t);
    }
    return discretized;
  }
  setTransform(transform) {
    this.transform = transform;
    return this;
  }
  getPointData(u) {
    const {segment, localU} = this.coordToSegment(u);
    return this.applyTransform(segment.evaluate(localU));
  }
  buildSegments() {
    this.validateControlPoints();
    let segments = [];
    let segAmount = this.getSegmentAmount();
    for (let i = 0; i < segAmount; i++) {
      let points = this.segmentPoints(i);
      segments.push(new Segment(points, this));
    }
    return segments;
  }
  coordToSegment(u) {
    let resultSegment = void 0;
    for (let s of this.segments) {
      let globalLength = s.length / this.length;
      if (u <= globalLength) {
        resultSegment = s;
        break;
      }
      u -= globalLength;
    }
    if (resultSegment == void 0) {
      return {segment: this.segments.slice(-1)[0], localU: 1};
    }
    const localU = u / (resultSegment.length / this.length);
    return {segment: resultSegment, localU};
  }
  validateControlPoints() {
    const n = this.controlPoints.length;
    let valid = this.level == CurveLevel.CUADRATIC ? n >= 3 && (n - 1) % 2 === 0 : n >= 4 && (n - 1) % 3 === 0;
    if (!valid) {
      throw new Error("Invalid amount of control points.");
    }
  }
  changeBinormalDirection(segmentIndexes, binormal) {
    for (let index of segmentIndexes) {
      this.segments[index].binormal = binormal;
    }
  }
  applyTransform(data) {
    return {
      p: vec3.transformMat4(vec3.create(), data.p, this.transform),
      t: vec3.transformMat4(vec3.create(), data.t, this.transform),
      n: vec3.transformMat4(vec3.create(), data.n, this.transform),
      b: vec3.transformMat4(vec3.create(), data.b, this.transform)
    };
  }
}
export var CurveLevel;
(function(CurveLevel2) {
  CurveLevel2[CurveLevel2["CUADRATIC"] = 2] = "CUADRATIC";
  CurveLevel2[CurveLevel2["CUBIC"] = 3] = "CUBIC";
})(CurveLevel || (CurveLevel = {}));
