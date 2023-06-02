import {Object3D, Transformation} from "../../scripts/object.js";
import {Box} from "../../scripts/prefabs/box.js";
import {params} from "../scene.js";
import {CurveLevel} from "../../scripts/curves/curve.js";
import {vec3} from "../../../snowpack/pkg/gl-matrix.js";
import {Bezier} from "../../scripts/curves/bezier.js";
import {Path} from "../../scripts/sweep/path.js";
import {SweepSurface} from "../../scripts/sweep/sweep.js";
export class Terrain {
  static buildShape(a, b) {
    let half = (a + b) / 2;
    return new Bezier([
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(a, 0, 0),
      vec3.fromValues(a, 0, 0),
      vec3.fromValues(a, 0, 0),
      vec3.fromValues(half - 20, 110, 0),
      vec3.fromValues(half + 20, 110, 0),
      vec3.fromValues(b, 0, 0),
      vec3.fromValues(b, 0, 0),
      vec3.fromValues(b, 0, 0),
      vec3.fromValues(params.bridgeLenght, 0, 0),
      vec3.fromValues(params.bridgeLenght, 125, 0),
      vec3.fromValues(params.bridgeLenght, 125, 0),
      vec3.fromValues(params.bridgeLenght, 125, 0),
      vec3.fromValues(0, 125, 0),
      vec3.fromValues(0, 125, 0),
      vec3.fromValues(0, 125, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 0, 0)
    ], CurveLevel.CUBIC);
  }
  static buildPath() {
    return new Bezier([
      [-params.bridgeLenght / 2, 0, 0],
      [0, 0, 0],
      [params.bridgeLenght / 2, 0, 0]
    ], CurveLevel.CUADRATIC);
  }
  static getWater() {
    let water = new Box(params.bridgeLenght, params.bridgeLenght, 1);
    return new Object3D(water, [
      Transformation.translate([0, 0, 0])
    ], params.terrain.water.color);
  }
  static getGrass() {
    let sweep = new Path(this.buildShape(100, 300), this.buildPath());
    let grass = new SweepSurface(sweep);
    grass.useCovers = false;
    return new Object3D(grass, [
      Transformation.rotation(to_rads(90), [1, 0, 0]),
      Transformation.translate([0, 7, -200])
    ], params.terrain.grass.color);
  }
  static getSand() {
    let sweep = new Path(this.buildShape(125, 275), this.buildPath());
    let grass = new SweepSurface(sweep);
    grass.useCovers = false;
    return new Object3D(grass, [
      Transformation.rotation(to_rads(90), [1, 0, 0]),
      Transformation.translate([0, 5, -200])
    ], params.terrain.sand.color);
  }
  static build() {
    let terrain = new Object3D(void 0, [], []);
    terrain.setChildren([
      this.getWater(),
      this.getGrass(),
      this.getSand()
    ]);
    return terrain;
  }
}
function to_rads(angle) {
  return Math.PI * angle / 180;
}