import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {Bottle} from "../scripts/prefabs/bottle.js";
import {Drone} from "../scripts/cameras/drone.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
function tick() {
  requestAnimationFrame(tick);
  sweep.draw(gl);
  camera.update(gl);
}
let sweep = new Object3D(new Bottle(1, 2.5), [
  Transformation.scale([0.4, 0.4, 0.4]),
  Transformation.translate([0, -2, 0])
], [1, 1, 1]);
gl.setNormalColoring(false);
gl.showLines = true;
let camera = new Drone(gl, [0, 0, 10]);
tick();