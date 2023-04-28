import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {SinTube} from "../scripts/prefabs/sine-tube.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
var inverse = true;
function to_rads(angle2) {
  return Math.PI * angle2 / 180;
}
function animate(t) {
  tube.updateTransform([
    Transformation.rotation(t / 2, [0, 0, 1])
  ]);
  let u;
  let v;
  const mod = (n) => {
    return Number(n.toFixed(2)) % 4;
  };
  if (mod(t) == 0) {
    inverse = !inverse;
  }
  u = inverse ? mod(t) : 4 - mod(t);
  v = -u;
  tube2.updateTransform([
    Transformation.translate([0, u * 25, 0])
  ]);
  tube3.updateTransform([
    Transformation.translate([0, v * 25, 0])
  ]);
}
function tick() {
  requestAnimationFrame(tick);
  tube.draw(gl);
  angle += 0.01;
  animate(angle);
}
var baseTransforms = [
  Transformation.scale([0.5, 0.5, 0.5]),
  Transformation.rotation(to_rads(90), [1, 0, 0]),
  Transformation.translate([3, 0, -13])
];
var sonTransforms = [
  Transformation.scale([0.5, 0.5, 0.5])
];
var son2Transforms = [
  Transformation.scale([0.3, 0.3, 0.3])
];
var tube3 = new Object3D(new SinTube(60, 60, 2, 0.4, 0.1, 15), son2Transforms, []);
var tube2 = new Object3D(new SinTube(60, 60, 2, 0.4, 0.1, 15), sonTransforms, []);
var tube = new Object3D(new SinTube(60, 60, 2, 0.4, 0.1, 15), baseTransforms, []);
tube.setChildren([tube2, tube3]);
tick();