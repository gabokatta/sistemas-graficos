import {BSpline} from "../curves/bspline.js";
import {SweepSurface} from "../sweep/sweep.js";
import {Path} from "../sweep/path.js";
import {CurveLevel} from "../curves/curve.js";
export class Cube extends SweepSurface {
  constructor(width, height = width) {
    let path = new BSpline([
      [0, -width / 2, 0],
      [0, -width / 2, 0],
      [0, -width / 2, 0],
      [0, height / 2, 0],
      [0, height / 2, 0],
      [0, height / 2, 0],
      [0, height / 2, 0]
    ], CurveLevel.CUADRATIC);
    let shape = new BSpline([
      [-width / 2, height / 2, 0],
      [-width / 2, height / 2, 0],
      [-width / 2, height / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, -height / 2, 0],
      [width / 2, -height / 2, 0],
      [width / 2, -height / 2, 0],
      [-width / 2, -height / 2, 0],
      [-width / 2, -height / 2, 0],
      [-width / 2, -height / 2, 0],
      [-width / 2, height / 2, 0],
      [-width / 2, height / 2, 0],
      [width / 2, height / 2, 0]
    ], CurveLevel.CUADRATIC);
    super(new Path(shape, path));
  }
}
