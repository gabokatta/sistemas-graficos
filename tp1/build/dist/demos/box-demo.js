import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {Box} from "../scripts/prefabs/box.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
var angle = 0;
var inverse = true;
function animate(t) {
  box.updateTransform([
    Transformation.rotation(t, [1, 0, 1]),
    Transformation.rotation(t * 3, [0, 1, 0])
  ]);
  let u;
  let v;
  const mod = (n) => {
    return Number(n.toFixed(2)) % 1.5;
  };
  if (mod(t) == 0) {
    inverse = !inverse;
  }
  u = inverse ? mod(t) : 1.5 - mod(t);
  v = !inverse ? mod(t) : 1.5 - mod(t);
  boxSon.updateTransform([
    Transformation.rotation(t * 6, [0, 0, 1]),
    Transformation.scale([v, v, v])
  ]);
  boxSon2.updateTransform([
    Transformation.rotation(-t * 6, [1, 0, 1]),
    Transformation.scale([u, u, u])
  ]);
}
function tick() {
  requestAnimationFrame(tick);
  box.draw(gl);
  angle += 0.01;
  animate(angle);
}
var son2Transforms = [
  Transformation.scale([0.5, 0.5, 0.5]),
  Transformation.translate([4, 0, 0])
];
var sonTransforms = [
  Transformation.scale([0.5, 0.5, 0.5]),
  Transformation.translate([-4, 0, 0])
];
var boxSon = new Object3D(new Box(3, 3), sonTransforms, [0.9, 0.7, 0.7]);
var boxSon2 = new Object3D(new Box(3, 3), son2Transforms, [0.9, 0.7, 0.7]);
var box = new Object3D(new Box(3, 3), [], [0.9, 0.7, 0.7]);
box.setChildren([boxSon, boxSon2]);
tick();
