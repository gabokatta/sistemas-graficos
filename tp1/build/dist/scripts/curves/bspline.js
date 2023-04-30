import {Curve, CurveLevel} from "./curve.js";
export class BSpline extends Curve {
  constructor(points, level) {
    super(points, level);
    this.controlPoints = [];
    this.B = [];
    this.dB = [];
    switch (this.level) {
      case CurveLevel.CUADRATIC: {
        this.B = cuadraticBases();
        this.dB = cuadraticDer();
      }
      case CurveLevel.CUBIC: {
        this.B = cubicBases();
        this.dB = cubicDer();
      }
    }
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
    (u) => -1 * (1 - u),
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
