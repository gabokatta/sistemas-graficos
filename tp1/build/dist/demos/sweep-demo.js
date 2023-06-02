import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {SweepSurface} from "../scripts/sweep/sweep.js";
import {Path} from "../scripts/sweep/path.js";
import {Bezier} from "../scripts/curves/bezier.js";
import {CurveLevel} from "../scripts/curves/curve.js";
import {vec3} from "../../snowpack/pkg/gl-matrix.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
function to_rads(angle2) {
  return Math.PI * angle2 / 180;
}
function animate(t) {
  sweep.updateTransform([
    Transformation.rotation(t, [1, 0, 1]),
    Transformation.rotation(t * 3, [0, 1, 0])
  ]);
}
function getPath() {
  const points = [
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 2, 0),
    vec3.fromValues(2, 2, 0),
    vec3.fromValues(2.5, 2, 0),
    vec3.fromValues(3, 2, 0)
  ];
  return new Bezier(points, CurveLevel.CUADRATIC);
}
function getShape() {
  const points = [
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(1.5, 3, 0),
    vec3.fromValues(1.5, 3, 0),
    vec3.fromValues(1.5, 3, 0),
    vec3.fromValues(3, 0, 0),
    vec3.fromValues(3, 0, 0),
    vec3.fromValues(3, 0, 0),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 0, 0)
  ];
  return new Bezier(points, CurveLevel.CUBIC);
}
function tick() {
  requestAnimationFrame(tick);
  sweep.draw(gl);
  angle += 0.01;
  animate(angle);
}
let path = getPath();
let shape = getShape();
let sweepable = new Path(shape, path);
let sweep = new Object3D(new SweepSurface(sweepable), [], [0.5, 1, 0.2]);
gl.setNormalColoring(true);
tick();
