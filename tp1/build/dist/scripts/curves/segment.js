import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {CurveLevel} from "./curve.js";
export const DEFAULT_DELTA = 0.01;
export class Segment {
  constructor(points = [], curve) {
    this.length = 0;
    this.controlPoints = points;
    this.curve = curve;
  }
  drawOnCanvas(ctx, showQuad, delta = 0.01, width = 2) {
    let p = [this.controlPoints[0], this.controlPoints[1], this.controlPoints[2]];
    if (this.curve.level == CurveLevel.CUBIC) {
      p.push(this.controlPoints[3]);
    }
    ctx.lineWidth = width;
    if (showQuad) {
      ctx.beginPath();
      ctx.strokeStyle = "#FF9900";
      ctx.moveTo(p[0][0], p[0][1]);
      ctx.lineTo(p[1][0], p[1][1]);
      ctx.lineTo(p[2][0], p[2][1]);
      if (this.curve.level == CurveLevel.CUBIC)
        ctx.lineTo(p[3][0], p[3][1]);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    for (let u = 0; u <= 1.001; u += delta) {
      const p2 = this.getPoint(u);
      ctx.lineTo(p2[0], p2[1]);
    }
    ctx.stroke();
  }
  evaluate(u, delta = DEFAULT_DELTA) {
    let tangent = this.getTangent(u);
    let binormal = vec3.normalize(vec3.create(), this.getBinormal(u, delta, tangent));
    let normal = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), binormal, tangent));
    return {
      point: this.getPoint(u),
      tangent,
      normal,
      binormal
    };
  }
  getPoint(u) {
    return this.applyBases(u, this.curve.B, this.curve.level);
  }
  getTangent(u) {
    return vec3.normalize(vec3.create(), this.applyBases(u, this.curve.dB, this.curve.level));
  }
  getBinormal(u, delta, tangent) {
    let current = this.getPoint(u);
    let next = this.getPoint(u + delta);
    let vector = vec3.sub(vec3.create(), current, next);
    vec3.scale(vector, vector, 1);
    return vec3.cross(vec3.create(), tangent, vector);
  }
  getLength(delta) {
    let length = 0;
    for (let u = 0; u < 1 - delta; u += delta) {
      let curr_p = this.getPoint(u);
      let next_p = this.getPoint(u + delta);
      length += vec3.dist(curr_p, next_p);
    }
    return length;
  }
  applyBases(u, bases, level) {
    let x, y, z;
    let p0 = this.controlPoints[0];
    let p1 = this.controlPoints[1];
    let p2 = this.controlPoints[2];
    if (level === CurveLevel.CUADRATIC) {
      x = bases[0](u) * p0[0] + bases[1](u) * p1[0] + bases[2](u) * p2[0];
      y = bases[0](u) * p0[1] + bases[1](u) * p1[1] + bases[2](u) * p2[1];
      z = bases[0](u) * p0[2] + bases[1](u) * p1[2] + bases[2](u) * p2[2];
    } else {
      let p3 = this.controlPoints[3];
      x = bases[0](u) * p0[0] + bases[1](u) * p1[0] + bases[2](u) * p2[0] + bases[3](u) * p3[0];
      y = bases[0](u) * p0[1] + bases[1](u) * p1[1] + bases[2](u) * p2[1] + bases[3](u) * p3[1];
      z = bases[0](u) * p0[2] + bases[1](u) * p1[2] + bases[2](u) * p2[2] + bases[3](u) * p3[2];
    }
    return vec3.fromValues(x, y, z);
  }
}
