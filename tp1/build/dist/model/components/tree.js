import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {Object3D, Transformation} from "../../scripts/object.js";
import {Cylinder} from "../../scripts/prefabs/cylinder.js";
import {params} from "../scene.js";
import {CurveLevel} from "../../scripts/curves/curve.js";
import {Revolution} from "../../scripts/sweep/revolution.js";
import {SweepSurface} from "../../scripts/sweep/sweep.js";
import {Bezier} from "../../scripts/curves/bezier.js";
export class Tree {
  static getLeaves(trunkLenght) {
    let trunkCoverage = randomFromInterval(1, trunkLenght - 2);
    let points = [
      vec3.fromValues(0, 5, 0),
      vec3.fromValues(3, 3, 0),
      vec3.fromValues(3, 2, 0),
      vec3.fromValues(1.5, 2.5, 0),
      vec3.fromValues(1.5, 1, 0),
      vec3.fromValues(3, 1, 0),
      vec3.fromValues(3, 0, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0)
    ];
    points.slice(1).forEach((p) => p[1] -= trunkCoverage);
    points.forEach((p) => p[1] += trunkLenght / 2);
    let shape = new Bezier(points, CurveLevel.CUBIC);
    let leafs = new SweepSurface(new Revolution(shape));
    return new Object3D(leafs, [], params.tree.leafColor);
  }
  static getTrunk(length) {
    let geometry = new Cylinder(1, length);
    return new Object3D(geometry, [
      Transformation.rotation(to_rads(90), [1, 0, 0])
    ], params.tree.trunkColor);
  }
  static build(trunkLenght = 5) {
    let tree = new Object3D(void 0, [
      Transformation.translate([5, 5, 5])
    ], []);
    tree.setChildren([
      Tree.getTrunk(trunkLenght),
      Tree.getLeaves(trunkLenght)
    ]);
    return tree;
  }
}
function to_rads(angle) {
  return Math.PI * angle / 180;
}
function randomFromInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}
