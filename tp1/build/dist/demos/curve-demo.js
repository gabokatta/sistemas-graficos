import {vec3} from "../../snowpack/pkg/gl-matrix.js";
import {Bezier} from "../scripts/curves/bezier.js";
import {CurveLevel} from "../scripts/curves/curve.js";
import {BSpline} from "../scripts/curves/bspline.js";
var canvas = document.getElementById("my-canvas");
const points = [
  vec3.fromValues(0, 0, 0),
  vec3.fromValues(0, 200, 0),
  vec3.fromValues(200, 200, 0),
  vec3.fromValues(200, 100, 0),
  vec3.fromValues(200, 0, 0),
  vec3.fromValues(400, 0, 0),
  vec3.fromValues(400, 200, 0),
  vec3.fromValues(400, 400, 0),
  vec3.fromValues(300, 200, 0),
  vec3.fromValues(200, 200, 0),
  vec3.fromValues(100, 200, 0),
  vec3.fromValues(0, 200, 0),
  vec3.fromValues(0, 200, 0)
];
var curve = new BSpline(points, CurveLevel.CUBIC);
const points2 = points.map((p) => {
  const p2 = vec3.clone(p);
  p2[0] += 800;
  p2[1] += 200;
  p[0] += 300;
  p[1] += 200;
  return p2;
});
var curve2 = new Bezier(points2, CurveLevel.CUBIC);
console.log(curve);
curve.draw(canvas.getContext("2d"));
curve2.draw(canvas.getContext("2d"));
