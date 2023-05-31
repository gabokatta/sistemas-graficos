import { WebGL } from "../scripts/webgl"
import { Parameters } from "./parameters";
import { initCamera, updateCamera } from "./camera";
import { Boat } from "./components/boat";
import { Tree } from "./components/tree";
import { Bridge } from "./components/bridge";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';
const uvTexturePath = '../dist/assets/uv.jpg';

var params =  new Parameters();
var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;

var gl =  await new WebGL(canvas).init();
await gl.initTextures();
params.gl = gl;

gl.setNormalColoring(params.normalColoring)
    .setUseTexture(false)
    .setShowSurfaces(true)
    .setShowLines(!params.drawLines);

params.gl = gl;
initCamera();

let boat =  Boat.build();
let tree =  Tree.build();
let bridge = Bridge.build();

function tick() {
    requestAnimationFrame(tick);
    drawScene()
    updateCamera(gl);
}

function drawScene() {
    boat.draw(gl);
    tree.draw(gl);
    bridge.draw(gl);
}

tick();
export {params, boat, tree, bridge};