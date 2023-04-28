import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {SinTube} from "../scripts/prefabs/sine-tube.js";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init();
function to_rads(angle) {
  return Math.PI * angle / 180;
}
var baseTransforms = [
  Transformation.translate([-5, -5, -10])
];
var tube = new Object3D(new SinTube(100, 100, 2, 0.4, 0.1, 15), baseTransforms, []);
tube.draw(gl);
