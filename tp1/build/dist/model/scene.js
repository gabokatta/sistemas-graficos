import {WebGL} from "../scripts/webgl.js";
import {Parameters} from "./parameters.js";
import {initCamera, updateCamera} from "./camera.js";
import {Boat} from "./components/boat.js";
const vertexShaderPath = "../dist/shaders/vertex.glsl";
const fragmentShaderPath = "../dist/shaders/fragment.glsl";
var params = new Parameters();
var canvas = document.getElementById("my-canvas");
var gl = await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
params.gl = gl;
gl.setNormalColoring(params.normalColoring).setShowSurfaces(true).setShowLines(false);
params.gl = gl;
initCamera();
let boat = Boat.build();
function tick() {
  requestAnimationFrame(tick);
  boat.draw(gl);
  updateCamera(gl);
}
tick();
export {params};
