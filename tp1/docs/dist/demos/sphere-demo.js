import {WebGL} from "../scripts/webgl.js";
import {Sphere} from "../scripts/prefabs/sphere.js";
import {Object3D, Transformation} from "../scripts/object.js";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init();
function to_rads(angle) {
  return Math.PI * angle / 180;
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
var sonSphere3 = new Object3D(new Sphere(60, 60, 0.5), sonTransforms3, []);
var sonSphere2 = new Object3D(new Sphere(60, 60, 2), sonTransforms2, []);
var sonSphere = new Object3D(new Sphere(60, 60, 2), sonTransforms, []);
var sphere = new Object3D(new Sphere(60, 60, 4), [
  Transformation.rotation(to_rads(90), [0, -1, 0]),
  Transformation.scale([0.4, 0.4, 0.4]),
  Transformation.translate([0, -1, 0])
], []);
sphere.setChildren([sonSphere, sonSphere2, sonSphere3]);
sphere.draw(gl);
