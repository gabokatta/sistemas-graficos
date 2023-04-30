import {CurveLevel, Curve, DEFAULT_DELTA} from "./curve.js";
export class Bezier extends Curve {
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
  segmentPoints(segment) {
    return this.level == CurveLevel.CUBIC ? this.controlPoints.slice(segment * 3, segment * 3 + 4) : this.controlPoints.slice(segment * 2, segment * 2 + 3);
  }
  getSegmentAmount() {
    const n = this.controlPoints.length;
    return (n - 1) / this.level;
  }
}
function cuadraticBases() {
  return [
    (u) => (1 - u) * (1 - u),
    (u) => 2 * u * (1 - u),
    (u) => u * u
  ];
}
function cubicBases() {
  return [
    (u) => (1 - u) * (1 - u) * (1 - u),
    (u) => 3 * (1 - u) * (1 - u) * u,
    (u) => 3 * (1 - u) * u * u,
    (u) => u * u * u
  ];
}
function cuadraticDer() {
  return [
    (u) => -2 + 2 * u,
    (u) => 2 - 4 * u,
    (u) => 2 * u
  ];
}
function cubicDer() {
  return [
    (u) => -3 * u * u + 6 * u - 3,
    (u) => 9 * u * u - 12 * u + 3,
    (u) => -9 * u * u + 6 * u,
    (u) => 3 * u * u
  ];
}
