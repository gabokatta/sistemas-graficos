import type { vec3 } from "gl-matrix";
import { Curve, CurveLevel, Segment } from "./curve";

export class BSpline extends Curve {

    constructor(points: vec3[], level: CurveLevel) {
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
    }

    getSegmentAmount(): number {
      return this.controlPoints.length - this.level;
    }

    segmentPoints(segment: number): vec3[] {
      return this.controlPoints.slice(segment, segment + this.level + 1); 
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
      (u: number) => -1 + u,
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