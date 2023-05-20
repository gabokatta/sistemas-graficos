import {WebGL} from "../scripts/webgl.js";
import {Object3D, Transformation} from "../scripts/object.js";
import {Bottle} from "../scripts/prefabs/bottle.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
let angle = 0;
function animate(t) {
  sweep.updateTransform([
    Transformation.rotation(t * 2, [1, 0, 0]),
    Transformation.rotation(t, [0, 0, 1])
  ]);
}
function tick() {
  requestAnimationFrame(tick);
  sweep.draw(gl);
  angle += 0.01;
  animate(angle);
}
let sweep = new Object3D(new Bottle(1, 2.5), [Transformation.scale([0.5, 0.5, 0.5])], [0.5, 1, 0.2]);
gl.setNormalColoring(false);
sweep.useTexture = true;
tick();
