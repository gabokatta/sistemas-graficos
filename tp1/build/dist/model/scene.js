import {WebGL} from "../scripts/webgl.js";
import {Parameters} from "./parameters.js";
import {initCamera, updateCamera} from "./camera.js";
import {Boat} from "./components/boat.js";
import {Tree} from "./components/tree.js";
import {Bridge} from "./components/bridge.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
const uvTexturePath = "../dist/assets/uv.jpg";
var params = new Parameters();
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init();
await gl.initTextures();
params.gl = gl;
gl.setNormalColoring(params.normalColoring).setUseTexture(false).setShowSurfaces(true).setShowLines(!params.drawLines);
params.gl = gl;
initCamera();
let boat = Boat.build();
let tree = Tree.build();
let bridge = Bridge.build();
function tick() {
  requestAnimationFrame(tick);
  drawScene();
  updateCamera(gl);
}
function drawScene() {
  boat.draw(gl);
  tree.draw(gl);
  bridge.draw(gl);
}
tick();
export {params, boat, tree, bridge};
