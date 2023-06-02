import { WebGL } from "../scripts/webgl"
import { Parameters } from "./parameters";
import { initCamera, updateCamera } from "./camera";
import { Boat } from "./components/boat";
import { Tree } from "./components/tree";
import { Bridge } from "./components/bridge";
import { Terrain } from "./components/terrain";
import { Object3D, Transformation } from "../scripts/object";

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

let scene =  new Object3D(undefined, [], []);
scene.setChildren([
    Boat.build(),
    Tree.build(),
    Bridge.build(),
    Terrain.build()
])

function tick() {
    requestAnimationFrame(tick);
    scene.draw(gl);
    updateCamera(gl);
}

tick();


export function to_rads(angle: number) {
    return (Math.PI*angle) / 180;
}
export {params};