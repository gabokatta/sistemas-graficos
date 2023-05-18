import {WebGL} from "../scripts/webgl.js";
import {Sphere} from "../scripts/prefabs/sphere.js";
import {Object3D, Transformation} from "../scripts/object.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
let inverse = true;
function animate(t) {
  sphere.updateTransform([
    Transformation.rotation(t * 2, [1, 0, 1])
  ]);
  let u;
  const mod = (n) => {
    return Number(n.toFixed(2)) % 2;
  };
  if (mod(t) == 0) {
    inverse = !inverse;
  }
  u = inverse ? mod(t) : 2 - mod(t);
  sonSphere.updateTransform([
    Transformation.translate([u, u, 0])
  ]);
  sonSphere2.updateTransform([
    Transformation.translate([-u, u, 0])
  ]);
  sonSphere3.updateTransform([
    Transformation.translate([0, 0, u])
  ]);
}
function tick() {
  requestAnimationFrame(tick);
  sphere.draw(gl);
  angle += 0.01;
  animate(angle);
}
function to_rads(angle2) {
  return Math.PI * angle2 / 180;
}
var sonTransforms = [
  Transformation.translate([3, 4, 0])
];
var sonTransforms2 = [
  Transformation.translate([-3, 4, 0])
];
var sonTransforms3 = [
  Transformation.rotation(to_rads(60), [0, 0, 1]),
  Transformation.translate([0, 0, 4.5])
];
var sonSphere3 = new Object3D(new Sphere(0.5), sonTransforms3, []);
var sonSphere2 = new Object3D(new Sphere(2), sonTransforms2, []);
var sonSphere = new Object3D(new Sphere(2), sonTransforms, []);
var sphere = new Object3D(new Sphere(4), [
  Transformation.rotation(to_rads(90), [0, -1, 0]),
  Transformation.scale([0.4, 0.4, 0.4]),
  Transformation.translate([0, -1, 0])
], []);
sphere.setChildren([sonSphere, sonSphere2, sonSphere3]);
gl.setNormalColoring(true);
tick();
