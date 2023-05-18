import {SweepSurface} from "../sweep/sweep.js";
import {Path} from "../sweep/path.js";
import {Bezier} from "../curves/bezier.js";
import {CurveLevel} from "../curves/curve.js";
import {BSpline} from "../curves/bspline.js";
export class Box extends SweepSurface {
  constructor(width, height = width) {
    let path = new Bezier([
      [0, -width / 2, 0],
      [0, 0, 0],
      [0, height / 2, 0]
    ], CurveLevel.CUADRATIC);
    let shape = BSpline.straightLines([
      [-width / 2, -height / 2, 0],
      [-width / 2, height / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, -height / 2, 0],
      [-width / 2, -height / 2, 0]
    ]);
    super(new Path(shape, path));
  }
}