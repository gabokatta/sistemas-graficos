import {Bezier} from "../../scripts/curves/bezier.js";
import {BSpline} from "../../scripts/curves/bspline.js";
import {CurveLevel} from "../../scripts/curves/curve.js";
import {Object3D} from "../../scripts/object.js";
import {Path} from "../../scripts/sweep/path.js";
import {SweepSurface} from "../../scripts/sweep/sweep.js";
import {params} from "../scene.js";
export class Boat {
  static getSpoiler() {
  }
  static getRaft() {
    let path = new Bezier([
      [0, -1 / 2, 0],
      [0, 0, 0],
      [0, 1 / 2, 0]
    ], CurveLevel.CUADRATIC);
    let shape = BSpline.straightLines([
      [-1 / 2, -1 / 2, 0],
      [-1 / 2, 1 / 2, 0],
      [1 / 2, 1 / 2, 0],
      [1 / 2, -1 / 2, 0],
      [-1 / 2, -1 / 2, 0]
    ]);
    let sweepable = new Path(shape, path);
    let geometry = new SweepSurface(sweepable);
    return new Object3D(geometry, [], params.boat.raftColor);
  }
  static getBoxes() {
  }
  static build() {
    let boat = new Object3D(void 0, [], []);
    boat.setChildren([Boat.getRaft()]);
    return boat;
  }
}
