import {WebGL} from "../scripts/webgl.js";
import {Parameters} from "./parameters.js";
import {initCamera, updateCamera} from "./camera.js";
import {Boat} from "./components/boat.js";
import {Tree} from "./components/tree.js";
import {Bridge} from "./components/bridge.js";
import {Terrain} from "./components/terrain.js";
import {Object3D} from "../scripts/object.js";
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
let scene = new Object3D(void 0, [], []);
scene.setChildren([
  Boat.build(),
  Tree.build(),
  Bridge.build(),
  Terrain.build()
]);
function tick() {
  requestAnimationFrame(tick);
  scene.draw(gl);
  updateCamera(gl);
}
tick();
export function to_rads(angle) {
  return Math.PI * angle / 180;
}
export {params};
