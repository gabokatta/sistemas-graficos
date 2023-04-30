import type { vec3 } from "gl-matrix";
import { Curve, CurveLevel } from "./curve";

export class BSpline extends Curve {

    controlPoints: vec3[] = [];
    B: Function[] = [];
    dB: Function[] = [];

    constructor(points: vec3[], level: CurveLevel) {
        super(points, level);
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

function cuadraticBases(): Function[] {
    return [
      (u: number) => 0.5 * (1 - u) * (1 - u),
      (u: number) => 0.5 + u * (1 - u),
      (u: number) => 0.5 * u * u
    ];
  }
  
function  cubicBases(): Function[] {
    return [
      (u: number) => (1 - 3 * u + 3 * u * u - u * u * u) * 1 / 6,
      (u: number) => (4 - 6 * u * u + 3 * u * u * u) * 1 / 6,
      (u: number) => (1 + 3 * u + 3 * u * u - 3 * u * u * u) * 1 / 6,
      (u: number) => (u * u * u) * 1 / 6
    ];
  }
  
function cuadraticDer(): Function[] {
    return [
      (u: number) => -1 * (1 - u),
      (u: number) => 1 - 2 * u,
      (u: number) => u
    ];
  }

function  cubicDer(): Function[] {
    return [
      (u: number) => -0.5 * (1 - u) * (1 - u),
      (u: number) => -1.5 * u * u + 2 * u,
      (u: number) => 1.5 * u * u - u,
      (u: number) => 0.5 * u * u
    ];
  }