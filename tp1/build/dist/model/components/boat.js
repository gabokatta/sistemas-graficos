import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {Bezier} from "../../scripts/curves/bezier.js";
import {CurveLevel} from "../../scripts/curves/curve.js";
import {Object3D, Transformation} from "../../scripts/object.js";
import {Path} from "../../scripts/sweep/path.js";
import {SweepSurface} from "../../scripts/sweep/sweep.js";
import {params} from "../scene.js";
import {Box} from "../../scripts/prefabs/box.js";
export class Boat {
  static getSpoiler() {
    let base = new Object3D(new Box(6, 3.5, 1.2), [
      Transformation.translate([-4, -5, -1])
    ], params.boat.spoilerColor);
    let top = new Object3D(new Box(7, 1, 2.4), [
      Transformation.translate([-4, -5, -3])
    ], params.boat.spoilerColor);
    let spoiler = new Object3D(void 0, [], []);
    spoiler.setChildren([base, top]);
    return spoiler;
  }
  static getRaft() {
    let path = new Bezier([
      [0, -7.5, 0],
      [0, 0, 0],
      [0, 10, 0]
    ], CurveLevel.CUADRATIC);
    let shape = new Bezier([
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(8, 0, 0),
      vec3.fromValues(8, 0, 0),
      vec3.fromValues(8, 0, 0),
      vec3.fromValues(8, 4, 0),
      vec3.fromValues(4, 4, 0),
      vec3.fromValues(4, 4, 0),
      vec3.fromValues(4, 4, 0),
      vec3.fromValues(0, 4, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0)
    ], CurveLevel.CUBIC);
    shape.changeBinormalDirection([0, 1, 2], [0, 0, -1]);
    let sweepable = new Path(shape, path);
    let geometry = new SweepSurface(sweepable);
    let raft = new Object3D(geometry, [], params.boat.raftColor);
    return raft;
  }
  static getBoxes() {
    let boxes = [];
    for (let i = 0; i <= 12; i++) {
      boxes.push(new Object3D(new Box(2, 2, 5), [
        Transformation.translate(params.boat.boxPositions[i]),
        Transformation.scale([0.35, 0.35, 0.35])
      ], params.boat.boxColors[i]));
    }
    let boxGroup = new Object3D(void 0, [], []);
    boxGroup.setChildren([...boxes]);
    return boxGroup;
  }
  static build() {
    let boat = new Object3D(void 0, [
      Transformation.rotation(to_rads(90), [1, 0, 0]),
      Transformation.rotation(to_rads(90), [0, -1, 0]),
      Transformation.translate(params.boat.position)
    ], []);
    boat.setChildren([
      Boat.getRaft(),
      Boat.getSpoiler(),
      Boat.getBoxes()
    ]);
    return boat;
  }
}
function to_rads(angle) {
  return Math.PI * angle / 180;
}
