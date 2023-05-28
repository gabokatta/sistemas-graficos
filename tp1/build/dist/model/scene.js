import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {Bottle} from "../scripts/prefabs/bottle.js";
import {Parameters} from "./parameters.js";
import {initCamera, updateCamera} from "./camera.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var params = new Parameters();
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
params.gl = gl;
gl.setNormalColoring(params.normalColoring).setShowSurfaces(true).setShowLines(params.drawLines);
params.gl = gl;
initCamera();
function tick() {
  requestAnimationFrame(tick);
  sweep.draw(gl);
  sweep2.draw(gl);
  updateCamera(gl);
}
let sweep = new Object3D(new Bottle(1, 2.5), [
  Transformation.scale([0.4, 0.4, 0.4]),
  Transformation.translate([0, -2, 0])
], [1, 1, 1]);
let sweep2 = new Object3D(new Bottle(1, 2.5), [
  Transformation.scale([0.1, 0.1, 0.1]),
  Transformation.translate([5, -2, 0])
], [1, 1, 1]);
tick();
export {params};
