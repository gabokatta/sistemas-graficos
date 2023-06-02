import {Curve, CurveLevel} from "./curve.js";
import {DEFAULT_DELTA} from "./segment.js";
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
  static straightLines(points) {
    let _points = [];
    for (let p of points) {
      _points.push(p, p, p);
    }
    _points.push(...points.slice(-1));
    let splineStraight = new BSpline(_points, CurveLevel.CUBIC);
    splineStraight.segments.pop();
    splineStraight.segments.forEach((s) => {
      s.length = 1;
    });
    splineStraight.length = splineStraight.segments.length;
    return splineStraight;
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
    (u) => (-3 + 6 * u - 3 * u * u) / 6,
    (u) => (-12 * u + 9 * u * u) / 6,
    (u) => (3 + 6 * u - 9 * u * u) / 6,
    (u) => 3 * u * u * 1 / 6
  ];
}
