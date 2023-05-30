import {WebGL } from "../scripts/webgl"
import { Parameters } from "./parameters";
import { initCamera, updateCamera } from "./camera";
import { Boat } from "./components/boat";
import { Tree } from "./components/tree";

const vertexShaderPath = '../dist/shaders/vertex.glsl';
const fragmentShaderPath = '../dist/shaders/fragment.glsl';

var params =  new Parameters();
var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;

var gl =  await new WebGL(canvas).init(vertexShaderPath, fragmentShaderPath);
params.gl = gl;

gl.setNormalColoring(params.normalColoring)
    .setUseTexture(false)
    .setShowSurfaces(true)
    .setShowLines(!params.drawLines);

params.gl = gl;
initCamera();

let boat =  Boat.build();
let tree =  Tree.build();


function tick() {
    requestAnimationFrame(tick);
    boat.draw(gl);
    tree.draw(gl);
    updateCamera(gl);
}

tick();
export {params};