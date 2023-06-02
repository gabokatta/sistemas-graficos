import {SweepSurface} from "../sweep/sweep.js";
import {Bezier} from "../curves/bezier.js";
import {CurveLevel} from "../curves/curve.js";
import {Revolution} from "../sweep/revolution.js";
import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
export class Bottle extends SweepSurface {
  constructor(peakRadius, bodyRadius) {
    let shape = new Bezier([
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(peakRadius, 0, 0),
      vec3.fromValues(peakRadius, 0, 0),
      vec3.fromValues(peakRadius, 0, 0),
      vec3.fromValues(peakRadius, 2.5, 0),
      vec3.fromValues(peakRadius, 2.5, 0),
      vec3.fromValues(peakRadius, 2.5, 0),
      vec3.fromValues(bodyRadius, 4.5, 0),
      vec3.fromValues(bodyRadius, 4.5, 0),
      vec3.fromValues(bodyRadius, 5, 0),
      vec3.fromValues(bodyRadius, 7.5, 0),
      vec3.fromValues(bodyRadius, 8, 0),
      vec3.fromValues(bodyRadius, 12, 0),
      vec3.fromValues(0, 12, 0),
      vec3.fromValues(0, 12, 0),
      vec3.fromValues(0, 12, 0)
    ], CurveLevel.CUBIC);
    super(new Revolution(shape));
    this.useCovers = false;
  }
}
