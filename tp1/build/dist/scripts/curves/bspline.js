import {Curve, CurveLevel, DEFAULT_DELTA} from "./curve.js";
export class BSpline extends Curve {
  constructor(points, level, delta = DEFAULT_DELTA) {
    super(points, level);
    switch (this.level) {
      case CurveLevel.CUADRATIC: {
        this.B = cuadraticBases();
        this.dB = cuadraticDer();
        break;
      }
      case CurveLevel.CUBIC: {
        this.B = cubicBases();
        this.dB = cubicDer();
        break;
      }
    }
    this.segments.forEach((s) => {
      s.length = s.getLength(delta);
      this.length += s.length;
    });
  }
  getSegmentAmount() {
    return this.controlPoints.length - this.level;
  }
  segmentPoints(segment) {
    return this.controlPoints.slice(segment, segment + this.level + 1);
  }
}
function cuadraticBases() {
  return [
    (u) => 0.5 * (1 - u) * (1 - u),
    (u) => 0.5 + u * (1 - u),
    (u) => 0.5 * u * u
  ];
}
function cubicBases() {
  return [
    (u) => (1 - 3 * u + 3 * u * u - u * u * u) * 1 / 6,
    (u) => (4 - 6 * u * u + 3 * u * u * u) * 1 / 6,
    (u) => (1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1 / 6,
    (u) => u * u * u * 1 / 6
  ];
}
function cuadraticDer() {
  return [
    (u) => -1 + u,
    (u) => 1 - 2 * u,
    (u) => u
  ];
}
function cubicDer() {
  return [
    (u) => -0.5 * (1 - u) * (1 - u),
    (u) => -1.5 * u * u + 2 * u,
    (u) => 1.5 * u * u - u,
    (u) => 0.5 * u * u
  ];
}
