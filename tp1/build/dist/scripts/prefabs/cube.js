import {BSpline} from "../curves/bspline.js";
import {SweepSurface} from "../sweep/sweep.js";
import {Path} from "../sweep/path.js";
export class Cube extends SweepSurface {
  constructor(width, height = width) {
    let path = BSpline.straightLines([
      [0, -width / 2, 0],
      [0, height / 2, 0]
    ]);
    let shape = BSpline.straightLines([
      [-width / 2, height / 2, 0],
      [width / 2, height / 2, 0],
      [width / 2, -height / 2, 0],
      [-width / 2, -height / 2, 0],
      [-width / 2, height / 2, 0]
    ]);
    super(new Path(shape, path));
  }
}
