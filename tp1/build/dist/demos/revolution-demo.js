import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {Revolution} from "../scripts/revolution.js";
import {BSpline} from "../scripts/curves/bspline.js";
import {vec3} from "../../snowpack/pkg/gl-matrix.js";
import {Surface, SweepSurface} from "../scripts/sweep.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
var angle = 0;
function animate(t) {
  sweep.updateTransform([
    Transformation.rotation(t, [1, 0, 1]),
    Transformation.rotation(t * 3, [0, 1, 0])
  ]);
}
function tick() {
  requestAnimationFrame(tick);
  sweep.draw(gl);
  angle += 0.01;
  animate(angle);
}
function getOrientation(x = 0, y = 0, z = 0) {
  return {
    p: vec3.fromValues(x, y, z),
    n: vec3.fromValues(0, 1, 0),
    t: vec3.fromValues(0, 0, -1)
  };
}
function getShape(len) {
  return BSpline.straightLines([
    [-len / 2, -len / 2, 0],
    [-len / 2, len / 2, 0],
    [len / 2, len / 2, 0],
    [len / 2, -len / 2, 0],
    [-len / 2, -len / 2, 0]
  ]);
}
function getPath(revAngle) {
  let p = vec3.fromValues(0, 0, 0);
  let n = vec3.fromValues(0, 1, 0);
  let t = vec3.fromValues(1, 0, 0);
  return new Revolution({p, n, t}, revAngle);
}
let shape = getShape(2);
let surface = new Surface(shape, getOrientation());
let path = getPath(5);
var sweep = new Object3D(new SweepSurface(surface, path), [], []);
tick();
