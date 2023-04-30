import {CurveLevel, Curve} from "./curve.js";
export class Bezier extends Curve {
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
