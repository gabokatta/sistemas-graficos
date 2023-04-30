import type { vec3 } from "gl-matrix";
import { CurveLevel, Curve } from "./curve";

export class Bezier extends Curve {
    
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
      (u: number) => (1-u)*(1-u),
      (u: number) => 2*u*(1-u),
      (u: number) => u*u
    ];
  }
  
  function  cubicBases(): Function[] {
    return [
      (u: number) => (1-u)*(1-u)*(1-u),
      (u: number) => 3*(1-u)*(1-u)*u,
      (u: number) => 3*(1-u)*u*u,
      (u: number) => u*u*u
    ];
  }
  
  function cuadraticDer(): Function[] {
    return [
      (u: number) => -2+2*u,
      (u: number) => 2-4*u,
      (u: number) => 2*u
    ];
  }
  
  function cubicDer(): Function[] {
    return [
      (u: number) => -3*u*u+6*u-3,
      (u: number) => 9*u*u-12*u+3,
      (u: number) => -9*u*u+6*u,
      (u: number) => 3*u*u
    ];
  }