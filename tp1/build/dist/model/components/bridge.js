import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {Bezier} from "../../scripts/curves/bezier.js";
import {CurveLevel} from "../../scripts/curves/curve.js";
import {Path} from "../../scripts/sweep/path.js";
import {SweepSurface} from "../../scripts/sweep/sweep.js";
import {Object3D, Transformation} from "../../scripts/object.js";
import {params} from "../scene.js";
export class Bridge {
  static getTensors() {
  }
  static getRopes() {
  }
  static getRoad(h1 = -10, length = 150) {
    let bumpStart = length / 4;
    let bumpPeak = length / 2;
    let bumpEnd = bumpPeak + bumpStart;
    let startBumpSupport = (bumpStart + bumpPeak) / 2;
    let endBumpSupport = (bumpEnd + bumpPeak) / 2;
    let path = new Bezier([
      [0, 0, 0],
      [0, bumpStart, 0],
      [0, bumpStart, 0],
      [0, bumpStart, 0],
      [0, bumpStart + 2, 0],
      [0, startBumpSupport, h1],
      [0, bumpPeak, h1],
      [0, endBumpSupport, h1],
      [0, bumpEnd - 2, 0],
      [0, bumpEnd, 0],
      [0, bumpEnd, 0],
      [0, bumpEnd, 0],
      [0, length, 0],
      [0, length, 0],
      [0, length, 0],
      [0, length, 0]
    ], CurveLevel.CUBIC);
    let shape = new Bezier([
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(2, 0, 0),
      vec3.fromValues(2, 0, 0),
      vec3.fromValues(2, 0, 0),
      vec3.fromValues(3, 0, 0),
      vec3.fromValues(3, 1, 0),
      vec3.fromValues(4, 1, 0),
      vec3.fromValues(4, 1, 0),
      vec3.fromValues(4, 1, 0),
      vec3.fromValues(22, 1, 0),
      vec3.fromValues(22, 1, 0),
      vec3.fromValues(22, 1, 0),
      vec3.fromValues(23, 1, 0),
      vec3.fromValues(23, 0, 0),
      vec3.fromValues(24, 0, 0),
      vec3.fromValues(24, 0, 0),
      vec3.fromValues(24, 0, 0),
      vec3.fromValues(26, 0, 0),
      vec3.fromValues(26, 0, 0),
      vec3.fromValues(26, 0, 0),
      vec3.fromValues(26, 2.5, 0),
      vec3.fromValues(26, 2.5, 0),
      vec3.fromValues(26, 2.5, 0),
      vec3.fromValues(0, 2.5, 0),
      vec3.fromValues(0, 2.5, 0),
      vec3.fromValues(0, 2.5, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0)
    ], CurveLevel.CUBIC);
    shape.changeBinormalDirection([...Array(shape.segments.length).keys()], [0, 0, -1]);
    let sweepable = new Path(shape, path);
    let geometry = new SweepSurface(sweepable);
    geometry.useCovers = false;
    let road = new Object3D(geometry, [
      Transformation.rotation(to_rads(90), [1, 0, 0])
    ], params.bridge.roadColor);
    return road;
  }
  static getTowers() {
  }
  static build(s1 = 0, h1 = 0, h2 = 0) {
    let bridge = new Object3D(void 0, [
      Transformation.translate([-10, 10, -20])
    ], []);
    bridge.setChildren([
      this.getRoad()
    ]);
    return bridge;
  }
}
function to_rads(angle) {
  return Math.PI * angle / 180;
}
